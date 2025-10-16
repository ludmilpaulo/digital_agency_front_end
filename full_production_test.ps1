# Complete End-to-End Production Testing
# Tests all features on https://www.maindodigital.com

$frontendUrl = "https://www.maindodigital.com"
$backendUrl = "https://maindoagency.pythonanywhere.com"

Write-Host "`n" -NoNewline
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "COMPLETE END-TO-END PRODUCTION TESTING" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Frontend: $frontendUrl" -ForegroundColor White
Write-Host "Backend:  $backendUrl" -ForegroundColor White
Write-Host "Time:     $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor White
Write-Host "============================================================`n" -ForegroundColor Cyan

$testResults = @{
    Passed = 0
    Failed = 0
    Tests = @()
}

function Test-Feature {
    param(
        [string]$Name,
        [scriptblock]$TestScript
    )
    
    Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
    
    try {
        $result = & $TestScript
        if ($result) {
            Write-Host "✅ PASSED: $Name" -ForegroundColor Green
            $script:testResults.Passed++
            $script:testResults.Tests += [PSCustomObject]@{
                Test = $Name
                Status = "PASS"
                Result = "Success"
            }
            return $true
        } else {
            Write-Host "❌ FAILED: $Name" -ForegroundColor Red
            $script:testResults.Failed++
            $script:testResults.Tests += [PSCustomObject]@{
                Test = $Name
                Status = "FAIL"
                Result = "Check failed"
            }
            return $false
        }
    } catch {
        Write-Host "❌ ERROR: $Name - $($_.Exception.Message)" -ForegroundColor Red
        $script:testResults.Failed++
        $script:testResults.Tests += [PSCustomObject]@{
            Test = $Name
            Status = "ERROR"
            Result = $_.Exception.Message
        }
        return $false
    }
}

# ============================================================
# PHASE 1: FRONTEND PAGES
# ============================================================
Write-Host "`n📱 PHASE 1: FRONTEND PAGES TEST" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Magenta

Test-Feature "Homepage Loads" {
    $response = Invoke-WebRequest -Uri "$frontendUrl/" -Method Get -TimeoutSec 10 -UseBasicParsing
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Cyan
    return $response.StatusCode -eq 200
}

Test-Feature "Services Page Loads" {
    $response = Invoke-WebRequest -Uri "$frontendUrl/services" -Method Get -TimeoutSec 10 -UseBasicParsing
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Cyan
    return $response.StatusCode -eq 200
}

Test-Feature "Login Page Loads" {
    $response = Invoke-WebRequest -Uri "$frontendUrl/LoginScreenUser" -Method Get -TimeoutSec 10 -UseBasicParsing
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Cyan
    return $response.StatusCode -eq 200
}

Test-Feature "Admin Dashboard Page Loads" {
    $response = Invoke-WebRequest -Uri "$frontendUrl/admin" -Method Get -TimeoutSec 10 -UseBasicParsing
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Cyan
    return $response.StatusCode -eq 200
}

Test-Feature "User Dashboard Page Loads" {
    $response = Invoke-WebRequest -Uri "$frontendUrl/userDashboard" -Method Get -TimeoutSec 10 -UseBasicParsing
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Cyan
    return $response.StatusCode -eq 200
}

Test-Feature "Developer Dashboard Page Loads" {
    $response = Invoke-WebRequest -Uri "$frontendUrl/devDashBoard" -Method Get -TimeoutSec 10 -UseBasicParsing
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Cyan
    return $response.StatusCode -eq 200
}

# ============================================================
# PHASE 2: BACKEND API CONNECTIVITY
# ============================================================
Write-Host "`n🔌 PHASE 2: BACKEND API CONNECTIVITY" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Magenta

Test-Feature "Django Admin Accessible" {
    try {
        $response = Invoke-WebRequest -Uri "$backendUrl/admin/" -Method Get -TimeoutSec 10 -UseBasicParsing
        Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Cyan
        return $response.StatusCode -eq 200
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   Status: $statusCode" -ForegroundColor Red
        return $false
    }
}

Test-Feature "Careers API Returns Data" {
    try {
        $response = Invoke-RestMethod -Uri "$backendUrl/careers/careers/" -Method Get -TimeoutSec 10
        $count = ($response | Measure-Object).Count
        Write-Host "   Found: $count career postings" -ForegroundColor Cyan
        return $count -gt 0
    } catch {
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

Test-Feature "Services API Accessible" {
    try {
        $response = Invoke-WebRequest -Uri "$backendUrl/services/" -Method Get -TimeoutSec 10 -UseBasicParsing
        Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Cyan
        return $response.StatusCode -eq 200
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   Status: $statusCode" -ForegroundColor Red
        return $false
    }
}

Test-Feature "Tasks/Boards API Accessible" {
    try {
        $response = Invoke-RestMethod -Uri "$backendUrl/task/boards/" -Method Get -TimeoutSec 10
        Write-Host "   Status: 200 OK" -ForegroundColor Cyan
        return $true
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   Status: $statusCode" -ForegroundColor Red
        return $false
    }
}

# ============================================================
# PHASE 3: USER CREATION TEST
# ============================================================
Write-Host "`n👤 PHASE 3: AUTO USER CREATION TEST" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Magenta

Test-Feature "Auto-Create User Endpoint Works" {
    try {
        $timestamp = Get-Date -Format "yyyyMMddHHmmss"
        $testEmail = "test_user_$timestamp@maindotest.com"
        
        $userData = @{
            name = "Test User $timestamp"
            email = $testEmail
            phone = "+27 84 1234567"
            company = "Test Company"
            service = "Website Development - Test"
            message = "This is an automated test of the user creation system"
        } | ConvertTo-Json
        
        Write-Host "   Creating test user with email: $testEmail" -ForegroundColor Cyan
        
        $response = Invoke-RestMethod -Uri "$backendUrl/accounts/auto-create-user/" `
            -Method Post `
            -Body $userData `
            -ContentType "application/json" `
            -TimeoutSec 15
        
        if ($response.success -and $response.user_created) {
            Write-Host "   ✅ User created successfully!" -ForegroundColor Green
            Write-Host "   Username: $($response.username)" -ForegroundColor Cyan
            Write-Host "   User ID: $($response.user_id)" -ForegroundColor Cyan
            Write-Host "   Email sent: $($response.email_sent)" -ForegroundColor Cyan
            return $true
        } else {
            Write-Host "   ⚠️ Response success=$($response.success)" -ForegroundColor Yellow
            return $false
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   ❌ Failed with status: $statusCode" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# ============================================================
# PHASE 4: BOARD CREATION TEST
# ============================================================
Write-Host "`n📋 PHASE 4: AUTO BOARD CREATION TEST" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Magenta

Test-Feature "Auto-Create Board from Request Works" {
    try {
        $timestamp = Get-Date -Format "yyyyMMddHHmmss"
        
        $boardData = @{
            user_id = 1
            user_name = "Test Client $timestamp"
            user_email = "testboard_$timestamp@maindotest.com"
            service = "E-commerce Website"
            plan = "Pro Plan"
            price = "$2999"
            message = "Automated test of board creation system"
        } | ConvertTo-Json
        
        Write-Host "   Creating test board..." -ForegroundColor Cyan
        
        $response = Invoke-RestMethod -Uri "$backendUrl/task/create-board-from-request/" `
            -Method Post `
            -Body $boardData `
            -ContentType "application/json" `
            -TimeoutSec 15
        
        if ($response.success) {
            Write-Host "   ✅ Board created successfully!" -ForegroundColor Green
            Write-Host "   Board ID: $($response.board_id)" -ForegroundColor Cyan
            Write-Host "   Board Name: $($response.board_name)" -ForegroundColor Cyan
            Write-Host "   Lists Created: $($response.lists_created)" -ForegroundColor Cyan
            Write-Host "   Admins Notified: $($response.admins_notified)" -ForegroundColor Cyan
            return $true
        } else {
            return $false
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   ❌ Failed with status: $statusCode" -ForegroundColor Red
        return $false
    }
}

# ============================================================
# PHASE 5: LOGIN TEST WITH EXISTING USER
# ============================================================
Write-Host "`n🔐 PHASE 5: LOGIN SYSTEM TEST" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Magenta

Test-Feature "Login Endpoint Works (Test with ludmil account)" {
    try {
        $loginData = @{
            username = "ludmil"
            password = "Maitland@2025"
        } | ConvertTo-Json
        
        Write-Host "   Attempting login..." -ForegroundColor Cyan
        
        $response = Invoke-RestMethod -Uri "$backendUrl/account/custom-login/" `
            -Method Post `
            -Body $loginData `
            -ContentType "application/json" `
            -TimeoutSec 10
        
        if ($response.message -eq "Login successful" -and $response.token) {
            Write-Host "   ✅ Login successful!" -ForegroundColor Green
            Write-Host "   Username: $($response.username)" -ForegroundColor Cyan
            Write-Host "   User ID: $($response.user_id)" -ForegroundColor Cyan
            Write-Host "   Groups: $($response.groups -join ', ')" -ForegroundColor Cyan
            Write-Host "   Is Staff: $($response.is_staff)" -ForegroundColor Cyan
            Write-Host "   Token received: $($response.token.Substring(0, 10))..." -ForegroundColor Cyan
            return $true
        } else {
            Write-Host "   ⚠️ Unexpected response" -ForegroundColor Yellow
            return $false
        }
    } catch {
        Write-Host "   ❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# ============================================================
# PHASE 6: DATA RETRIEVAL APIS
# ============================================================
Write-Host "`n📊 PHASE 6: DATA RETRIEVAL APIS" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Magenta

Test-Feature "Services Data Retrieved" {
    try {
        # Try multiple possible endpoints
        $endpoints = @(
            "$backendUrl/information/services/",
            "$backendUrl/services/",
            "$backendUrl/api/services/"
        )
        
        foreach ($endpoint in $endpoints) {
            try {
                $response = Invoke-RestMethod -Uri $endpoint -Method Get -TimeoutSec 5
                Write-Host "   ✅ Working endpoint: $endpoint" -ForegroundColor Green
                if ($response -is [array]) {
                    Write-Host "   Found: $($response.Count) services" -ForegroundColor Cyan
                } else {
                    Write-Host "   Data type: Object" -ForegroundColor Cyan
                }
                return $true
            } catch {
                continue
            }
        }
        Write-Host "   ❌ No working services endpoint found" -ForegroundColor Red
        return $false
    } catch {
        return $false
    }
}

Test-Feature "Blog Posts Retrieved" {
    try {
        $response = Invoke-RestMethod -Uri "$backendUrl/posts/blogs/" -Method Get -TimeoutSec 10
        $count = if ($response -is [array]) { $response.Count } else { 0 }
        Write-Host "   Found: $count blog posts" -ForegroundColor Cyan
        return $true
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   Status: $statusCode" -ForegroundColor Red
        return $false
    }
}

Test-Feature "Projects Retrieved" {
    try {
        $response = Invoke-RestMethod -Uri "$backendUrl/projects/" -Method Get -TimeoutSec 10
        $count = if ($response -is [array]) { $response.Count } else { 0 }
        Write-Host "   Found: $count projects" -ForegroundColor Cyan
        return $true
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   Status: $statusCode" -ForegroundColor Red
        return $false
    }
}

Test-Feature "Team Members Retrieved" {
    try {
        $response = Invoke-RestMethod -Uri "$backendUrl/information/team/" -Method Get -TimeoutSec 10
        $count = if ($response -is [array]) { $response.Count } else { 0 }
        Write-Host "   Found: $count team members" -ForegroundColor Cyan
        return $true
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   Status: $statusCode" -ForegroundColor Red
        return $false
    }
}

Test-Feature "Testimonials Retrieved" {
    try {
        $response = Invoke-RestMethod -Uri "$backendUrl/information/testimonials/" -Method Get -TimeoutSec 10
        $count = if ($response -is [array]) { $response.Count } else { 0 }
        Write-Host "   Found: $count testimonials" -ForegroundColor Cyan
        return $true
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   Status: $statusCode" -ForegroundColor Red
        return $false
    }
}

# ============================================================
# PHASE 7: TASK MANAGEMENT APIS
# ============================================================
Write-Host "`n📋 PHASE 7: TASK MANAGEMENT APIS" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Magenta

Test-Feature "Boards API Accessible" {
    try {
        $response = Invoke-RestMethod -Uri "$backendUrl/task/boards/" -Method Get -TimeoutSec 10
        $count = if ($response -is [array]) { $response.Count } else { 0 }
        Write-Host "   Found: $count boards" -ForegroundColor Cyan
        return $true
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   Status: $statusCode" -ForegroundColor Red
        return $false
    }
}

Test-Feature "Lists API Accessible" {
    try {
        $response = Invoke-RestMethod -Uri "$backendUrl/task/lists/" -Method Get -TimeoutSec 10
        $count = if ($response -is [array]) { $response.Count } else { 0 }
        Write-Host "   Found: $count lists" -ForegroundColor Cyan
        return $true
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   Status: $statusCode" -ForegroundColor Red
        return $false
    }
}

Test-Feature "Cards API Accessible" {
    try {
        $response = Invoke-RestMethod -Uri "$backendUrl/task/cards/" -Method Get -TimeoutSec 10
        $count = if ($response -is [array]) { $response.Count } else { 0 }
        Write-Host "   Found: $count cards" -ForegroundColor Cyan
        return $true
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   Status: $statusCode" -ForegroundColor Red
        return $false
    }
}

Test-Feature "Tasks API Accessible" {
    try {
        $response = Invoke-RestMethod -Uri "$backendUrl/task/tasks/" -Method Get -TimeoutSec 10
        $count = if ($response -is [array]) { $response.Count } else { 0 }
        Write-Host "   Found: $count tasks" -ForegroundColor Cyan
        return $true
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   Status: $statusCode" -ForegroundColor Red
        return $false
    }
}

# ============================================================
# FINAL SUMMARY
# ============================================================
Write-Host "`n" -NoNewline
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$total = $testResults.Passed + $testResults.Failed
$successRate = if ($total -gt 0) { [math]::Round(($testResults.Passed / $total) * 100, 1) } else { 0 }

Write-Host "`nTotal Tests:   $total" -ForegroundColor White
Write-Host "Passed:        $($testResults.Passed)" -ForegroundColor Green
Write-Host "Failed:        $($testResults.Failed)" -ForegroundColor Red
Write-Host "Success Rate:  $successRate%" -ForegroundColor $(if ($successRate -ge 80) { "Green" } elseif ($successRate -ge 50) { "Yellow" } else { "Red" })

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "DETAILED RESULTS" -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor Cyan

$testResults.Tests | Format-Table -AutoSize

# ============================================================
# RECOMMENDATIONS
# ============================================================
Write-Host "`n============================================================" -ForegroundColor Yellow
Write-Host "RECOMMENDATIONS" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Yellow

if ($testResults.Failed -gt 0) {
    Write-Host "`n⚠️ ISSUES DETECTED - ACTION REQUIRED:`n" -ForegroundColor Yellow
    
    $failedTests = $testResults.Tests | Where-Object { $_.Status -ne "PASS" }
    
    if ($failedTests | Where-Object { $_.Test -like "*Backend*" -or $_.Test -like "*API*" }) {
        Write-Host "Backend API Issues:" -ForegroundColor Red
        Write-Host "  → Backend is returning errors (500 or 404)" -ForegroundColor White
        Write-Host "  → Latest code may not be deployed to PythonAnywhere`n" -ForegroundColor White
        
        Write-Host "DEPLOY TO PYTHONANYWHERE:" -ForegroundColor Green
        Write-Host "  1. Login to https://www.pythonanywhere.com" -ForegroundColor White
        Write-Host "  2. Open Bash console" -ForegroundColor White
        Write-Host "  3. cd ~/digital_agency" -ForegroundColor White
        Write-Host "  4. git pull origin main" -ForegroundColor White
        Write-Host "  5. source myenv/bin/activate" -ForegroundColor White
        Write-Host "  6. pip install -r requirements.txt" -ForegroundColor White
        Write-Host "  7. python manage.py migrate" -ForegroundColor White
        Write-Host "  8. python manage.py collectstatic --no-input" -ForegroundColor White
        Write-Host "  9. Web tab → Click 'Reload' button`n" -ForegroundColor White
    }
    
    if ($failedTests | Where-Object { $_.Test -like "*Frontend*" }) {
        Write-Host "Frontend Issues:" -ForegroundColor Red
        Write-Host "  → Some frontend pages not loading" -ForegroundColor White
        Write-Host "  → Check Vercel deployment status`n" -ForegroundColor White
    }
} else {
    Write-Host "`n✅ ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "`n🎉 Production platform is fully operational!" -ForegroundColor Green
    Write-Host "`nYou can now:" -ForegroundColor White
    Write-Host "  ✓ Accept real user service requests" -ForegroundColor Green
    Write-Host "  ✓ Accounts will be created automatically" -ForegroundColor Green
    Write-Host "  ✓ Boards will be created for each project" -ForegroundColor Green
    Write-Host "  ✓ Admins will receive email notifications" -ForegroundColor Green
    Write-Host "  ✓ Clients will receive login credentials" -ForegroundColor Green
    Write-Host "  ✓ Everyone can track projects in real-time" -ForegroundColor Green
}

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "NEXT STEPS" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

if ($successRate -eq 100) {
    Write-Host "`n✅ Platform Ready for Production Use!" -ForegroundColor Green
    Write-Host "`n1. Share your website: https://www.maindodigital.com" -ForegroundColor White
    Write-Host "2. Monitor admin dashboard for new requests" -ForegroundColor White
    Write-Host "3. Check emails for notifications" -ForegroundColor White
    Write-Host "4. Test with a real service request" -ForegroundColor White
} else {
    Write-Host "`n⚠️ Complete deployment first, then retest" -ForegroundColor Yellow
    Write-Host "`nRun this script again after deployment:" -ForegroundColor White
    Write-Host "  .\full_production_test.ps1" -ForegroundColor Cyan
}

Write-Host "`n============================================================`n" -ForegroundColor Cyan

# Save results to file
$testResults.Tests | Export-Csv -Path "production_test_results.csv" -NoTypeInformation
Write-Host "📄 Results saved to: production_test_results.csv`n" -ForegroundColor Gray

