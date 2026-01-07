@echo off
chcp 65001 >nul
echo 正在设置媒体文件符号链接...
echo.

REM 创建目标目录
if not exist "public\media" mkdir "public\media"

REM 以管理员权限运行 PowerShell 脚本
powershell -ExecutionPolicy Bypass -File "%~dp0setup-media.ps1"

pause

