#!/bin/bash

# This script is to display the most common IP address sent request to your application

# Kiểm tra xem file access.log có tồn tại không
if [ ! -f "/path/to/access.log" ]; then
    echo "File access.log không tồn tại."
    exit 1
fi

# Sử dụng awk để lấy ra cột IP từ file access.log, sau đó sử dụng sort và uniq để đếm tần suất xuất hiện của mỗi IP
# Sử dụng sort -nr để sắp xếp theo thứ tự giảm dần
# Lấy ra dòng đầu tiên (IP xuất hiện nhiều nhất) và ghi vào file txt
most_common_ip=$(awk '{print $1}' /path/to/access.log | sort | uniq -c | sort -nr | head -n 1)
echo "$most_common_ip" > most_common_ip.txt
