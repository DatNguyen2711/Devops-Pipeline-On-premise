## Getting Started

First, to run the development server:

## Deploy on VPS

Step 1: Buy a VPS (At least 4GB Ram and 10GB because SQL server is heavily )

Step 2: Download Docker (latest version is best)

```bash
mkdir -p /tools/docker

touch docker-install.sh && chmod +x docker-install.sh && nano docker-install.sh

#!/bin/bash
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update -y
sudo apt install docker-ce -y
sudo systemctl start docker
sudo systemctl enable docker
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker -v
docker-compose -v


sh docker-install.sh

sudo -i

usermod -aG docker {your_non_root_username}
systemctl start docker
```

Step 3 : Clone this Repo and cd path/to/the staging-server-deployment
Step 4 :

```bash
docker login -u admin -p 234555ax https://registry.datlaid-regsitry.store/

```

Step 5 : Install Nginx

```bash
sudo apt install nginx -y

sudo rm -rf /etc/nginx/sites-available/default
sudo rm -rf /etc/nginx/sites-enabled/default


sudo touch /etc/nginx/sites-available/{your_custom_project_name}

sudo nano {your_custom_project_name}

server {
        listen [::]:80;
        listen 80;

        # allow upload file with size upto 500MB
        client_max_body_size 500M;

        server_name _;

        location / {
                proxy_pass http://{your_public_ip_address}:8900;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_set_header x-forwarded-for $remote_addr;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_cache_bypass $http_upgrade;
        }

        location /api {
                proxy_pass http://{your_public_ip_address}:8080;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_set_header x-forwarded-for $remote_addr;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_cache_bypass $http_upgrade;
        }
}
sudo ln -s /etc/nginx/sites-available/{your_custom_project_name} /etc/nginx/sites-enabled/

sudo nginx -t

sudo systemctl restart nginx

```

Step 6:
Type this:

```bash
sh get_Images_tags_BE.sh && sh get_Images_tags_FE.sh

./start_backend.sh && ./start_frontend.sh

docker compose up -d
```

## Bonus

You can using certbot and buy an domain:

Step 1: install certbot
```bash
sudo apt update
sudo apt install snapd
sudo snap install --classic certbot

```

Step 2: configure the nginx file 

```bash


sudo nano {your_custom_project_name}

server {
        listen [::]:80;
        listen 80;

        # allow upload file with size upto 500MB
        client_max_body_size 500M;

        server_name your_domain(example: datlaid.com);

        location / {
                proxy_pass http://{your_public_ip_address}:8900;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_set_header x-forwarded-for $remote_addr;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_cache_bypass $http_upgrade;
        }

        location /api {
                proxy_pass http://{your_public_ip_address}:8080;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_set_header x-forwarded-for $remote_addr;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_cache_bypass $http_upgrade;
        }
}
sudo ln -s /etc/nginx/sites-available/{your_custom_project_name} /etc/nginx/sites-enabled/

sudo nginx -t

sudo certbot --nginx -d your_domain 

sudo systemctl restart nginx

_Note: I deleted my registry so you guys have to create a new one :)))) Sorry about that_

```
