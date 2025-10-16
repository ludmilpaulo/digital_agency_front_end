# Detailed Live API Testing
$apiBaseUrl = "https://maindoagency.pythonanywhere.com"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "DETAILED LIVE API TESTING" -ForegroundColor Cyan
Write-Host "Backend: $apiBaseUrl" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test different possible paths
$endpoints = @(
    "/information/services/",
    "/api/services/",
    "/services/",
    "/posts/blogs/",
    "/api/blogs/",
    "/blogs/",
    "/projects/",
    "/api/projects/",
    "/careers/careers/",
    "/api/careers/",
    "/appointments/",
    "/api/appointments/",
    "/api/",
    "/admin/",
    ""
)

foreach ($endpoint in $endpoints) {
    $url = "$apiBaseUrl$endpoint"
    Write-Host "Testing: $url" -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri $url -Method Get -TimeoutSec 5 -UseBasicParsing
        Write-Host "   SUCCESS - Status: $($response.StatusCode)" -ForegroundColor Green
        
        # Try to parse as JSON
        try {
            $json = $response.Content | ConvertFrom-Json
            $count = if ($json -is [array]) { $json.Count } else { "Object" }
            Write-Host "   Data: $count items/object" -ForegroundColor Cyan
        } catch {
            $length = $response.Content.Length
            Write-Host "   Content length: $length bytes (HTML/Other)" -ForegroundColor Cyan
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode) {
            Write-Host "   FAILED - Status: $statusCode" -ForegroundColor Red
        } else {
            Write-Host "   FAILED - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    Start-Sleep -Milliseconds 500
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Testing the frontend to check API calls" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check frontend pages
$frontendUrl = "https://www.maindodigital.com"
$pages = @("/", "/services", "/blog", "/projects", "/about-us", "/contact")

foreach ($page in $pages) {
    $url = "$frontendUrl$page"
    Write-Host "Testing: $url" -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri $url -Method Get -TimeoutSec 10 -UseBasicParsing
        Write-Host "   SUCCESS - Status: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "   FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
    Start-Sleep -Milliseconds 500
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TESTING COMPLETE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

