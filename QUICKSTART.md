# 快速启动指南

## ⚠️ 前提条件：安装 Node.js

您的系统尚未安装 Node.js。请先安装 Node.js 才能运行项目。

### 安装步骤：

1. **下载 Node.js**
   - 访问：https://nodejs.org/
   - 下载 LTS 版本（推荐）
   - 下载 Windows Installer (.msi)

2. **安装 Node.js**
   - 双击下载的 .msi 文件
   - 按照安装向导完成安装（使用默认设置即可）
   - **重要**：安装时确保勾选 "Add to PATH" 选项

3. **验证安装**
   - 关闭当前的 PowerShell/CMD 窗口
   - 重新打开一个新的 PowerShell/CMD 窗口
   - 运行以下命令验证：
   ```bash
   node --version
   npm --version
   ```
   - 如果显示版本号，说明安装成功

## 🚀 启动项目

安装完 Node.js 后，按照以下步骤启动：

### 1. 安装依赖
```bash
npm install
```

### 2. 设置媒体文件（可选）
```powershell
# 如果要以管理员身份运行
.\setup-media.ps1
```

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 打开浏览器
访问显示的地址（通常是 http://localhost:5173）

## 💡 常见问题

### Q: npm 命令不可用
A: 
- 确保已安装 Node.js
- 重新打开命令行窗口
- 检查系统 PATH 环境变量

### Q: 权限错误
A: 
- 右键 PowerShell，选择"以管理员身份运行"
- 或者跳过符号链接，直接使用文件映射配置

### Q: 端口被占用
A: 
- Vite 会自动尝试其他端口
- 查看终端输出中的实际访问地址

## 📝 不使用 Node.js 的替代方案

如果您不想安装 Node.js，可以使用在线工具或预构建版本：
- 将项目上传到 GitHub Pages
- 使用 Vercel/Netlify 等在线部署平台

