# SmartLearning Setup Script
Write-Host "🚀 Setting up SmartLearning Project..." -ForegroundColor Green

# Install root dependencies
Write-Host "`n📦 Installing root dependencies..." -ForegroundColor Cyan
npm install

# Setup Backend
Write-Host "`n🔧 Setting up Backend..." -ForegroundColor Cyan
Set-Location backend

if (Test-Path .env) {
    Write-Host "✅ Backend .env already exists" -ForegroundColor Yellow
} else {
    Write-Host "📝 Creating backend .env from example..." -ForegroundColor Yellow
    Copy-Item .env.example .env -ErrorAction SilentlyContinue
}

npm install
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green

# Setup Frontend
Write-Host "`n🎨 Setting up Frontend..." -ForegroundColor Cyan
Set-Location ../frontend

if (Test-Path .env.local) {
    Write-Host "✅ Frontend .env.local already exists" -ForegroundColor Yellow
} else {
    Write-Host "📝 Creating frontend .env.local..." -ForegroundColor Yellow
    "NEXT_PUBLIC_API_URL=http://localhost:5000" | Out-File -FilePath .env.local -Encoding UTF8
}

npm install
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green

Set-Location ..

Write-Host "`n✅ Setup Complete!" -ForegroundColor Green
Write-Host "`n📚 Next steps:" -ForegroundColor Cyan
Write-Host "1. Configure backend/.env with your database and email settings"
Write-Host "2. Run: cd backend && npm run prisma:migrate"
Write-Host "3. Run: npm run dev (from root to start both frontend and backend)"
Write-Host "`n🌐 Frontend: http://localhost:3000" -ForegroundColor Magenta
Write-Host "🔧 Backend:  http://localhost:5000" -ForegroundColor Magenta










