# Vercel Backend + Database Deployment Script (PowerShell)
#
# USAGE:
#   .\deploy.ps1
#
# This script will:
# 1. Check if Vercel CLI is installed
# 2. Login to Vercel
# 3. Deploy backend
# 4. Prompt for database connection string
# 5. Add environment variable
# 6. Create database tables
# 7. Redeploy with database connected

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  Vercel Backend + Database Deployment" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Vercel CLI
Write-Host "📦 Step 1: Checking Vercel CLI..." -ForegroundColor Yellow
try {
  $null = Get-Command vercel -ErrorAction Stop
  Write-Host "✅ Vercel CLI installed" -ForegroundColor Green
} catch {
  Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
  npm install -g vercel
  Write-Host "✅ Vercel CLI installed" -ForegroundColor Green
}
Write-Host ""

# Step 2: Login
Write-Host "🔐 Step 2: Logging in to Vercel..." -ForegroundColor Yellow
vercel login
Write-Host "✅ Logged in" -ForegroundColor Green
Write-Host ""

# Step 3: Deploy backend
Write-Host "🚀 Step 3: Deploying backend..." -ForegroundColor Yellow
vercel --prod
Write-Host "✅ Backend deployed" -ForegroundColor Green
Write-Host ""

# Step 4: Database setup instructions
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  DATABASE SETUP REQUIRED" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Step 4: Create Database (One-time setup)" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to: https://vercel.com/new" -ForegroundColor White
Write-Host "2. Click 'Storage' → 'Add Database'" -ForegroundColor White
Write-Host "3. Choose 'Neon' or 'Vercel Postgres'" -ForegroundColor White
Write-Host "4. Click 'Create Database'" -ForegroundColor White
Write-Host "5. Copy the connection string" -ForegroundColor White
Write-Host ""
Write-Host "Connection string looks like:" -ForegroundColor Gray
Write-Host "postgres://user:password@host.neon.tech/dbname?sslmode=require" -ForegroundColor Gray
Write-Host ""

$connectionString = Read-Host "Paste your connection string"

# Step 5: Add environment variable
Write-Host ""
Write-Host "🔧 Step 5: Adding environment variable..." -ForegroundColor Yellow
vercel env add POSTGRES_URL production "$connectionString"
Write-Host "✅ Environment variable added" -ForegroundColor Green
Write-Host ""

# Step 6: Create database tables
Write-Host "📊 Step 6: Creating database tables..." -ForegroundColor Yellow

$initScript = @"
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "$connectionString",
});

async function createTables() {
  try {
    await pool.query(\`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INTEGER,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    \`);
    console.log("✅ Table 'users' created successfully!");
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    await pool.end();
    process.exit(1);
  }
}

createTables();
"@

Set-Content -Path "temp-init-db.js" -Value $initScript
node temp-init-db.js
Remove-Item "temp-init-db.js" -Force
Write-Host "✅ Database tables created" -ForegroundColor Green
Write-Host ""

# Step 7: Redeploy
Write-Host "🔄 Step 7: Redeploying with database connection..." -ForegroundColor Yellow
vercel --prod
Write-Host "✅ Redeployed" -ForegroundColor Green
Write-Host ""

# Done
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Your API is live at:" -ForegroundColor Yellow
Write-Host "https://YOUR-PROJECT.vercel.app/api/users" -ForegroundColor White
Write-Host ""

Write-Host "Test commands:" -ForegroundColor Yellow
Write-Host "  Invoke-WebRequest https://YOUR-PROJECT.vercel.app/api/users" -ForegroundColor Gray
Write-Host "  Invoke-WebRequest https://YOUR-PROJECT.vercel.app/api/users -Method POST -ContentType 'application/json' -Body '{`"name`":`"John`",`"age`":30}'" -ForegroundColor Gray
Write-Host ""
