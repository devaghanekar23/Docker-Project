#!/bin/bash
# ------------------------------------------------------------
# run-container.sh
# Runs the Weather App containers (backend + frontend)
# Usage   : ./run-container.sh [tag]
# Example : ./run-container.sh v1      (default tag is v1)
# Note    : Run build-image.sh first to create the images
# ------------------------------------------------------------

set -e   # stop the script if any command fails

TAG="${1:-v1}"
BACKEND_IMAGE="weather-back"
FRONTEND_IMAGE="weather-front"
BACKEND_PORT=5000    # change if your backend uses another port
FRONTEND_PORT=80     # host port for the frontend

# Check that Docker is available
if ! command -v docker >/dev/null 2>&1; then
  echo "Error: Docker is not installed. Run install-docker.sh first."
  exit 1
fi

# Check that images exist
for img in "${BACKEND_IMAGE}:${TAG}" "${FRONTEND_IMAGE}:${TAG}"; do
  if ! docker image inspect "$img" >/dev/null 2>&1; then
    echo "Error: image $img not found. Run ./build-image.sh $TAG first."
    exit 1
  fi
done

# Remove old containers with the same name (if any)
docker rm -f weather-back weather-front >/dev/null 2>&1 || true

echo "=== Starting backend container ==="
docker run -d --name weather-back -p ${BACKEND_PORT}:5000 "${BACKEND_IMAGE}:${TAG}"

echo "=== Starting frontend container ==="
docker run -d --name weather-front -p ${FRONTEND_PORT}:80 "${FRONTEND_IMAGE}:${TAG}"

echo "=== Running containers ==="
docker ps --filter "name=weather-"

echo ""
echo "Containers started successfully."
echo "Open in browser: http://<EC2-PUBLIC-IP>:${FRONTEND_PORT}"
echo "View logs      : docker logs weather-back"