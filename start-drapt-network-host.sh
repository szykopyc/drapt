#!/bin/bash

# Drapt Dev Launcher

echo "[START] Booting up Drapt development environment..."

# Kill existing processes (optional safety)
pkill -f "uvicorn" 2>/dev/null
pkill -f "vite" 2>/dev/null

# Start backend
echo "[INFO] Starting FastAPI backend (uvicorn)..."
(cd drapt-api && source .venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload) &

# Start frontend
echo "[INFO] Starting Vite frontend..."
(cd drapt-ui && pnpm dev --host 0.0.0.0 --port 5173) &

# Wait for all background jobs
trap 'echo "[TERMINATED] Shutting down Drapt dev env..."; pkill -f "uvicorn"; pkill -f "vite"; exit' INT

echo "[SUCCESS] Drapt dev environment running. Press Ctrl+C to stop."
wait
