@echo off
chcp 65001 >nul 2>&1
title Sport Vision - 运动智能分析系统

echo.
echo   ⚡ Sport Vision — 运动智能分析系统
echo   =====================================
echo.

:: 检查虚拟环境
if not exist .venv (
    echo   ❌ 未找到虚拟环境，请先运行 install.bat
    pause
    exit /b 1
)

:: 检查前端构建产物
if not exist frontend\dist\index.html (
    echo   ❌ 未找到前端构建产物，请先运行 install.bat
    pause
    exit /b 1
)

echo   🚀 启动服务器...
echo   → http://localhost:8000
echo.
echo   按 Ctrl+C 停止服务器
echo.

:: 自动打开浏览器
start http://localhost:8000

:: 启动后端
call .venv\Scripts\python.exe -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
