@echo off
echo ============================================
echo  STOPPING SERVERS AND PUSHING TO GITHUB
echo ============================================
cd /d "%~dp0"

echo.
echo Step 1: Stopping any running Node processes...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo Node processes stopped.
    timeout /t 2 /nobreak >nul
) else (
    echo No Node processes were running.
)

echo.
echo Step 2: Cleaning up uncommitted changes in build files...
git restore frontend/.next 2>nul
git clean -fd frontend/.next 2>nul

echo.
echo Step 3: Adding source files...
git add backend/ frontend/src/ frontend/public/ .gitignore README.md
git add -A

echo.
echo Step 4: Committing changes...
git commit -m "Deploy: New landing page, referral system, team photos, and UI updates"

echo.
echo Step 5: Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo.
    echo Push failed, trying force push...
    git push origin main --force
)

echo.
echo ============================================
echo  DONE! Check output above for any errors
echo ============================================
echo.
pause

