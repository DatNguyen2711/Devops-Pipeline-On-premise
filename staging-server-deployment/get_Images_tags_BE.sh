#!/bin/bash

# Cấu hình thông tin
HARBOR_SERVER="https://registry.datlaid-regsitry.store"  # Thay thế <harbor_registry_server> bằng địa chỉ của Harbor Registry
USERNAME="admin"  # Thay thế bằng tên người dùng của bạn
PASSWORD="234555ax"  # Thay thế bằng mật khẩu của bạn

# Lấy token từ tên người dùng và mật khẩu
TOKEN=$(echo -n "$USERNAME:$PASSWORD" | base64)

# Kiểm tra xem thư mục images_tag và tệp images_FE_tags.txt đã tồn tại chưa

    # Gửi yêu cầu API để lấy danh sách các tags của các artifacts
response=$(curl -s -k -H "Authorization: Basic $TOKEN" "${HARBOR_SERVER}/api/v2.0/projects/pharmacy_web_backend/repositories/pharmacy-website-be/artifacts?with_tag=true")
    # Lấy tags từ response và ghi vào file txt trong thư mục images_tag
echo "$response" | jq -r '.[].tags[].name' > images_BE_tags.txt
