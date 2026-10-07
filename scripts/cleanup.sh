#!/bin/bash
# ------------------------------------------------------------
# cleanup.sh
# Removes Weather App containers, images and unused Docker resources
# Usage   : ./cleanup.sh            (containers + unused resources)
#           ./cleanup.sh --all      (also removes weather images, compose stack and volumes)
# ------------------------------------------------------------

echo "=== Step 1: Stop and remove Weather App containers ==="
docker rm -f weather-back weather-front 2>/dev/null || echo "No standalone containers found."

echo "=== Step 2: Stop Docker Compose stack (if running) ==="
if [ -f compose.yaml ] || [ -f docker-compose.yml ]; then
  if [ "$1" == "--all" ]; then
    docker compose down -v      # -v also deletes the database volume
  else
    docker compose down
  fi
else
  echo "No compose file found in this folder."
fi

if [ "$1" == "--all" ]; then
  echo "=== Step 3: Remove Weather App images ==="
  docker images --format '{{.Repository}}:{{.Tag}}' | grep -E '^(weather-back|weather-front)|/weather-(back|front):' | xargs -r docker rmi -f
fi

echo "=== Step 4: Remove unused Docker resources ==="
docker system prune -f

echo "=== Remaining containers and images ==="
docker ps -a
docker images

echo ""
echo "Cleanup completed."
echo "Reminder: also stop/delete AWS resources (ECS service, cluster, ECR images, EC2) after evaluation to avoid charges."