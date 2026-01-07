# PowerShell script: Create symbolic links for media files
# This script creates symbolic links in public/media pointing to actual media files

# Set console output encoding to UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Setting up media file symbolic links..." -ForegroundColor Green

# 创建目标目录
$targetDir = "public\media"
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    Write-Host "Created directory: $targetDir" -ForegroundColor Yellow
}

# 获取项目根目录
$rootDir = Get-Location

# 定义需要链接的主题文件夹
$themeDirs = @(
    "[001] Тема 1 Поговорим об этикете!",
    "[002] Тема 2 В гостях хорошо",
    "[003] Тема 3 В библиотеке",
    "[004] Тема 4 Изучаем русский язык!",
    "[005] Тема 5 О здоровье"
)

$linkCount = 0

foreach ($themeDir in $themeDirs) {
    $themePath = Join-Path $rootDir $themeDir
    
    if (Test-Path $themePath) {
        Write-Host "Processing theme directory: $themeDir" -ForegroundColor Cyan
        
        # 递归查找所有音频和视频文件
        $mediaFiles = Get-ChildItem -Path $themePath -Recurse -Include *.mp3,*.mp4
        
        foreach ($file in $mediaFiles) {
            # 创建相对路径的符号链接
            $relativePath = $file.FullName.Substring($rootDir.Path.Length + 1)
            $linkPath = Join-Path $targetDir $relativePath
            $linkDir = Split-Path $linkPath -Parent
            
            # 创建链接目标目录
            if (-not (Test-Path $linkDir)) {
                New-Item -ItemType Directory -Path $linkDir -Force | Out-Null
            }
            
            # 创建符号链接（如果不存在）
            if (-not (Test-Path $linkPath)) {
                try {
                    # 计算相对路径
                    $targetPath = $file.FullName
                    $relativeTarget = [System.IO.Path]::GetRelativePath($linkDir, $targetPath)
                    
                    # 创建符号链接
                    New-Item -ItemType SymbolicLink -Path $linkPath -Target $targetPath -Force | Out-Null
                    $linkCount++
                    Write-Host "  [OK] Created link: $relativePath" -ForegroundColor Gray
                } catch {
                    Write-Host "  [FAIL] Failed to create link: $relativePath" -ForegroundColor Red
                    Write-Host "    Error: $_" -ForegroundColor DarkRed
                    Write-Host "    Tip: May need administrator privileges" -ForegroundColor Yellow
                }
            } else {
                Write-Host "  [SKIP] Link already exists: $relativePath" -ForegroundColor DarkGray
            }
        }
    } else {
        Write-Host "Warning: Theme directory not found: $themeDir" -ForegroundColor Yellow
    }
}

Write-Host "`nDone! Created $linkCount symbolic links." -ForegroundColor Green
Write-Host "If you encounter permission issues, run PowerShell as Administrator." -ForegroundColor Yellow

