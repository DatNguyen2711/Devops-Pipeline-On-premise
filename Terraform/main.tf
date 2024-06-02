terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region  = "ap-southeast-1"
  profile = "default" # Tên profile trong file credentials chứa access key và secret key
}

resource "tls_private_key" "rsa_4096" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

variable "key_name" {

}

resource "aws_key_pair" "key_pair" {
  key_name   = var.key_name
  public_key = tls_private_key.rsa_4096.public_key_openssh
}


resource "local_file" "private_key" {
  content  = tls_private_key.rsa_4096.private_key_pem
  filename = var.key_name
}

resource "aws_instance" "TF_Instance" {
  ami           = "ami-06c4be2792f419b7b"
  instance_type = "t2.micro"
  key_name      = aws_key_pair.key_pair.key_name
  security_groups = [aws_security_group.instance_sg.name]  # Gán security group cho instance

  tags = {
    Name = "TF_Instance"
  }
}
resource "aws_security_group" "instance_sg" {
  name        = "tf-instance-sg"
  description = "Security group for Terraform EC2 instance"
  vpc_id      = "vpc-07ba57048143490ea"  # Thay bằng ID của VPC của bạn

  // Tạo các rule cho security group
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Cho phép từ mọi địa chỉ IP
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Cho phép từ mọi địa chỉ IP
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Cho phép từ mọi địa chỉ IP
  }
  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Cho phép từ mọi địa chỉ IP
  }
}
