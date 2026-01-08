@echo off
echo ============================================
echo  FORCING PUSH TO GITHUB
echo ============================================
cd /d "%~dp0"

echo.
echo Step 1: Adding all files...
git add -A
if %errorlevel% neq 0 (
    echo ERROR: Failed to add files!
    pause
    exit /b 1
)

echo.
echo Step 2: Committing changes...
git commit -m "Deploy: New landing page, referral system, team photos, and UI updates"
if %errorlevel% neq 0 (
    echo Note: Nothing to commit or commit failed
)

echo.
echo Step 3: Checking remote...
git remote -v

echo.
echo Step 4: Force pushing to GitHub...
git push origin main --force
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Push failed! See error above.
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo  SUCCESS! Code pushed to GitHub!
echo ============================================
echo.
echo Now go to Vercel and click "Redeploy"
echo.
pause

