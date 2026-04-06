@echo off
echo Starting Apple Product Management System...

REM Start the backend server in a new window
echo Starting Backend Server on port 5000...
start "Backend Server" cmd /k "cd /d d:\APPLEPROD\backend && node server.js"

REM Start the frontend server in a new window
echo Starting Frontend Server on port 8080...
start "Frontend Server" cmd /k "cd /d d:\APPLEPROD\frontend && npx -y serve -p 8080"

REM Wait a few seconds for the servers to initialize
echo Waiting for servers to initialize...
timeout /t 3 /nobreak > nul

REM Open the website automatically in the default browser
echo Opening website...
start http://localhost:8080/index.html

echo Both servers have been launched and your browser has been opened! You can close this window.
pause
