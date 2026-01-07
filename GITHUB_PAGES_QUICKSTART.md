# GitHub Pages 快速部署指南

## 🚀 快速开始（3 步）

### 1. 初始化 Git 并推送代码

```bash
# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit for GitHub Pages"

# 添加远程仓库
git remote add origin git@github.com:mzli112358/rus_test.git

# 推送到 GitHub（如果是新仓库）
git branch -M main
git push -u origin main
```

### 2. 启用 GitHub Pages

1. 打开 https://github.com/mzli112358/rus_test/settings/pages
2. 在 `Source` 部分选择 **`GitHub Actions`**
3. 点击 `Save`

### 3. 等待自动部署

- 查看 `Actions` 标签页：https://github.com/mzli112358/rus_test/actions
- 等待部署完成（大约 2-3 分钟）
- 访问网站：https://mzli112358.github.io/rus_test/

## ✅ 完成！

之后每次推送代码到 `main` 分支，都会自动重新部署。

## ⚠️ 注意事项

### 音频文件大小

如果音频文件很大（> 100MB），需要：

1. **检查文件大小**：
   ```bash
   # Windows PowerShell
   Get-ChildItem -Recurse -Include *.mp3,*.mp4 | Select-Object Name, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB,2)}}
   ```

2. **解决方案**：
   - 压缩音频文件
   - 或使用 Git LFS（见 DEPLOY.md）

### 如果仓库名称改变

修改 `vite.config.ts` 中的 `base` 路径：
```typescript
base: '/新仓库名/',
```

## 📖 更多信息

查看 `DEPLOY.md` 了解详细的部署说明和故障排除。

