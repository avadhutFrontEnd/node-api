# PowerShell Script for Windows
# Usage: .\create-api-project.ps1

# Prompt user for project name
$projectName = Read-Host "Enter project name (e.g., Day-1-E-Commerce-Product-Catalog)"

# Validate input
if ([string]::IsNullOrWhiteSpace($projectName)) {
    Write-Host "Error: Project name cannot be empty!" -ForegroundColor Red
    exit 1
}

# Create main project folder
Write-Host "Creating project structure for: $projectName" -ForegroundColor Cyan

if (Test-Path $projectName) {
    Write-Host "Warning: Folder '$projectName' already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to continue? (y/n)"
    if ($overwrite -ne 'y') {
        Write-Host "Operation cancelled." -ForegroundColor Red
        exit 0
    }
}

# Create main folder
New-Item -Path $projectName -ItemType Directory -Force | Out-Null

# Create three database-specific subfolders
$databases = @("MySQL", "PostgreSQL", "MongoDB")

foreach ($db in $databases) {
    $folderPath = Join-Path $projectName "$projectName-$db"
    New-Item -Path $folderPath -ItemType Directory -Force | Out-Null
    Write-Host "[OK] Created: $folderPath" -ForegroundColor Green
    
    # Create src folder inside each database folder
    $srcPath = Join-Path $folderPath "src"
    New-Item -Path $srcPath -ItemType Directory -Force | Out-Null
    Write-Host "  [OK] Created: $srcPath" -ForegroundColor Green
    
    # Create basic folder structure inside src
    $srcFolders = @("config", "controllers", "models", "routes", "middleware")
    foreach ($folder in $srcFolders) {
        $subFolderPath = Join-Path $srcPath $folder
        New-Item -Path $subFolderPath -ItemType Directory -Force | Out-Null
    }
    Write-Host "  [OK] Created src subfolders (config, controllers, models, routes, middleware)" -ForegroundColor Green
    
    # Create placeholder files
    $serverFile = Join-Path $folderPath "server.js"
    $envFile = Join-Path $folderPath ".env.example"
    $packageFile = Join-Path $folderPath "package.json"
    
    # Create .env.example
    $envContent = @"
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=$($projectName)_$($db)
JWT_SECRET=your_jwt_secret_key_here
"@
    $envContent | Out-File -FilePath $envFile -Encoding UTF8
    
    # Create basic server.js
    $serverContent = @"
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to $projectName - $db API' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port `+PORT);
});
"@
    $serverContent | Out-File -FilePath $serverFile -Encoding UTF8
    
    # Create basic package.json
    $packageContent = @"
{
  "name": "$($projectName.ToLower())-$($db.ToLower())",
  "version": "1.0.0",
  "description": "$projectName REST API with $db",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": ["express", "rest-api", "$($db.ToLower())"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
"@
    $packageContent | Out-File -FilePath $packageFile -Encoding UTF8
    
    Write-Host "  [OK] Created configuration files (server.js, .env.example, package.json)" -ForegroundColor Green
}

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "Project structure created successfully!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. cd $projectName\$projectName-MySQL" -ForegroundColor White
Write-Host "2. npm install" -ForegroundColor White
Write-Host "3. Copy .env.example to .env and configure" -ForegroundColor White
Write-Host "4. Start coding!" -ForegroundColor White
Write-Host "`nRepeat for PostgreSQL and MongoDB folders." -ForegroundColor Yellow