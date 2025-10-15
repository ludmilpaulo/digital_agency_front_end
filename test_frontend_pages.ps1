# Frontend Page Testing Script
# Tests all Next.js pages

$baseUrl = "http://localhost:3000"
$results = @()

function Test-Page {
    param(
        [string]$Path,
        [string]$Description
    )
    
    try {
        $url = "$baseUrl$Path"
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
        $status = "PASS"
        $statusCode = $response.StatusCode
        $contentLength = $response.Content.Length
        
        # Check for specific content indicators
        $hasContent = $contentLength -gt 1000
        $hasHtml = $response.Content -match "<html"
        
        if ($hasContent -and $hasHtml) {
            $message = "Page loaded successfully ($contentLength bytes)"
        } else {
            $message = "Page loaded but may have issues"
        }
    }
    catch {
        $status = "FAIL"
        $statusCode = $_.Exception.Response.StatusCode.value__
        $message = $_.Exception.Message
        $contentLength = 0
    }
    
    $result = [PSCustomObject]@{
        Status = $status
        StatusCode = $statusCode
        Path = $Path
        Description = $Description
        ContentLength = $contentLength
        Message = $message
    }
    
    Write-Host "[$status] [$statusCode] $Path - $Description ($contentLength bytes)"
    return $result
}

Write-Host "Starting Frontend Page Testing..."
Write-Host "=" * 80
Write-Host ""

Write-Host "Testing Main Pages..."
$results += Test-Page -Path "/" -Description "Homepage"
$results += Test-Page -Path "/about-us" -Description "About Us Page"
$results += Test-Page -Path "/services" -Description "Services Page"
$results += Test-Page -Path "/how-it-works" -Description "How It Works"
$results += Test-Page -Path "/contact" -Description "Contact Page"
$results += Test-Page -Path "/faq" -Description "FAQ Page"
$results += Test-Page -Path "/privacy" -Description "Privacy Policy"
$results += Test-Page -Path "/terms" -Description "Terms of Service"

Write-Host "`nTesting Content Pages..."
$results += Test-Page -Path "/blog" -Description "Blog List"
$results += Test-Page -Path "/projects" -Description "Projects List"
$results += Test-Page -Path "/testimonial" -Description "Testimonials"
$results += Test-Page -Path "/careers" -Description "Careers Page"
$results += Test-Page -Path "/solutions" -Description "Solutions Page"
$results += Test-Page -Path "/course" -Description "Courses Page"

Write-Host "`nTesting User Pages..."
$results += Test-Page -Path "/LoginScreenUser" -Description "User Login"
$results += Test-Page -Path "/SignupScreen" -Description "User Signup"
$results += Test-Page -Path "/appointment" -Description "Appointment Booking"
$results += Test-Page -Path "/have-a-project" -Description "Project Inquiry"

Write-Host "`nTesting Admin/Dev Pages..."
$results += Test-Page -Path "/admin" -Description "Admin Dashboard"
$results += Test-Page -Path "/devDashBoard" -Description "Developer Dashboard"

Write-Host "`n" + ("=" * 80)
Write-Host "Frontend Test Summary"
Write-Host "=" * 80

$totalTests = $results.Count
$passed = ($results | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($results | Where-Object { $_.Status -eq "FAIL" }).Count

Write-Host "`nTotal Pages Tested: $totalTests"
Write-Host "Passed: $passed"
Write-Host "Failed: $failed"

$successRate = [math]::Round(($passed / $totalTests) * 100, 2)
Write-Host "`nSuccess Rate: $successRate%"

# Show failed pages
if ($failed -gt 0) {
    Write-Host "`nFailed Pages:"
    $results | Where-Object { $_.Status -eq "FAIL" } | ForEach-Object {
        Write-Host "  - $($_.Path): $($_.Message)"
    }
}

# Export results
$results | ConvertTo-Json | Out-File "frontend_test_results.json"
Write-Host "`nResults exported to frontend_test_results.json"
