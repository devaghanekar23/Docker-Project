#!/bin/bash
# ------------------------------------------------------------
# install-docker.sh
# Installs Docker Engine + Docker Compose plugin on Ubuntu (EC2)
# Project : Containerizing and Deploying the Weather App
# Usage   : chmod +x install-docker.sh && ./install-docker.sh
# ------------------------------------------------------------

set -e   # stop the script if any command fails

echo "=== Step 1: Update package repository ==="
sudo apt update -y

echo "=== Step 2: Install required packages ==="
sudo apt install -y ca-certificates curl gnupg

echo "=== Step 3: Add Docker's official GPG key ==="
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor --yes -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "=== Step 4: Add Docker repository ==="
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

echo "=== Step 5: Install Docker Engine and Compose plugin ==="
sudo apt update -y
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "=== Step 6: Start and enable Docker service ==="
sudo systemctl start docker
sudo systemctl enable docker

echo "=== Step 7: Run Docker without sudo ==="
sudo usermod -aG docker "$USER"

echo "=== Step 8: Verify installation ==="
docker --version
docker compose version
sudo systemctl status docker --no-pager | head -n 5
sudo docker run --rm hello-world

echo ""
echo "Docker installation completed successfully."
echo "NOTE: Run 'newgrp docker' or log out and log in again to use docker without sudo."