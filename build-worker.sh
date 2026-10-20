#!/usr/bin/env bash
#
# Build the Python worker image so that all dependencies (pika, redis)
# are baked in at build time. The worker container therefore needs no
# internet access at runtime and can stay in the backend network only.
#
# Usage:
#   ./build-worker.sh            # builds as "networking-worker:latest"
#   ./build-worker.sh mytag      # builds as "networking-worker:mytag"
#
set -euo pipefail

IMAGE_NAME="networking-worker"
TAG="${1:-latest}"
CONTEXT_DIR="$(dirname "$0")/worker"

echo "Building ${IMAGE_NAME}:${TAG} from ${CONTEXT_DIR} ..."
docker build -t "${IMAGE_NAME}:${TAG}" "${CONTEXT_DIR}"

echo
echo "Done. Run it with:"
echo "  docker compose up -d --build"
