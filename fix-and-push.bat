@echo off
echo ============================================
echo  FIXING GIT AND PUSHING
echo ============================================
cd /d "%~dp0"

echo.
echo Removing .next from Git tracking...
git rm -r --cached frontend/.next 2>nul

echo.
echo Adding source code changes...
git add backend/
git add frontend/src/
git add frontend/public/
git add .gitignore
git add README.md
git add frontend/package*.json
git add frontend/*.config.*
git add frontend/*.json

echo.
echo Committing...
git commit -m "Deploy: New landing page, referral system, team photos, and UI updates"

echo.
echo Pushing to GitHub (this may take a minute)...
git push origin main --force

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo  SUCCESS! Code is now on GitHub!
    echo ============================================
    echo.
    echo Next: Go to Vercel dashboard and click "Redeploy"
) else (
    echo.
    echo ERROR: Something went wrong. Copy the error above.
)

echo.
pause







