@echo off
echo ========================================
echo  Starting ComPrice Backend API
echo  Server: http://localhost:8000
echo  API Docs: http://localhost:8000/docs
echo ========================================
call venv\Scripts\activate.bat
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
