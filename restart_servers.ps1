# Restart Development Servers Script
# This script stops running servers and restarts both backend and frontend

Write-Host "🔄 Stopping existing servers..." -ForegroundColor Cyan

# Kill Node.js processes (Frontend)
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    $_.Path -like "*digital_agency_front_end*"
} | Stop-Process -Force
Write-Host "✅ Stopped frontend server" -ForegroundColor Green

# Kill Python processes (Backend)
Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*manage.py*runserver*"
} | Stop-Process -Force
Write-Host "✅ Stopped backend server" -ForegroundColor Green

Start-Sleep -Seconds 2

# Start Backend Server
Write-Host "`n🚀 Starting Django backend on port 8000..." -ForegroundColor Cyan
$backendPath = "H:\GitHub\digital_agency"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; python manage.py runserver 8000"

Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "🚀 Starting Next.js frontend on port 3000..." -ForegroundColor Cyan
$frontendPath = "H:\GitHub\digital_agency_front_end"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev"

Write-Host "`n✅ Both servers starting!" -ForegroundColor Green
Write-Host "   Backend:  http://localhost:8000" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "`n💡 Check the new terminal windows for server output" -ForegroundColor Cyan

