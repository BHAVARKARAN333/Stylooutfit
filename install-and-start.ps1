# StyloOutfit Backend Setup and Start Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " StyloOutfit Backend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to server directory
Set-Location -Path "server"

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    & npm install
    Write-Host ""
} else {
    Write-Host "Dependencies already installed." -ForegroundColor Green
    Write-Host ""
}

Write-Host "Starting backend server..." -ForegroundColor Green
Write-Host "Server will run on http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start the server
& npm start
