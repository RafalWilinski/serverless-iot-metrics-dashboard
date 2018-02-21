# Serverless IoT Metrics Dashboard

![Serverless IoT Metrics Dashboard](assets/rpi-iot-serverless.png?raw=true "Serverless IoT Metrics Dashboard")

Goal of this project is to create Serverless & code-less (as possible) solution for gathering data from IoT sensors to the cloud without Lambda functions.

### Running the project
```
git clone https://github.com/RafalWilinski/serverless-iot-metrics-dashboard
cd serverless-iot-metrics-dashboard

# Create X509 Certificates
./create-certificate.sh

# Deploy
cd backend && serverless deploy && serverless create-appsync
```

### Structure
`backend` - contains Serverless Framework based infrastructure
`collector` - script gathering metrics from Raspberry Pi connected to the cloud
`dashboard` - frontend for representing the data

### Data flow
1. Python based `collector` pushes metrics via MQTT protocol to AWS IoT
2. AWS IoT uses IoT rule to push the data to AWS DynamoDB
3. Data from DynamoDB can be queried via AWS AppSync
