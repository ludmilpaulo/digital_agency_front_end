# Comprehensive Production Testing Script
# Tests: https://www.maindodigital.com and https://maindoagency.pythonanywhere.com

$frontendUrl = "https://www.maindodigital.com"
$backendUrl = "https://maindoagency.pythonanywhere.com"

Write-Host "`n" -NoNewline
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PRODUCTION TESTING - MAINDO DIGITAL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Frontend: $frontendUrl" -ForegroundColor White
Write-Host "Backend:  $backendUrl" -ForegroundColor White
Write-Host "Time:     $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Cyan

# Initialize counters
$passed = 0
$failed = 0
$results = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [string]$Body = $null
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    Write-Host "  URL: $Url" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            TimeoutSec = 10
            UseBasicParsing = $true
        }
        
        if ($Body) {
            $params.Body = $Body
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params
        $statusCode = $response.StatusCode
        
        if ($statusCode -eq 200 -or $statusCode -eq 201) {
            Write-Host "  SUCCESS - Status: $statusCode" -ForegroundColor Green
            $script:passed++
            $script:results += [PSCustomObject]@{
                Test = $Name
                Status = "PASS"
                Code = $statusCode
                URL = $Url
            }
            
            # Try to parse JSON and show count
            try {
                $json = $response.Content | ConvertFrom-Json
                if ($json -is [array]) {
                    Write-Host "  Data: $($json.Count) items" -ForegroundColor Cyan
                }
            } catch {}
            
            return $true
        } else {
            Write-Host "  WARNING - Status: $statusCode" -ForegroundColor Yellow
            $script:failed++
            $script:results += [PSCustomObject]@{
                Test = $Name
                Status = "WARN"
                Code = $statusCode
                URL = $Url
            }
            return $false
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode) {
            Write-Host "  FAILED - Status: $statusCode" -ForegroundColor Red
        } else {
            Write-Host "  FAILED - $($_.Exception.Message)" -ForegroundColor Red
        }
        $script:failed++
        $script:results += [PSCustomObject]@{
            Test = $Name
            Status = "FAIL"
            Code = $statusCode
            URL = $Url
        }
        return $false
    }
    Write-Host ""
}

Write-Host "FRONTEND PAGES TEST" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Magenta

Test-Endpoint "Homepage" "$frontendUrl/"
Test-Endpoint "Services Page" "$frontendUrl/services"
Test-Endpoint "Blog Page" "$frontendUrl/blog"
Test-Endpoint "Projects Page" "$frontendUrl/projects"
Test-Endpoint "About Us Page" "$frontendUrl/about-us"
Test-Endpoint "Contact Page" "$frontendUrl/contact"
Test-Endpoint "Careers Page" "$frontendUrl/careers"
Test-Endpoint "Login Page" "$frontendUrl/LoginScreenUser"
Test-Endpoint "Admin Dashboard" "$frontendUrl/admin"
Test-Endpoint "User Dashboard" "$frontendUrl/userDashboard"
Test-Endpoint "Dev Dashboard" "$frontendUrl/devDashBoard"

Write-Host "`nBACKEND API ENDPOINTS TEST" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Magenta

# Test working endpoints first
Test-Endpoint "Django Admin" "$backendUrl/admin/"
Test-Endpoint "Careers API" "$backendUrl/careers/careers/"
Test-Endpoint "Services API (root)" "$backendUrl/services/"

# Test expected endpoints
Test-Endpoint "Information Services" "$backendUrl/information/services/"
Test-Endpoint "Blog Posts" "$backendUrl/posts/blogs/"
Test-Endpoint "Projects" "$backendUrl/projects/"
Test-Endpoint "Solutions" "$backendUrl/solutions/"
Test-Endpoint "Testimonials" "$backendUrl/information/testimonials/"
Test-Endpoint "Team Members" "$backendUrl/information/team/"
Test-Endpoint "About Us" "$backendUrl/information/about-us/"
Test-Endpoint "Appointments" "$backendUrl/appointments/"

# Test new endpoints
Test-Endpoint "Auto Create User" "$backendUrl/accounts/auto-create-user/" "POST" '{"name":"Test","email":"test@test.com","service":"Test"}'
Test-Endpoint "Change Password" "$backendUrl/accounts/change-password/" "POST" '{"new_password":"Test1234","confirm_password":"Test1234"}'
Test-Endpoint "Create Board from Request" "$backendUrl/task/create-board-from-request/" "POST" '{"user_name":"Test","service":"Test"}'

# Test task endpoints
Test-Endpoint "Boards API" "$backendUrl/task/boards/"
Test-Endpoint "Lists API" "$backendUrl/task/lists/"
Test-Endpoint "Cards API" "$backendUrl/task/cards/"
Test-Endpoint "Tasks API" "$backendUrl/task/tasks/"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total Tests: $($passed + $failed)" -ForegroundColor White
Write-Host "Passed:      $passed" -ForegroundColor Green
Write-Host "Failed:      $failed" -ForegroundColor Red
Write-Host "Success Rate: $(if (($passed + $failed) -gt 0) { [math]::Round(($passed / ($passed + $failed)) * 100, 1) } else { 0 })%" -ForegroundColor $(if ($passed -gt $failed) { "Green" } else { "Red" })
Write-Host "========================================`n" -ForegroundColor Cyan

# Show detailed results
Write-Host "DETAILED RESULTS:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

$results | Format-Table -AutoSize

Write-Host "`nRECOMMENDATIONS:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow

if ($failed -gt 0) {
    Write-Host "`n1. Backend API Issues Detected:" -ForegroundColor Yellow
    Write-Host "   Most backend APIs returning 404" -ForegroundColor White
    Write-Host "   Action: Deploy latest backend code to PythonAnywhere" -ForegroundColor White
    
    Write-Host "`n2. Deployment Steps:" -ForegroundColor Yellow
    Write-Host "   a) Login to PythonAnywhere" -ForegroundColor White
    Write-Host "   b) cd ~/digital_agency" -ForegroundColor White
    Write-Host "   c) git pull origin main" -ForegroundColor White
    Write-Host "   d) source myenv/bin/activate" -ForegroundColor White
    Write-Host "   e) pip install -r requirements.txt" -ForegroundColor White
    Write-Host "   f) python manage.py migrate" -ForegroundColor White
    Write-Host "   g) python manage.py collectstatic --no-input" -ForegroundColor White
    Write-Host "   h) Reload web app in PythonAnywhere Web tab" -ForegroundColor White
    
    Write-Host "`n3. After Deployment:" -ForegroundColor Yellow
    Write-Host "   Run this script again to verify all endpoints work" -ForegroundColor White
} else {
    Write-Host "`nAll tests passed! Production is fully operational!" -ForegroundColor Green
}

Write-Host "`n========================================`n" -ForegroundColor Cyan

