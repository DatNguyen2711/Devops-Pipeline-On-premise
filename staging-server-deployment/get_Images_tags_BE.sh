#!/bin/bash

# information config
HARBOR_SERVER="https://registry.datlaid-regsitry.store" # Replace <harbor_registry_server> with your Harbor Registry address
USERNAME="admin"                                        # Replace by your account name
PASSWORD="234555ax"                                     # Replace by your password
PROJECT_NAME="pharmacy_web_backend"
REPOSITORY_NAME="pharmacy-website-be"

TOKEN=$(echo -n "$USERNAME:$PASSWORD" | base64)

response=$(curl -s -k -H "Authorization: Basic $TOKEN" "${HARBOR_SERVER}/api/v2.0/projects/${PROJECT_NAME}/repositories/${REPOSITORY_NAME}/artifacts?with_tag=true")
echo "$response" | jq -r '.[].tags[].name' >images_BE_tags.txt

IMAGE_TAG=$(head -n 1 images_BE_tags.txt)

sed -i '/^IMAGE_TAG_BE=/s/=.*/='"$IMAGE_TAG"'/' .env

echo "Backend image tag updated successfully: $IMAGE_TAG"
