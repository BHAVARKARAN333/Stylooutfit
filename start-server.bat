@echo off
echo ========================================
echo  StyloOutfit Backend Server Starter
echo ========================================
echo.

cd server

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
) else (
    echo Dependencies already installed.
    echo.
)

echo Starting backend server...
echo Server will run on http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm start
