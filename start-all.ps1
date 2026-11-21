# CICADA Sentinel - Startup Script for Windows PowerShell
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  CICADA Sentinel 2026 - Zero-Trust AIOps Observability Platform" -ForegroundColor Cyan
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Starting SaaS Cloud Backend (Node.js on port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd saas-backend; npm start"

Start-Sleep -Seconds 2

Write-Host "[2/3] Starting Local Edge Collector (Python on port 8001)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd local-collector; python server.py"

Start-Sleep -Seconds 2

Write-Host "[3/3] Starting NOC/SOC Admin Dashboard (Vite on port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd saas-frontend; npm run dev"

Write-Host ""
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  All services launched in separate windows!" -ForegroundColor Cyan
Write-Host "  - SaaS Dashboard:     http://localhost:5173" -ForegroundColor Yellow
Write-Host "  - Central Cloud API:  http://localhost:5000/healthz" -ForegroundColor Yellow
Write-Host "  - Local Edge Agent:   http://localhost:8001/status" -ForegroundColor Yellow
Write-Host "===================================================================" -ForegroundColor Cyan
