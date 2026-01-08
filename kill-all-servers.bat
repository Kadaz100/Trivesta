@echo off
echo Killing all Node.js processes...
taskkill /F /IM node.exe
echo.
echo Waiting 3 seconds...
timeout /t 3 /nobreak
echo.
echo Done! All servers stopped.
echo Now you can run stop-and-push.bat
echo.
pause

