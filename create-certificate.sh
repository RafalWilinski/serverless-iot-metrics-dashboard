# Stop script on error
set -e

# Create directory for credentials
mkdir -p collector/creds && cd collector/creds

# Check to see if root CA file exists, download if not
if [ ! -f ./root-CA.crt ]; then
  printf "\nDownloading AWS IoT Root CA certificate from Symantec...\n"
  curl https://www.symantec.com/content/en/us/enterprise/verisign/roots/VeriSign-Class%203-Public-Primary-Certification-Authority-G5.pem > root-CA.crt
fi

ARN=$(eval aws iot create-keys-and-certificate --set-as-active \
  --public-key-outfile metrics.public.key \
  --private-key-outfile metrics.private.key \
  --certificate-pem-outfile metrics.cert.pem | jq .certificateArn)

rm -fr ../../backend/certificateArn.yml
printf "arn: %s" "$ARN" >> ../../backend/certificateArn.yml

