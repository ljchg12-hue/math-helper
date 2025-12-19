@echo off
chcp 65001 >nul 2>&1
python create_portable.py
if errorlevel 1 (
    echo.
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org
    echo.
)
pause
