# PowerShell script to fix corrupted pdf-lib files
# Run this as Administrator if normal deletion fails

Write-Host "=== Fixing Corrupted pdf-lib Files ===" -ForegroundColor Yellow
Write-Host ""

$projectPath = "H:\GitHub\digital_agency_front_end"
$nodeModulesPath = Join-Path $projectPath "node_modules"
$pdfLibPath = Join-Path $nodeModulesPath "pdf-lib"

# Check if node_modules exists
if (Test-Path $nodeModulesPath) {
    Write-Host "Found node_modules folder" -ForegroundColor Green
    
    # Try to delete pdf-lib folder specifically
    if (Test-Path $pdfLibPath) {
        Write-Host "Attempting to delete pdf-lib folder..." -ForegroundColor Yellow
        try {
            Remove-Item -Path $pdfLibPath -Recurse -Force -ErrorAction Stop
            Write-Host "✓ Successfully deleted pdf-lib folder" -ForegroundColor Green
        }
        catch {
            Write-Host "Failed to delete pdf-lib. Trying alternative methods..." -ForegroundColor Red
            
            # Try using cmd
            Write-Host "Trying CMD method..." -ForegroundColor Yellow
            cmd /c "rmdir /s /q `"$pdfLibPath`"" 2>$null
            
            if (-not (Test-Path $pdfLibPath)) {
                Write-Host "CMD method succeeded!" -ForegroundColor Green
            }
            else {
                Write-Host "CMD method failed. Manual deletion required." -ForegroundColor Red
                Write-Host ""
                Write-Host "MANUAL STEPS REQUIRED:" -ForegroundColor Yellow
                Write-Host "1. Close this terminal and all VS Code/Cursor windows" -ForegroundColor White
                Write-Host "2. Restart your computer" -ForegroundColor White
                Write-Host "3. Open File Explorer" -ForegroundColor White
                Write-Host "4. Navigate to: $nodeModulesPath" -ForegroundColor White
                Write-Host "5. Delete the node_modules folder" -ForegroundColor White
                Write-Host "6. Run: yarn install" -ForegroundColor White
                exit 1
            }
        }
    }
    
    # Now try deleting all of node_modules
    Write-Host "Deleting entire node_modules folder..." -ForegroundColor Yellow
    try {
        Remove-Item -Path $nodeModulesPath -Recurse -Force -ErrorAction Stop
        Write-Host "✓ Successfully deleted node_modules" -ForegroundColor Green
    }
    catch {
        Write-Host "Trying CMD for full deletion..." -ForegroundColor Yellow
        cmd /c "rmdir /s /q `"$nodeModulesPath`"" 2>$null
        
        if (-not (Test-Path $nodeModulesPath)) {
            Write-Host "Full deletion succeeded!" -ForegroundColor Green
        }
        else {
            Write-Host "Automatic deletion failed. See manual steps above." -ForegroundColor Red
            exit 1
        }
    }
}
else {
    Write-Host "node_modules folder doesn't exist - nothing to delete" -ForegroundColor Green
}

# Reinstall dependencies
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
Set-Location $projectPath
yarn install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Now running build..." -ForegroundColor Yellow
    yarn build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓✓✓ BUILD SUCCESSFUL! ✓✓✓" -ForegroundColor Green
        Write-Host "All errors have been fixed!" -ForegroundColor Green
    }
    else {
        Write-Host ""
        Write-Host "Build failed. Check errors above." -ForegroundColor Red
    }
}
else {
    Write-Host "Failed to install dependencies. Check errors above." -ForegroundColor Red
}

