#!/bin/bash

# Drapt Prod Launcher

echo "[START] Booting up Drapt production environment..."

# Kill existing uvicorn processes (optional safety)
pkill -f "uvicorn" 2>/dev/null

# Pull latest git changes
echo "[INFO] Getting latest git changes"
if ! git pull origin main; then
  echo "[ERROR] Git pull failed"
  exit 1
fi

# Build frontend
echo "[INFO] Building frontend"
if ! (cd drapt-ui && pnpm vite build); then
  echo "[ERROR] Frontend build failed"
  exit 1
fi

# Start backend server
echo "[INFO] Starting FastAPI backend (uvicorn)..."
(cd drapt-api && source venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000) &

# Gracefully handle Ctrl+C
trap 'echo "[TERMINATED] Shutting down Drapt dev env..."; pkill -f "uvicorn"; exit' INT

echo "[SUCCESS] Drapt dev environment running. Press Ctrl+C to stop."
wait