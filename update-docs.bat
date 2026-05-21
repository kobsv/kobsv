@echo off
REM Dobbeltklikk denne filen for aa oppdatere dokumentlisten paa hjemmesiden
powershell -ExecutionPolicy Bypass -File "%~dp0update-docs.ps1"
echo.
pause
