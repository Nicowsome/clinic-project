# Setup environment files for clinic-management-app

# Function to create directory if it doesn't exist
function Ensure-DirectoryExists($path) {
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
    }
}

# Create backend .env.development
$backendDevPath = "clinic-api\.env.development"
if (-not (Test-Path $backendDevPath)) {
    @"
# Development Environment
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/clinic-management

# JWT - This is a development secret. For production, use a secure secret in .env.production
JWT_SECRET=dev_`$([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString())
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# Security
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200

# Logging
LOG_LEVEL=debug
"@ | Out-File -FilePath $backendDevPath -Encoding utf8
    Write-Host "Created $backendDevPath" -ForegroundColor Green
} else {
    Write-Host "$backendDevPath already exists, skipping..." -ForegroundColor Yellow
}

# Create frontend .env
$frontendEnvPath = "clinic-web\.env"
if (-not (Test-Path $frontendEnvPath)) {
    @"
# Frontend Development Environment
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENV=development
"@ | Out-File -FilePath $frontendEnvPath -Encoding utf8
    Write-Host "Created $frontendEnvPath" -ForegroundColor Green
} else {
    Write-Host "$frontendEnvPath already exists, skipping..." -ForegroundColor Yellow
}

# Create frontend .env.production
$frontendProdPath = "clinic-web\.env.production"
if (-not (Test-Path $frontendProdPath)) {
    @"
# Frontend Production Environment
VITE_API_BASE_URL=https://your-api-url.vercel.app/api
VITE_ENV=production
"@ | Out-File -FilePath $frontendProdPath -Encoding utf8
    Write-Host "Created $frontendProdPath" -ForegroundColor Green
} else {
    Write-Host "$frontendProdPath already exists, skipping..." -ForegroundColor Yellow
}

# Create backend .env.production if it doesn't exist
$backendProdPath = "clinic-api\.env.production"
if (-not (Test-Path $backendProdPath)) {
    @"
# Production Environment - UPDATE THESE VALUES
NODE_ENV=production
PORT=3000

# Database - Replace with your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/clinic-management?retryWrites=true&w=majority

# JWT - Generate a secure JWT secret for production
$jwtSecret = "`$([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString())"
JWT_EXPIRES_IN=1d
JWT_COOKIE_EXPIRES_IN=1

# Security - Update with your production frontend URL
CORS_ORIGIN=https://your-clinic-app.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=50

# Logging
LOG_LEVEL=warn
"@ | Out-File -FilePath $backendProdPath -Encoding utf8
    Write-Host "Created $backendProdPath" -ForegroundColor Green
} else {
    Write-Host "$backendProdPath already exists, updating with secure defaults..." -ForegroundColor Yellow
    
    # Read existing content
    $content = Get-Content $backendProdPath -Raw
    
    # Ensure JWT_SECRET is set with a secure value if it's using the default
    if ($content -match "JWT_SECRET=dev_`$\{[^}]+\}") {
        $newSecret = [System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()
        $content = $content -replace "JWT_SECRET=dev_`$\{[^}]+\}", "JWT_SECRET=dev_$newSecret"
    }
    
    # Ensure production settings are appropriate
    $content = $content -replace "NODE_ENV=development", "NODE_ENV=production"
    $content = $content -replace "LOG_LEVEL=debug", "LOG_LEVEL=warn"
    $content = $content -replace "RATE_LIMIT_MAX=200", "RATE_LIMIT_MAX=50"
    
    # Save the updated content
    $content | Out-File -FilePath $backendProdPath -Encoding utf8 -Force
}

Write-Host "`nEnvironment setup complete!" -ForegroundColor Green
Write-Host "Please update the production environment files with your actual production values before deploying." -ForegroundColor Yellow
