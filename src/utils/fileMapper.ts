import { mediaFileMapping } from '../config/mediaConfig';

/**
 * 将考卷中的音频路径转换为实际文件路径
 * 支持两种格式：
 * 1. 完整路径：`[001] Тема 1...\文件名.mp3`
 * 2. 简化路径：`theme1/task10_dialog.mp3`
 */
export function mapAudioPath(audioPath: string): string {
  // 如果路径已经是完整路径或以 / 开头，直接返回
  if (audioPath.startsWith('/') || audioPath.startsWith('http')) {
    return audioPath;
  }

  // 检查是否是完整路径格式（包含 [001] 等文件夹名）
  if (audioPath.includes('[') && audioPath.includes('\\')) {
    // 这是完整路径格式，需要编码处理
    const normalizedPath = audioPath.replace(/\\/g, '/');
    // 编码路径中的每个部分，以正确处理中文和特殊字符
    const encodedPath = normalizedPath.split('/').map(part => encodeURIComponent(part)).join('/');
    // 使用 basePath + 编码后的路径
    const basePath = import.meta.env.BASE_URL || '';
    return `${basePath}${encodedPath}`;
  }

  // 先查找映射表中的精确匹配（旧格式：theme1/task10_dialog.mp3）
  if (mediaFileMapping[audioPath]) {
    const mappedPath = mediaFileMapping[audioPath].replace(/\\/g, '/');
    const encodedPath = mappedPath.split('/').map(part => encodeURIComponent(part)).join('/');
    const basePath = import.meta.env.BASE_URL || '';
    return `${basePath}${encodedPath}`;
  }

  // 如果没有精确匹配，尝试直接使用原路径（假设文件已存在于 public 目录）
  console.warn(`未找到音频文件映射: ${audioPath}，使用原始路径`);
  const basePath = import.meta.env.BASE_URL || '';
  const encodedPath = audioPath.split('/').map(part => encodeURIComponent(part)).join('/');
  return `${basePath}${encodedPath}`;
}

/**
 * 判断文件是否为视频文件
 */
export function isVideoFile(filePath: string): boolean {
  return /\.(mp4|webm|ogg|mov)$/i.test(filePath);
}

