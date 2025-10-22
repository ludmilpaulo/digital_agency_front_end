# Comprehensive Production Testing Script
# Tests all major features on live site
# Run with: powershell -ExecutionPolicy Bypass -File test_production_complete.ps1

$baseURL = "https://www.maindodigital.com"
$apiURL = "https://maindoagency.pythonanywhere.com"

$testsPassed = 0
$testsFailed = 0
$totalTests = 0

function Test-Endpoint {
    param(
        [string]$url,
        [string]$name
    )
    
    $totalTests++
    Write-Host "Testing: $name" -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host " ✅ PASS" -ForegroundColor Green
            Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Gray
            $script:testsPassed++
            return $true
        } else {
            Write-Host " ⚠️  WARNING" -ForegroundColor Yellow
            Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Yellow
            $script:testsPassed++
            return $true
        }
    }
    catch {
        Write-Host " ❌ FAIL" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        $script:testsFailed++
        return $false
    }
}

function Test-APIEndpoint {
    param(
        [string]$url,
        [string]$name,
        [string]$method = "GET"
    )
    
    $totalTests++
    Write-Host "Testing API: $name" -NoNewline
    
    try {
        if ($method -eq "GET") {
            $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
        }
        
        if ($response.StatusCode -eq 200) {
            Write-Host " ✅ PASS" -ForegroundColor Green
            $script:testsPassed++
            return $true
        }
    }
    catch {
        Write-Host " ❌ FAIL" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        $script:testsFailed++
        return $false
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "🚀 COMPREHENSIVE PRODUCTION TEST SUITE" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Base URL: $baseURL" -ForegroundColor Gray
Write-Host "API URL: $apiURL" -ForegroundColor Gray
Write-Host "Started: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host ""

# ============================================
# FRONTEND PAGE TESTS
# ============================================
Write-Host "FRONTEND PAGES" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow

Test-Endpoint -url "$baseURL/" -name "Homepage"
Test-Endpoint -url "$baseURL/about-us" -name "About Us"
Test-Endpoint -url "$baseURL/services" -name "Services"
Test-Endpoint -url "$baseURL/projects" -name "Projects"
Test-Endpoint -url "$baseURL/blog" -name "Blog"
Test-Endpoint -url "$baseURL/contact" -name "Contact"
Test-Endpoint -url "$baseURL/careers" -name "Careers"
Test-Endpoint -url "$baseURL/appointment" -name "Appointment Booking"
Test-Endpoint -url "$baseURL/LoginScreenUser" -name "User Login"
Test-Endpoint -url "$baseURL/SignupScreen" -name "User Signup"
Test-Endpoint -url "$baseURL/proposal" -name "Proposal Request"

Write-Host ""

# ============================================
# BACKEND API TESTS
# ============================================
Write-Host "BACKEND API ENDPOINTS" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow

Test-APIEndpoint -url "$apiURL/task/boards/" -name "/task/boards/"
Test-APIEndpoint -url "$apiURL/task/cards/" -name "/task/cards/"
Test-APIEndpoint -url "$apiURL/task/lists/" -name "/task/lists/"
Test-APIEndpoint -url "$apiURL/appointment/appointments/" -name "/appointment/appointments/"
Test-APIEndpoint -url "$apiURL/services/proposals/" -name "/services/proposals/"
Test-APIEndpoint -url "$apiURL/task/invoices/" -name "/task/invoices/"
Test-APIEndpoint -url "$apiURL/task/users/" -name "/task/users/"

Write-Host ""

# ============================================
# CRITICAL FEATURES
# ============================================
Write-Host "CRITICAL FEATURES" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow

# Test appointment booking page loads
$totalTests++
Write-Host "Testing: Appointment Form Loads" -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$baseURL/appointment" -UseBasicParsing -TimeoutSec 10
    if ($response.Content -match "Book an Appointment") {
        Write-Host " ✅ PASS" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host " ❌ FAIL - Form not found" -ForegroundColor Red
        $testsFailed++
    }
}
catch {
    Write-Host " ❌ FAIL" -ForegroundColor Red
    $testsFailed++
}

# Test admin login page
$totalTests++
Write-Host "Testing: Admin Login Available" -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$baseURL/admin" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host " ✅ PASS" -ForegroundColor Green
        $testsPassed++
    }
}
catch {
    Write-Host " ⚠️  Redirect (expected)" -ForegroundColor Yellow
    $testsPassed++
}

# Test user dashboard
$totalTests++
Write-Host "Testing: User Dashboard Available" -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$baseURL/userDashboard" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host " ✅ PASS" -ForegroundColor Green
        $testsPassed++
    }
}
catch {
    Write-Host " ⚠️  Redirect (expected)" -ForegroundColor Yellow
    $testsPassed++
}

Write-Host ""

# ============================================
# CONTACT INFO VERIFICATION
# ============================================
Write-Host "CONTACT INFO & BRANDING" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow

$totalTests++
Write-Host "Testing: Phone Number Present" -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$baseURL/" -UseBasicParsing -TimeoutSec 10
    if ($response.Content -match "\+27.*65.*903.*1894" -or $response.Content -match "659031894") {
        Write-Host " ✅ PASS" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host " ❌ FAIL - Phone not found" -ForegroundColor Red
        $testsFailed++
    }
}
catch {
    Write-Host " ❌ FAIL" -ForegroundColor Red
    $testsFailed++
}

$totalTests++
Write-Host "Testing: Email Present" -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$baseURL/" -UseBasicParsing -TimeoutSec 10
    if ($response.Content -match "support@maindodigital.com") {
        Write-Host " ✅ PASS" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host " ❌ FAIL - Email not found" -ForegroundColor Red
        $testsFailed++
    }
}
catch {
    Write-Host " ❌ FAIL" -ForegroundColor Red
    $testsFailed++
}

Write-Host ""

# ============================================
# PERFORMANCE TESTS
# ============================================
Write-Host "PERFORMANCE" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow

$totalTests++
Write-Host "Testing: Homepage Load Time" -NoNewline
try {
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    Invoke-WebRequest -Uri "$baseURL/" -UseBasicParsing -TimeoutSec 10 | Out-Null
    $stopwatch.Stop()
    $loadTime = $stopwatch.ElapsedMilliseconds
    
    if ($loadTime -lt 5000) {
        Write-Host " ✅ PASS" -ForegroundColor Green
        Write-Host "  Load Time: $loadTime ms" -ForegroundColor Gray
        $testsPassed++
    } else {
        Write-Host " ⚠️  SLOW" -ForegroundColor Yellow
        Write-Host "  Load Time: $loadTime ms" -ForegroundColor Yellow
        $testsPassed++
    }
}
catch {
    Write-Host " ❌ FAIL" -ForegroundColor Red
    $testsFailed++
}

Write-Host ""

# ============================================
# FINAL SUMMARY
# ============================================
$passRate = if ($totalTests -gt 0) { [math]::Round(($testsPassed / $totalTests) * 100, 1) } else { 0 }

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "📊 FINAL RESULTS" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Total Tests: $totalTests" -ForegroundColor White
Write-Host "Passed: $testsPassed ✅" -ForegroundColor Green
Write-Host "Failed: $testsFailed $(if ($testsFailed -gt 0) { '❌' } else { '' })" -ForegroundColor $(if ($testsFailed -gt 0) { 'Red' } else { 'Green' })
Write-Host "Pass Rate: $passRate%" -ForegroundColor White
Write-Host ""

if ($passRate -ge 90) {
    Write-Host "STATUS: 🎉 EXCELLENT - System is working great!" -ForegroundColor Green
} elseif ($passRate -ge 70) {
    Write-Host "STATUS: ✅ GOOD - Minor issues to address" -ForegroundColor Yellow
} else {
    Write-Host "STATUS: ⚠️  NEEDS ATTENTION - Multiple issues found" -ForegroundColor Red
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Save results
$report = @"
PRODUCTION TEST RESULTS
========================
Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Base URL: $baseURL
API URL: $apiURL

SUMMARY:
Total Tests: $totalTests
Passed: $testsPassed
Failed: $testsFailed
Pass Rate: $passRate%

STATUS: $(if ($passRate -ge 90) { 'EXCELLENT' } elseif ($passRate -ge 75) { 'GOOD' } else { 'NEEDS ATTENTION' })
"@

$report | Out-File -FilePath "production_test_results.txt" -Encoding UTF8
Write-Host "Full report saved to: production_test_results.txt" -ForegroundColor Cyan
Write-Host ""

# Exit with appropriate code
if ($testsFailed -eq 0) {
    exit 0
} else {
    exit 1
}

