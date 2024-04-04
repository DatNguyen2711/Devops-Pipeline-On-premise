#!/bin/bash

# Đọc dòng đầu tiên từ file images_FE_tags.txt
IMAGE_TAG=$(head -n 1 images_FE_tags.txt)

# Cập nhật hoặc thêm biến IMAGE_TAG_FE trong file .env
sed -i '/^IMAGE_TAG_FE=/s/=.*/='"$IMAGE_TAG"'/' .env

# Thông báo thành công
echo "Frontend image tag đã được cập nhật thành công: $IMAGE_TAG"

