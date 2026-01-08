@echo off
echo ============================================
echo  CLEANING GIT HISTORY
echo ============================================
cd /d "%~dp0"

echo.
echo This will remove old commits with secrets and create a fresh start.
echo Your current code will be preserved.
echo.
pause

echo.
echo Step 1: Backing up current branch...
git branch backup-before-clean

echo.
echo Step 2: Creating fresh orphan branch...
git checkout --orphan fresh-main

echo.
echo Step 3: Adding all current files (except .next)...
git rm -rf --cached .
git add .gitignore
git add backend/
git add frontend/src/
git add frontend/public/
git add frontend/package*.json
git add frontend/*.config.*
git add frontend/*.json
git add frontend/.eslintrc.json
git add README.md
git add *.md

echo.
echo Step 4: Creating fresh commit...
git commit -m "Fresh start: Trivesta with new landing page, referral system, and updates"

echo.
echo Step 5: Force pushing to GitHub...
git push origin fresh-main:main --force

if %errorlevel% equ 0 (
    echo.
    echo Step 6: Switching back...
    git checkout main
    git reset --hard origin/main
    
    echo.
    echo ============================================
    echo  SUCCESS! Git history cleaned and pushed!
    echo ============================================
) else (
    echo.
    echo ERROR: Push failed. Restoring backup...
    git checkout main
)

echo.
pause







