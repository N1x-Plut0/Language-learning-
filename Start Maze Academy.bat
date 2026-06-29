@echo off
cd /d "%~dp0"
title Maze Academy
echo.
echo   Starting Maze Academy...
echo   A browser tab will open automatically in a moment.
echo.
echo   Keep this window open while you use the site.
echo   Close it (or press Ctrl+C) to stop the server.
echo.
node server.js
echo.
echo   The server has stopped. Press any key to close this window.
pause >nul
