@echo off
echo Killing process on port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo Found process ID: %%a
    taskkill /PID %%a /F
)
echo Done! Port 5000 is now free.
pause

