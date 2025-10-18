@echo off
echo Starting Poorito Backend and Frontend servers...

REM Start backend server in a new window
start "Poorito Backend" cmd /k "cd backend && node server.js"

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start frontend server in a new window
start "Poorito Frontend" cmd /k "cd Website && npm start"

echo Both servers starting. Check the console windows for status.
pause
