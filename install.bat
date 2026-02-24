@echo off
chcp 65001 >nul 2>&1
title Sport Vision - 环境安装

echo.
echo   ⚡ Sport Vision — 环境安装
echo   =====================================
echo.

:: ========== 1. 检查 Python ==========
echo [1/5] 检查 Python 环境...
python --version >nul 2>&1
if errorlevel 1 (
    echo   ❌ 未找到 Python，请先安装 Python 3.9+
    pause
    exit /b 1
)
for /f "tokens=2" %%v in ('python --version 2^>^&1') do echo   ✅ 找到 Python %%v

:: ========== 2. 检查 Node.js ==========
echo.
echo [2/5] 检查 Node.js 环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo   ❌ 未找到 Node.js，请先安装 Node.js 18+
    pause
    exit /b 1
)
for /f %%v in ('node --version 2^>^&1') do echo   ✅ 找到 Node.js %%v

:: ========== 3. 创建虚拟环境 ==========
echo.
echo [3/5] 创建 Python 虚拟环境...
if exist .venv (
    echo   ✅ 虚拟环境已存在，跳过
) else (
    python -m venv .venv
    if errorlevel 1 (
        echo   ❌ 创建虚拟环境失败
        pause
        exit /b 1
    )
    echo   ✅ 虚拟环境创建完成
)

:: ========== 4. 安装 Python 依赖 ==========
echo.
echo [4/5] 安装 Python 依赖（阿里镜像）...
call .venv\Scripts\pip.exe install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com --progress-bar on
if errorlevel 1 (
    echo   ❌ Python 依赖安装失败
    pause
    exit /b 1
)
echo   ✅ Python 依赖安装完成

:: ========== 5. 安装前端依赖并构建 ==========
echo.
echo [5/5] 安装前端依赖并构建...
cd frontend
echo   📦 npm install...
call npm install --registry=https://registry.npmmirror.com --progress
if errorlevel 1 (
    echo   ❌ 前端依赖安装失败
    cd ..
    pause
    exit /b 1
)
echo   🔨 构建前端...
call npm run build
if errorlevel 1 (
    echo   ❌ 前端构建失败
    cd ..
    pause
    exit /b 1
)
cd ..
echo   ✅ 前端构建完成

:: ========== 6. 下载模型 ==========
echo.
if exist models\pose_landmarker_lite.task (
    echo   ✅ 姿态模型已存在，跳过下载
) else (
    echo   🧠 下载 MediaPipe 姿态模型...
    if not exist models mkdir models
    powershell -Command "Invoke-WebRequest -Uri 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task' -OutFile 'models\pose_landmarker_lite.task'"
    if errorlevel 1 (
        echo   ⚠️ 模型下载失败，请手动下载
    ) else (
        echo   ✅ 模型下载完成
    )
)

:: ========== 完成 ==========
echo.
echo   =====================================
echo   ✅ 所有安装完成！
echo   运行 start.bat 启动项目
echo   =====================================
echo.
pause
