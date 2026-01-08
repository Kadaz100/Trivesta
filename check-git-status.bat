@echo off
echo Checking Git status...
cd /d "%~dp0"
echo.
echo === Recent commits ===
git log --oneline -5
echo.
echo === Current branch ===
git branch
echo.
echo === Remote status ===
git remote -v
echo.
echo === Checking if pushed ===
git status
echo.
echo Done! Press any key to close...
pause

