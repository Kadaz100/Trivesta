@echo off
echo Testing backend connection...
echo.
curl http://localhost:5000/api/auth/me
echo.
echo.
echo If you see "User not found" or similar, backend is working!
echo If you see connection error, backend is not running.
echo.
pause

