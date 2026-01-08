@echo off
echo Pushing to GitHub...
cd /d "%~dp0"
git add .
git commit -m "Deploy new landing page and updates"
git push origin main
echo.
echo Done! Press any key to close...
pause

