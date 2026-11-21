@echo off
echo ===================================================================
echo   CICADA Sentinel 2026 - Zero-Trust AIOps Observability Platform
echo ===================================================================
echo.
echo [1/3] Starting SaaS Cloud Backend (Node.js on port 5000)...
start "CICADA SaaS Backend [Port 5000]" cmd /k "cd saas-backend && npm start"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Local Edge Collector (Python on port 8001)...
start "CICADA Edge Collector [Port 8001]" cmd /k "cd local-collector && python server.py"

timeout /t 2 /nobreak >nul

echo [3/3] Starting NOC/SOC Admin Dashboard (Vite on port 5173)...
start "CICADA Frontend Dashboard [Port 5173]" cmd /k "cd saas-frontend && npm run dev"

echo.
echo ===================================================================
echo   All 3 services successfully started!
echo   - SaaS Dashboard:     http://localhost:5173
echo   - Central Cloud API:  http://localhost:5000/healthz
echo   - Local Edge Agent:   http://localhost:8001/status
echo ===================================================================
