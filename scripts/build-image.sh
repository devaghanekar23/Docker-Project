#!/bin/bash
# ------------------------------------------------------------
# build-image.sh
# Builds Docker images for the Weather App (backend + frontend)
# Usage   : ./build-image.sh [tag]
# Example : ./build-image.sh v1      (default tag is v1)
# Run this script from the project root folder
# ------------------------------------------------------------

set -e   # stop the script if any command fails

TAG="${1:-v1}"
BACKEND_IMAGE="weather-back"
FRONTEND_IMAGE="weather-front"

# Check that Docker is available
if ! command -v docker >/dev/null 2>&1; then
  echo "Error: Docker is not installed. Run install-docker.sh first."
  exit 1
fi

# Check that Dockerfiles exist
for dir in backend frontend; do
  if [ ! -f "./$dir/Dockerfile" ]; then
    echo "Error: ./$dir/Dockerfile not found. Run this script from the project root."
    exit 1
  fi
done

echo "=== Building backend image: ${BACKEND_IMAGE}:${TAG} ==="
docker build -t "${BACKEND_IMAGE}:${TAG}" ./backend

echo "=== Building frontend image: ${FRONTEND_IMAGE}:${TAG} ==="
docker build -t "${FRONTEND_IMAGE}:${TAG}" ./frontend

echo "=== Verifying images ==="
docker images | grep -E "${BACKEND_IMAGE}|${FRONTEND_IMAGE}"

echo ""
echo "Build completed successfully. Images tagged as: ${TAG}"