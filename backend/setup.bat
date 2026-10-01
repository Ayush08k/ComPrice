@echo off
echo ========================================
echo  Comprize Backend Setup Script
echo ========================================

echo [1/4] Creating virtual environment...
python -m venv venv

echo [2/4] Activating venv and installing dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt

echo [3/4] Installing Playwright browsers...
playwright install chromium

echo [4/4] Copying .env file...
if not exist .env (
    copy .env.example .env
    echo [!] Created .env from template. EDIT IT to add your GEMINI_API_KEY!
) else (
    echo [OK] .env file already exists.
)

echo.
echo ========================================
echo  Setup complete! 
echo  Run: start_server.bat to launch API
echo ========================================
pause
