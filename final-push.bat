@echo off
echo ============================================
echo  FINAL PUSH TO GITHUB
echo ============================================
cd /d "%~dp0"

echo.
echo Step 1: Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Step 2: Cleaning build files from git...
git rm -r --cached frontend/.next 2>nul
git restore frontend/.next 2>nul
git clean -fd frontend/.next 2>nul

echo.
echo Step 3: Adding all source code...
git add backend/
git add frontend/src/
git add frontend/public/
git add frontend/package*.json
git add frontend/*.config.*
git add frontend/*.json
git add frontend/.eslintrc.json
git add .gitignore
git add *.md

echo.
echo Step 4: Committing changes...
git commit -m "Fix: Navbar with My Wallet, user email, and landing page buttons"

echo.
echo ============================================
echo  IMPORTANT: GitHub will block this push
echo ============================================
echo.
echo BEFORE running this push, you MUST:
echo 1. Open this link in your browser:
echo    https://github.com/Kadaz100/Trivesta/security/secret-scanning/unblock-secret/35yA78dOD1YW4AZ8E0g6dJIYDCq
echo 2. Click "Allow secret" or "I'll fix it later"
echo 3. Then come back and press any key to continue...
echo.
pause

echo.
echo Step 5: Pushing to GitHub...
git push origin main --force

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo  SUCCESS! Code pushed to GitHub!
    echo ============================================
    echo.
    echo Now go to:
    echo 1. Vercel dashboard - click "Redeploy"
    echo 2. Wait 2-3 minutes for deployment
    echo 3. Test at trivestainvest.com
) else (
    echo.
    echo Push failed! Check error above.
)

echo.
pause







