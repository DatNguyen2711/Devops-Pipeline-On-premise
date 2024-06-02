#!/bin/bash

# This script fetches the list of tags for a specific repository in Harbor Registry and saves them to a text file.
#
# Configuration:
# - HARBOR_SERVER: The URL of the Harbor Registry server.
# - USERNAME: The username for authentication.
# - PASSWORD: The password for authentication.
# - PROJECT_NAME: The name of the project containing the repository.
# - REPOSITORY_NAME: The name of the repository to fetch tags for.

# Cấu hình thông tin
HARBOR_SERVER="https://registry.datlaid-regsitry.store" 
USERNAME="admin"                                      
PASSWORD="234555ax"                                   
PROJECT_NAME="pharmacy_web_frontend"                 
REPOSITORY_NAME="pharmacy-website"                   

TOKEN=$(echo -n "$USERNAME:$PASSWORD" | base64)

response=$(curl -s -k -H "Authorization: Basic $TOKEN" "${HARBOR_SERVER}/api/v2.0/projects/${PROJECT_NAME}/repositories/${REPOSITORY_NAME}/artifacts?with_tag=true")

echo "$response" | jq -r '.[].tags[].name' >images_FE_tags.txt

IMAGE_TAG=$(head -n 1 images_FE_tags.txt)

sed -i '/^IMAGE_TAG_FE=/s/=.*/='"$IMAGE_TAG"'/' .env

echo "Frontend image tag updated successfully: $IMAGE_TAG"
