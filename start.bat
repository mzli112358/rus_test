@echo off
chcp 65001 >nul
echo ========================================
echo 俄语视听说考试系统 - 启动脚本
echo ========================================
echo.

REM 检查 Node.js 是否安装
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未检测到 Node.js
    echo.
    echo 请先安装 Node.js：
    echo 1. 访问 https://nodejs.org/
    echo 2. 下载并安装 LTS 版本
    echo 3. 安装时确保勾选 "Add to PATH"
    echo 4. 重新打开此窗口
    echo.
    echo 详细说明请查看 QUICKSTART.md
    pause
    exit /b 1
)

echo [检查] Node.js 已安装
node --version
npm --version
echo.

REM 检查 node_modules 是否存在
if not exist "node_modules" (
    echo [安装] 正在安装依赖包...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
    echo [完成] 依赖安装完成
    echo.
)

REM 启动开发服务器
echo [启动] 正在启动开发服务器...
echo.
echo 浏览器将自动打开，或手动访问显示的地址
echo 按 Ctrl+C 停止服务器
echo.
echo ========================================
echo.

call npm run dev

pause

