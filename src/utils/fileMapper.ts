import { mediaFileMapping } from '../config/mediaConfig';

/**
 * 将考卷中的音频路径转换为实际文件路径
 * 例如: theme1/task10_dialog.mp3 -> 实际的文件路径
 */
export function mapAudioPath(audioPath: string): string {
  // 如果路径已经是完整路径或以 / 开头，直接返回
  if (audioPath.startsWith('/') || audioPath.startsWith('http')) {
    return audioPath;
  }

  // 先查找映射表中的精确匹配
  if (mediaFileMapping[audioPath]) {
    // 返回实际文件路径，使用 encodeURIComponent 处理中文和特殊字符
    const mappedPath = mediaFileMapping[audioPath].replace(/\\/g, '/');
    // 编码路径中的每个部分，以正确处理中文和特殊字符
    const encodedPath = mappedPath.split('/').map(part => encodeURIComponent(part)).join('/');
    
    // 尝试两种路径：
    // 1. 直接访问（如果文件在项目根目录，且 Vite 配置允许）
    // 2. 通过 public/media 符号链接访问
    // 优先使用符号链接路径（如果存在）
    const linkPath = `/media/${encodedPath}`;
    return linkPath;
  }

  // 如果没有精确匹配，尝试使用原路径（需要文件存在于 public/media 目录）
  // 或者返回一个占位路径，提示用户需要添加映射
  console.warn(`未找到音频文件映射: ${audioPath}，请检查 mediaConfig.ts`);
  // 尝试直接使用路径，假设文件已通过符号链接放在 public/media 下
  return `/media/${audioPath}`;
}

/**
 * 判断文件是否为视频文件
 */
export function isVideoFile(filePath: string): boolean {
  return /\.(mp4|webm|ogg|mov)$/i.test(filePath);
}

