# 媒体文件访问方案

## 当前实现

系统支持两种方式访问媒体文件：

### 方式 1：通过映射配置（当前实现）

代码中已经配置了文件路径映射（`src/config/mediaConfig.ts`），将考卷中的路径（如 `theme1/task10_dialog.mp3`）映射到实际文件位置。

**优点**：不需要移动文件，保持原始文件结构  
**缺点**：需要手动维护映射表

### 方式 2：使用符号链接

运行 `setup-media.ps1` 脚本在 `public/media` 目录创建符号链接。

**优点**：自动化，不需要手动维护  
**缺点**：需要管理员权限，某些系统可能不支持

## 推荐使用方式

1. **开发阶段**：使用符号链接（运行 `setup-media.ps1`）
2. **生产部署**：将文件复制到 `public/media` 目录并重命名

## 文件路径说明

考卷中使用的是简化路径：
- `theme1/task10_dialog.mp3`
- `theme2/task6_dialog1.mp3`

这些路径会被 `mapAudioPath()` 函数转换为实际文件路径。

## 添加新文件映射

当添加新的考卷时，需要在 `src/config/mediaConfig.ts` 中添加对应的映射：

```typescript
export const mediaFileMapping: Record<string, string> = {
  // 新映射
  'theme1/new_file.mp3': '[001] Тема 1.../新文件名.mp3',
};
```

