# 更新日志

## 2026-01-XX

### 新增功能

1. **单选题支持 A/B/C/D 选项**
   - 修改了 `ExamRenderer.tsx`，支持单选题的 A/B/C/D 选项
   - 判断题仍支持 True/False
   - 根据答案类型自动判断是单选题还是判断题

2. **视频文件支持**
   - 自动检测 .mp4 文件
   - 同时提供视频播放器和音频播放器
   - 视频文件会显示画面，音频播放器只播放声音

3. **文件路径映射系统**
   - 创建了 `src/config/mediaConfig.ts` 配置文件
   - 实现了 `src/utils/fileMapper.ts` 工具函数
   - 将考卷中的简化路径映射到实际文件位置

4. **媒体文件设置脚本**
   - 提供了 `setup-media.ps1` PowerShell 脚本
   - 自动创建符号链接，连接实际文件到 public/media 目录
   - 提供了 `setup-media.bat` 批处理文件方便执行

### 技术改进

- 改进了答案类型判断逻辑（text/boolean/radio）
- 优化了单选题的 UI 显示，正确/错误答案有颜色区分
- 增强了错误处理和日志输出
- 更新了 Vite 配置以支持项目根目录文件访问

### 文档更新

- 添加了 `MEDIA_SETUP.md` 媒体文件设置指南
- 添加了 `README_MEDIA.md` 媒体文件访问方案说明
- 更新了代码注释

