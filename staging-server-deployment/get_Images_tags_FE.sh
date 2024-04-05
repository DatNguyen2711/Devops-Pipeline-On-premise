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
HARBOR_SERVER="https://registry.datlaid-regsitry.store"  # Thay thế <harbor_registry_server> bằng địa chỉ của Harbor Registry
USERNAME="admin"                                        # Thay thế bằng tên người dùng của bạn
PASSWORD="234555ax"                                     # Thay thế bằng mật khẩu của bạn
PROJECT_NAME="pharmacy_web_frontend"                   # Thay thế bằng tên project của bạn
REPOSITORY_NAME="pharmacy-website"                      # Thay thế bằng tên repository của bạn

# Lấy token từ tên người dùng và mật khẩu
TOKEN=$(echo -n "$USERNAME:$PASSWORD" | base64)

# Gửi yêu cầu API để lấy danh sách các tags của các artifacts
response=$(curl -s -k -H "Authorization: Basic $TOKEN" "${HARBOR_SERVER}/api/v2.0/projects/${PROJECT_NAME}/repositories/${REPOSITORY_NAME}/artifacts?with_tag=true")

# Lấy tags từ response và ghi vào file txt trong thư mục images_tag
echo "$response" | jq -r '.[].tags[].name' >images_FE_tags.txt