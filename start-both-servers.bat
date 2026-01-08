@echo off
echo ============================================
echo  STARTING TRIVESTA BACKEND AND FRONTEND
echo ============================================

echo.
echo Starting Backend on port 5000...
start "Trivesta Backend" cmd /k "cd backend && npm run dev"

echo.
echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak

echo.
echo Starting Frontend on port 3000...
start "Trivesta Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ============================================
echo  SERVERS STARTING!
echo ============================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Close this window when done, or close each server window individually.
echo.
pause

