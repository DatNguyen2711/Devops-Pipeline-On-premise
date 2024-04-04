#!/bin/bash

# Đọc dòng đầu tiên từ file images_BE_tags.txt
IMAGE_TAG=$(head -n 1 images_BE_tags.txt)

# Cập nhật hoặc thêm biến IMAGE_TAG_BE trong file .env
sed -i '/^IMAGE_TAG_BE=/s/=.*/='"$IMAGE_TAG"'/' .env

# Thông báo thành công
echo "Backend image tag đã được cập nhật thành công: $IMAGE_TAG"
