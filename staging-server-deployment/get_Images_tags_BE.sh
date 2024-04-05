#!/bin/bash

# Cấu hình thông tin
HARBOR_SERVER="https://registry.datlaid-regsitry.store" # Thay thế <harbor_registry_server> bằng địa chỉ của Harbor Registry
USERNAME="admin"                                        # Thay thế bằng tên người dùng của bạn
PASSWORD="234555ax"                                     # Thay thế bằng mật khẩu của bạn
PROJECT_NAME="pharmacy_web_backend"
REPOSITORY_NAME="pharmacy-website-be"

TOKEN=$(echo -n "$USERNAME:$PASSWORD" | base64)

response=$(curl -s -k -H "Authorization: Basic $TOKEN" "${HARBOR_SERVER}/api/v2.0/projects/${PROJECT_NAME}/repositories/${REPOSITORY_NAME}/artifacts?with_tag=true")
echo "$response" | jq -r '.[].tags[].name' >images_BE_tags.txt

IMAGE_TAG=$(head -n 1 images_BE_tags.txt)

sed -i '/^IMAGE_TAG_BE=/s/=.*/='"$IMAGE_TAG"'/' .env

echo "Backend image tag đã được cập nhật thành công: $IMAGE_TAG"
