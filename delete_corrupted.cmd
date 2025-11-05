@echo off
echo === Deleting Corrupted pdf-lib Files ===
echo.

cd /d "H:\GitHub\digital_agency_front_end"

echo Deleting corrupted StandardFontEmbedder files...
del /f /q "node_modules\pdf-lib\es\core\embedders\StandardFontEmbedder.d.ts.map" 2>nul
del /f /q "node_modules\pdf-lib\es\core\embedders\StandardFontEmbedder.js" 2>nul
del /f /q "node_modules\pdf-lib\es\core\embedders\StandardFontEmbedder.js.map" 2>nul

echo Deleting corrupted ViewerPreferences files...
del /f /q "node_modules\pdf-lib\es\core\interactive\ViewerPreferences.d.ts" 2>nul

echo Deleting pdf-lib folder...
rd /s /q "node_modules\pdf-lib" 2>nul

echo.
if exist "node_modules\pdf-lib" (
    echo [FAILED] Could not delete pdf-lib folder automatically
    echo.
    echo MANUAL STEPS REQUIRED:
    echo 1. Close this window
    echo 2. Close Cursor/VS Code completely
    echo 3. Restart your computer
    echo 4. Delete the folder manually in File Explorer:
    echo    H:\GitHub\digital_agency_front_end\node_modules
    echo 5. Then run: yarn install
    pause
    exit /b 1
) else (
    echo [SUCCESS] pdf-lib folder deleted!
    echo.
    echo Reinstalling dependencies...
    call yarn install
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo [SUCCESS] Dependencies installed!
        echo.
        echo Running build...
        call yarn build
        
        if %ERRORLEVEL% EQU 0 (
            echo.
            echo ===================================
            echo    BUILD SUCCESSFUL!
            echo ===================================
        ) else (
            echo.
            echo [ERROR] Build failed. Check errors above.
        )
    ) else (
        echo [ERROR] Failed to install dependencies
    )
)

pause

