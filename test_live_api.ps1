# Test Live Production API
# Base URL: https://www.maindodigital.com

$baseUrl = "https://www.maindodigital.com"
$apiBaseUrl = "https://maindoagency.pythonanywhere.com"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TESTING LIVE PRODUCTION API" -ForegroundColor Cyan
Write-Host "Frontend: $baseUrl" -ForegroundColor Cyan
Write-Host "Backend: $apiBaseUrl" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: Services API
Write-Host "1. Testing Services API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$apiBaseUrl/information/services/" -Method Get -TimeoutSec 10
    $count = ($response | Measure-Object).Count
    Write-Host "   SUCCESS - Services found: $count" -ForegroundColor Green
} catch {
    Write-Host "   FAILED - Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Blog Posts API
Write-Host "`n2. Testing Blog Posts API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$apiBaseUrl/posts/blogs/" -Method Get -TimeoutSec 10
    $count = ($response | Measure-Object).Count
    Write-Host "   SUCCESS - Blog posts found: $count" -ForegroundColor Green
} catch {
    Write-Host "   FAILED - Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Projects API
Write-Host "`n3. Testing Projects API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$apiBaseUrl/projects/" -Method Get -TimeoutSec 10
    $count = ($response | Measure-Object).Count
    Write-Host "   SUCCESS - Projects found: $count" -ForegroundColor Green
} catch {
    Write-Host "   FAILED - Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Solutions API
Write-Host "`n4. Testing Solutions API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$apiBaseUrl/solutions/" -Method Get -TimeoutSec 10
    $count = ($response | Measure-Object).Count
    Write-Host "   SUCCESS - Solutions found: $count" -ForegroundColor Green
} catch {
    Write-Host "   FAILED - Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Testimonials API
Write-Host "`n5. Testing Testimonials API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$apiBaseUrl/information/testimonials/" -Method Get -TimeoutSec 10
    $count = ($response | Measure-Object).Count
    Write-Host "   SUCCESS - Testimonials found: $count" -ForegroundColor Green
} catch {
    Write-Host "   FAILED - Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Team API
Write-Host "`n6. Testing Team API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$apiBaseUrl/information/team/" -Method Get -TimeoutSec 10
    $count = ($response | Measure-Object).Count
    Write-Host "   SUCCESS - Team members found: $count" -ForegroundColor Green
} catch {
    Write-Host "   FAILED - Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Careers API
Write-Host "`n7. Testing Careers API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$apiBaseUrl/careers/careers/" -Method Get -TimeoutSec 10
    $count = ($response | Measure-Object).Count
    Write-Host "   SUCCESS - Career postings found: $count" -ForegroundColor Green
} catch {
    Write-Host "   FAILED - Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 8: Appointments API
Write-Host "`n8. Testing Appointments API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$apiBaseUrl/appointments/" -Method Get -TimeoutSec 10
    $count = ($response | Measure-Object).Count
    Write-Host "   SUCCESS - Appointments found: $count" -ForegroundColor Green
} catch {
    Write-Host "   FAILED - Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 9: About Us API
Write-Host "`n9. Testing About Us API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$apiBaseUrl/information/about-us/" -Method Get -TimeoutSec 10
    Write-Host "   SUCCESS - About Us data retrieved" -ForegroundColor Green
} catch {
    Write-Host "   FAILED - Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 10: Auto Create User Endpoint
Write-Host "`n10. Testing Auto Create User Endpoint..." -ForegroundColor Yellow
try {
    $testData = @{
        name = "Test User"
        email = "test_api_$(Get-Random)@example.com"
        phone = "+27 84 1234567"
        company = "Test Company"
        service = "Website Development"
        message = "Testing API endpoint"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$apiBaseUrl/accounts/auto-create-user/" -Method Post -Body $testData -ContentType "application/json" -TimeoutSec 10
    if ($response.success) {
        Write-Host "   SUCCESS - User auto-creation working!" -ForegroundColor Green
        Write-Host "   Username: $($response.username)" -ForegroundColor Cyan
        Write-Host "   Email sent: $($response.email_sent)" -ForegroundColor Cyan
    } else {
        Write-Host "   PARTIAL - Response received but success=$($response.success)" -ForegroundColor Yellow
    }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 404) {
        Write-Host "   FAILED - Endpoint not found (404) - May need backend deployment" -ForegroundColor Red
    } else {
        Write-Host "   FAILED - Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nCore APIs tested against production backend." -ForegroundColor White
Write-Host "Check results above for any failures.`n" -ForegroundColor White
Write-Host "If auto-create-user fails with 404, the new endpoint" -ForegroundColor Yellow
Write-Host "needs to be deployed to production (PythonAnywhere).`n" -ForegroundColor Yellow

