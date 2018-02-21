import time
import logging
import argparse
import datetime

from os import path
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient

parser = argparse.ArgumentParser()
parser.add_argument("-e", "--endpoint", action="store", required=True, dest="host", help="Your AWS IoT custom endpoint")
parser.add_argument("-t", "--topic", action="store", dest="topic", default="myTopic", help="Targeted topic")

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
  message['temperature'] = 1
  message['createdAt'] = datetime.datetime.now().isoformat()
  messageJson = json.dumps(message)
  myAWSIoTMQTTClient.publish(topic, messageJson, 1)

