#!/usr/bin/env bash
#
# Build the Python metrics image so that all dependencies (pika, redis)
# are baked in at build time. The metrics container therefore needs no
# internet access at runtime and can stay in the backend network only.
#
# Usage:
#   ./build-metrics.sh            # builds as "networking-metrics:latest"
#   ./build-metrics.sh mytag      # builds as "networking-metrics:mytag"
#
set -euo pipefail

IMAGE_NAME="networking-metrics"
TAG="${1:-latest}"
CONTEXT_DIR="$(dirname "$0")/metrics"

echo "Building ${IMAGE_NAME}:${TAG} from ${CONTEXT_DIR} ..."
docker build -t "${IMAGE_NAME}:${TAG}" "${CONTEXT_DIR}"

echo
echo "Done. Run it with:"
echo "  docker compose up -d --build"
