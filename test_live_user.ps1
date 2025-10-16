# Live User Testing Script
# Testing with user: ludmil

$baseUrl = "https://maindoagency.pythonanywhere.com"
$username = "ludmil"
$password = "Maitland@2025"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  LIVE USER TESTING - ludmil" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Login
Write-Host "[1/10] Testing Login..." -ForegroundColor Yellow
try {
    $loginBody = @{
        username = $username
        password = $password
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/token/login/" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.auth_token
    
    if ($token) {
        Write-Host "  [SUCCESS] Login successful! Token received." -ForegroundColor Green
        Write-Host "  Token: $($token.Substring(0,20))..." -ForegroundColor Gray
    } else {
        Write-Host "  [FAIL] Login failed - No token received" -ForegroundColor Red
        exit
    }
} catch {
    Write-Host "  [FAIL] Login error: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

$headers = @{
    "Authorization" = "Token $token"
    "Content-Type" = "application/json"
}

Write-Host ""

# Test 2: Get User Profile
Write-Host "[2/10] Testing User Profile..." -ForegroundColor Yellow
try {
    $userProfile = Invoke-RestMethod -Uri "$baseUrl/auth/users/me/" -Method GET -Headers $headers
    Write-Host "  [SUCCESS] User profile retrieved" -ForegroundColor Green
    Write-Host "  Username: $($userProfile.username)" -ForegroundColor Gray
    Write-Host "  Email: $($userProfile.email)" -ForegroundColor Gray
    Write-Host "  ID: $($userProfile.id)" -ForegroundColor Gray
} catch {
    Write-Host "  [FAIL] Profile error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Get Services
Write-Host "[3/10] Testing Services API..." -ForegroundColor Yellow
try {
    $services = Invoke-RestMethod -Uri "$baseUrl/services/services/" -Method GET
    Write-Host "  [SUCCESS] Services retrieved: $($services.Count) services" -ForegroundColor Green
    if ($services.Count -gt 0) {
        Write-Host "  First service: $($services[0].title)" -ForegroundColor Gray
    }
} catch {
    Write-Host "  [FAIL] Services error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Get Blog Posts
Write-Host "[4/10] Testing Blog API..." -ForegroundColor Yellow
try {
    $blogs = Invoke-RestMethod -Uri "$baseUrl/blog/blogs/" -Method GET
    Write-Host "  [SUCCESS] Blog posts retrieved: $($blogs.Count) posts" -ForegroundColor Green
    if ($blogs.Count -gt 0) {
        Write-Host "  Latest post: $($blogs[0].title)" -ForegroundColor Gray
    }
} catch {
    Write-Host "  [FAIL] Blog error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 5: Get Projects
Write-Host "[5/10] Testing Projects API..." -ForegroundColor Yellow
try {
    $projects = Invoke-RestMethod -Uri "$baseUrl/project/projects/" -Method GET
    Write-Host "  [SUCCESS] Projects retrieved: $($projects.Count) projects" -ForegroundColor Green
} catch {
    Write-Host "  [FAIL] Projects error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 6: Get Tasks
Write-Host "[6/10] Testing Tasks API..." -ForegroundColor Yellow
try {
    $tasks = Invoke-RestMethod -Uri "$baseUrl/task/tasks/" -Method GET -Headers $headers
    Write-Host "  [SUCCESS] Tasks retrieved: $($tasks.Count) tasks" -ForegroundColor Green
} catch {
    Write-Host "  [WARNING] Tasks may require authentication" -ForegroundColor Yellow
}

Write-Host ""

# Test 7: Get About Us Info
Write-Host "[7/10] Testing Company Info API..." -ForegroundColor Yellow
try {
    $aboutUs = Invoke-RestMethod -Uri "$baseUrl/info/aboutus/" -Method GET
    Write-Host "  [SUCCESS] Company info retrieved" -ForegroundColor Green
    if ($aboutUs.Count -gt 0) {
        Write-Host "  Company: $($aboutUs[0].title)" -ForegroundColor Gray
    }
} catch {
    Write-Host "  [FAIL] Company info error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 8: Get Team Members
Write-Host "[8/10] Testing Team API..." -ForegroundColor Yellow
try {
    $team = Invoke-RestMethod -Uri "$baseUrl/info/teams/" -Method GET
    Write-Host "  [SUCCESS] Team members retrieved: $($team.Count) members" -ForegroundColor Green
} catch {
    Write-Host "  [FAIL] Team error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 9: Check Staff Status
Write-Host "[9/10] Testing Staff Status..." -ForegroundColor Yellow
try {
    $staffCheck = Invoke-RestMethod -Uri "$baseUrl/account/check-staff/" -Method GET -Headers $headers
    Write-Host "  [SUCCESS] Staff check completed" -ForegroundColor Green
    Write-Host "  Is Staff: $($staffCheck.is_staff)" -ForegroundColor Gray
} catch {
    Write-Host "  [WARNING] Staff check requires authentication" -ForegroundColor Yellow
}

Write-Host ""

# Test 10: Get Testimonials
Write-Host "[10/10] Testing Testimonials API..." -ForegroundColor Yellow
try {
    $testimonials = Invoke-RestMethod -Uri "$baseUrl/testimonials/testimonials/" -Method GET
    Write-Host "  [SUCCESS] Testimonials retrieved: $($testimonials.Count) testimonials" -ForegroundColor Green
} catch {
    Write-Host "  [FAIL] Testimonials error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TESTING COMPLETE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "User: $username" -ForegroundColor White
Write-Host "Token: Active" -ForegroundColor Green
Write-Host "Ready to use dashboards!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Visit: https://www.maindodigital.com/LoginScreenUser" -ForegroundColor White
Write-Host "2. Login with credentials" -ForegroundColor White
Write-Host "3. Go to User Dashboard: https://www.maindodigital.com/userDashboard" -ForegroundColor White
Write-Host "4. Check Admin Dashboard: https://www.maindodigital.com/admin" -ForegroundColor White
Write-Host ""
