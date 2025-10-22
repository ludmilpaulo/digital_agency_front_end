# Production Testing Script for Maindo Digital Agency
# Tests critical endpoints and features

$baseURL = "https://www.maindodigital.com"
$apiURL = "https://maindoagency.pythonanywhere.com"

Write-Host "🧪 Starting Production Tests..." -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$testsPassed = 0
$testsFailed = 0
$totalTests = 0

function Test-Endpoint {
    param(
        [string]$url,
        [string]$name,
        [int]$expectedStatus = 200
    )
    
    $totalTests++
    Write-Host "Testing: $name" -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
        
        if ($response.StatusCode -eq $expectedStatus) {
            Write-Host " ✅ PASS" -ForegroundColor Green
            Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Gray
            $script:testsPassed++
            return $true
        } else {
            Write-Host " ❌ FAIL" -ForegroundColor Red
            Write-Host "  Expected: $expectedStatus, Got: $($response.StatusCode)" -ForegroundColor Red
            $script:testsFailed++
            return $false
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
        [string]$endpoint,
        [string]$name
    )
    
    $url = "$apiURL$endpoint"
    Test-Endpoint -url $url -name $name
}

function Test-ContentContains {
    param(
        [string]$url,
        [string]$name,
        [string]$expectedContent
    )
    
    $totalTests++
    Write-Host "Testing: $name" -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10 -ErrorAction Stop
        $content = $response.Content
        
        if ($content -like "*$expectedContent*") {
            Write-Host " ✅ PASS" -ForegroundColor Green
            Write-Host "  Found: '$expectedContent'" -ForegroundColor Gray
            $script:testsPassed++
            return $true
        } else {
            Write-Host " ❌ FAIL" -ForegroundColor Red
            Write-Host "  Content not found: '$expectedContent'" -ForegroundColor Red
            $script:testsFailed++
            return $false
        }
    }
    catch {
        Write-Host " ❌ FAIL" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        $script:testsFailed++
        return $false
    }
}

# ===========================
# FRONTEND TESTS
# ===========================

Write-Host "`n📱 FRONTEND TESTS" -ForegroundColor Yellow
Write-Host "================================`n" -ForegroundColor Yellow

# Homepage
Test-Endpoint -url "$baseURL/" -name "Homepage"
Test-ContentContains -url "$baseURL/" -name "Homepage Contact Info" -expectedContent "+27 65 903 1894"
Test-ContentContains -url "$baseURL/" -name "Homepage Email" -expectedContent "support@maindodigital.com"

# Services
Test-Endpoint -url "$baseURL/services" -name "Services Page"

# About Us
Test-Endpoint -url "$baseURL/about-us" -name "About Us Page"

# Contact
Test-Endpoint -url "$baseURL/contact" -name "Contact Page"

# Appointment
Test-Endpoint -url "$baseURL/appointment" -name "Appointment Page"

# Careers
Test-Endpoint -url "$baseURL/careers" -name "Careers Page"

# Blog
Test-Endpoint -url "$baseURL/blog" -name "Blog Page"

# Projects
Test-Endpoint -url "$baseURL/projects" -name "Projects Page"

# Auth Pages
Test-Endpoint -url "$baseURL/LoginScreenUser" -name "Login Page"
Test-Endpoint -url "$baseURL/SignupScreen" -name "Signup Page"

# SEO Files
Test-Endpoint -url "$baseURL/robots.txt" -name "Robots.txt"
Test-Endpoint -url "$baseURL/sitemap.xml" -name "Sitemap.xml"
Test-Endpoint -url "$baseURL/manifest.webmanifest" -name "PWA Manifest"

# ===========================
# BACKEND API TESTS
# ===========================

Write-Host "`n🔌 BACKEND API TESTS" -ForegroundColor Yellow
Write-Host "================================`n" -ForegroundColor Yellow

# Info Endpoints
Test-APIEndpoint -endpoint "/info/aboutus/" -name "About Us API"
Test-APIEndpoint -endpoint "/info/carousels/" -name "Carousels API"

# Services
Test-APIEndpoint -endpoint "/services/services/" -name "Services API"

# Testimonials
Test-APIEndpoint -endpoint "/testimonials/testimonials/" -name "Testimonials API"

# Projects
Test-APIEndpoint -endpoint "/projects/" -name "Projects API"

# Careers
Test-APIEndpoint -endpoint "/careers/careers/" -name "Careers API"

# Tasks (requires auth - expect 403 or 401)
Write-Host "Testing: Tasks API (Auth Required)" -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$apiURL/task/tasks/" -Method GET -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host " ✅ PASS" -ForegroundColor Green
        $testsPassed++
    }
}
catch {
    if ($_.Exception.Response.StatusCode -eq 401 -or $_.Exception.Response.StatusCode -eq 403) {
        Write-Host " ✅ PASS (Auth Required)" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host " ❌ FAIL" -ForegroundColor Red
        $testsFailed++
    }
}
$totalTests++

# ===========================
# SEO & META TESTS
# ===========================

Write-Host "`nSEO AND META TESTS" -ForegroundColor Yellow
Write-Host "================================`n" -ForegroundColor Yellow

# Check for SEO elements
Test-ContentContains -url "$baseURL/" -name "SEO: Title Tag" -expectedContent "<title>"
Test-ContentContains -url "$baseURL/" -name "SEO: Meta Description" -expectedContent 'meta name="description"'
Test-ContentContains -url "$baseURL/" -name "SEO: Open Graph" -expectedContent 'property="og:title"'
Test-ContentContains -url "$baseURL/" -name "SEO: Twitter Card" -expectedContent 'name="twitter:card"'
Test-ContentContains -url "$baseURL/" -name "SEO: Canonical URL" -expectedContent 'rel="canonical"'
Test-ContentContains -url "$baseURL/" -name "SEO: Structured Data" -expectedContent 'application/ld+json'

# ===========================
# PERFORMANCE TESTS
# ===========================

Write-Host "`n⚡ PERFORMANCE TESTS" -ForegroundColor Yellow
Write-Host "================================`n" -ForegroundColor Yellow

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
try {
    $response = Invoke-WebRequest -Uri "$baseURL/" -Method GET -ErrorAction Stop
    $stopwatch.Stop()
    $loadTime = $stopwatch.ElapsedMilliseconds
    
    Write-Host "Testing: Homepage Load Time" -NoNewline
    if ($loadTime -lt 3000) {
        Write-Host " ✅ PASS" -ForegroundColor Green
        Write-Host "  Load Time: $loadTime ms (Target: less than 3000ms)" -ForegroundColor Gray
        $testsPassed++
    } else {
        Write-Host " ❌ FAIL" -ForegroundColor Red
        Write-Host "  Load Time: $loadTime ms (Target: less than 3000ms)" -ForegroundColor Red
        $testsFailed++
    }
    $totalTests++
}
catch {
    Write-Host " ❌ FAIL" -ForegroundColor Red
    $testsFailed++
    $totalTests++
}

# ===========================
# CONTACT INFO VERIFICATION
# ===========================

Write-Host "`n📞 CONTACT INFO VERIFICATION" -ForegroundColor Yellow
Write-Host "================================`n" -ForegroundColor Yellow

$phone = "+27 65 903 1894"
$email = "support@maindodigital.com"

Test-ContentContains -url "$baseURL/" -name "Phone Number Present" -expectedContent $phone
Test-ContentContains -url "$baseURL/" -name "Support Email Present" -expectedContent $email
Test-ContentContains -url "$baseURL/about-us" -name "Contact in About-Us" -expectedContent $email

# ===========================
# MOBILE RESPONSIVENESS
# ===========================

Write-Host "`n📱 MOBILE RESPONSIVENESS" -ForegroundColor Yellow
Write-Host "================================`n" -ForegroundColor Yellow

$headers = @{
    'User-Agent' = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
}

Write-Host "Testing: Mobile Homepage" -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$baseURL/" -Headers $headers -Method GET -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host " ✅ PASS" -ForegroundColor Green
        Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Gray
        $testsPassed++
    }
}
catch {
    Write-Host " ❌ FAIL" -ForegroundColor Red
    $testsFailed++
}
$totalTests++

# ===========================
# SECURITY HEADERS
# ===========================

Write-Host "`n🔐 SECURITY HEADERS" -ForegroundColor Yellow
Write-Host "================================`n" -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "$baseURL/" -Method GET -ErrorAction Stop
    
    $securityHeaders = @(
        'Strict-Transport-Security',
        'X-Content-Type-Options',
        'X-Frame-Options',
        'X-XSS-Protection'
    )
    
    foreach ($header in $securityHeaders) {
        Write-Host "Testing: Security Header - $header" -NoNewline
        if ($response.Headers[$header]) {
            Write-Host " ✅ PASS" -ForegroundColor Green
            Write-Host "  Value: $($response.Headers[$header])" -ForegroundColor Gray
            $testsPassed++
        } else {
            Write-Host " ⚠️ WARNING (Not Found)" -ForegroundColor Yellow
            $testsFailed++
        }
        $totalTests++
    }
}
catch {
    Write-Host "Error checking security headers: $($_.Exception.Message)" -ForegroundColor Red
}

# ===========================
# FINAL RESULTS
# ===========================

Write-Host "`n" -NoNewline
Write-Host "================================" -ForegroundColor Cyan
Write-Host "📊 TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

Write-Host "`nTotal Tests: $totalTests" -ForegroundColor White
Write-Host "Passed: " -NoNewline -ForegroundColor White
Write-Host "$testsPassed" -ForegroundColor Green
Write-Host "Failed: " -NoNewline -ForegroundColor White
Write-Host "$testsFailed" -ForegroundColor Red

$passRate = [math]::Round(($testsPassed / $totalTests) * 100, 2)
Write-Host "`nPass Rate: " -NoNewline -ForegroundColor White

if ($passRate -ge 90) {
    Write-Host "$passRate%" -ForegroundColor Green
    Write-Host "✅ EXCELLENT!" -ForegroundColor Green
} elseif ($passRate -ge 75) {
    Write-Host "$passRate%" -ForegroundColor Yellow
    Write-Host "⚠️ GOOD - Some issues need attention" -ForegroundColor Yellow
} else {
    Write-Host "$passRate%" -ForegroundColor Red
    Write-Host "❌ NEEDS ATTENTION - Critical issues found" -ForegroundColor Red
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "Testing completed at: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host "================================`n" -ForegroundColor Cyan

# Save results to file
$reportPath = "production-test-results.txt"
$report = "PRODUCTION TEST RESULTS`n"
$report += "========================`n"
$report += "Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n"
$report += "Base URL: $baseURL`n"
$report += "API URL: $apiURL`n`n"
$report += "SUMMARY:`n"
$report += "Total Tests: $totalTests`n"
$report += "Passed: $testsPassed`n"
$report += "Failed: $testsFailed`n"
$report += "Pass Rate: $passRate%`n`n"
$report += "STATUS: $(if ($passRate -ge 90) { 'EXCELLENT' } elseif ($passRate -ge 75) { 'GOOD' } else { 'NEEDS ATTENTION' })`n"

$report | Out-File -FilePath $reportPath -Encoding UTF8
Write-Host "Full report saved to: $reportPath`n" -ForegroundColor Cyan

# Exit with appropriate code
if ($testsFailed -eq 0) {
    exit 0
} else {
    exit 1
}

