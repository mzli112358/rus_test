# 媒体文件设置指南

## 问题说明

考卷中的媒体文件路径（如 `theme1/task10_dialog.mp3`）需要映射到实际的音频/视频文件位置。由于实际文件位于项目根目录的主题文件夹中，我们需要建立连接。

## 解决方案

### 方案 1：使用符号链接（推荐）

使用提供的 PowerShell 脚本自动创建符号链接：

1. **Windows PowerShell**（推荐以管理员身份运行）：
```powershell
.\setup-media.ps1
```

或者双击运行 `setup-media.bat`

2. **如果遇到权限问题**：
   - 右键点击 PowerShell，选择"以管理员身份运行"
   - 然后执行脚本

### 方案 2：手动配置映射

编辑 `src/config/mediaConfig.ts` 文件，添加或修改文件映射：

```typescript
export const mediaFileMapping: Record<string, string> = {
  'theme1/task10_dialog.mp3': '[001] Тема 1.../实际文件名.mp3',
  // 添加更多映射...
};
```

### 方案 3：移动文件到 public/media

如果符号链接不起作用，可以手动将文件复制到 `public/media` 目录：

1. 创建目录结构：`public/media/theme1/`, `public/media/theme2/` 等
2. 将对应的音频/视频文件复制到相应目录
3. 重命名为考卷中使用的文件名（如 `task10_dialog.mp3`）

## 文件路径映射说明

考卷中使用的是简化路径格式：
- `theme1/task10_dialog.mp3`
- `theme2/task6_dialog1.mp3`

这些路径需要在 `src/config/mediaConfig.ts` 中映射到实际文件路径。

## 视频文件支持

对于 `.mp4` 文件，系统会自动：
- 显示视频播放器（带画面）
- 同时提供纯音频播放器（只播放声音）

## 故障排除

1. **文件无法播放**：
   - 检查文件路径映射是否正确
   - 检查文件是否真实存在
   - 查看浏览器控制台错误信息

2. **符号链接创建失败**：
   - 确保以管理员身份运行
   - 或者使用方案 3 手动复制文件

3. **中文路径问题**：
   - 代码已自动处理 URL 编码
   - 如果仍有问题，检查文件系统编码设置

