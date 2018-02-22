import time
import json
import random
import logging
import argparse
import datetime

from sense_hat import SenseHat
from os import path
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient

sense = SenseHat()
random.seed()

parser = argparse.ArgumentParser()
parser.add_argument("-e", "--endpoint", action="store", required=True, dest="host", help="Your AWS IoT custom endpoint")
parser.add_argument("-t", "--topic", action="store", dest="topic", default="metrics", help="Targeted topic")

args = parser.parse_args()
host = args.host
topic = args.topic

myAWSIoTMQTTClient = AWSIoTMQTTClient('device')
myAWSIoTMQTTClient.configureEndpoint(host, 8883)
myAWSIoTMQTTClient.configureCredentials('./creds/root-CA.crt', './creds/metrics.private.key', './creds/metrics.cert.pem')

myAWSIoTMQTTClient.connect()

print('Connected!')

while True:
  time.sleep(1)

  message = {}
  sense.clear()

  message['temperature'] = round(sense.get_temperature(), 3) * 1000
  message['pressure'] = round(sense.get_pressure(), 3) * 1000
  message['humidity'] = round(sense.get_humidity(), 3) * 1000
  message['createdAt'] = datetime.datetime.now().isoformat()
  messageJson = json.dumps(message)

  try:
    myAWSIoTMQTTClient.publish(topic, messageJson, 1)
  except:
    print('Failed to send metrics...')

