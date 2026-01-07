import { mediaFileMapping } from '../config/mediaConfig';

/**
 * 将考卷中的音频路径转换为实际文件路径
 * 支持两种格式：
 * 1. 完整路径：`[001] Тема 1...\文件名.mp3`
 * 2. 简化路径：`theme1/task10_dialog.mp3`
 */
/**
 * 将考卷中的音频路径转换为实际文件路径
 * 路径格式示例：[007] Тема 7 Все профессии важны!\[001] Тема 7-1 Задание 1-18\[010] Тема 7-1-10 Задание 10\Тема 7-1-10.mp3
 * 对应文件位置：public/media/[007] Тема 7 Все профессии важны!/[001] Тема 7-1 Задание 1-18/[010] Тема 7-1-10 Задание 10/Тема 7-1-10.mp3
 */
export function mapAudioPath(audioPath: string): string {
  // 如果路径已经是完整URL，直接返回
  if (audioPath.startsWith('http://') || audioPath.startsWith('https://')) {
    return audioPath;
  }

  // 如果路径已经是绝对路径（以 / 开头），可能需要加上 basePath
  if (audioPath.startsWith('/')) {
    const basePath = import.meta.env.BASE_URL || '';
    // 如果已经包含 basePath，直接返回
    if (audioPath.startsWith(basePath)) {
      return audioPath;
    }
    // 否则加上 basePath
    return `${basePath}${audioPath.slice(1)}`;
  }

  // 规范化路径：统一使用正斜杠，去除末尾的斜杠和空格
  let normalizedPath = audioPath.trim().replace(/\\/g, '/').replace(/\/+$/, '');
  
  // 检查是否是完整路径格式（包含 [001] 等文件夹名）
  if (normalizedPath.includes('[')) {
    // 这是完整路径格式，直接映射到 media/ 目录
    // 按照路径结构：[007]\[001]\[010]\文件名.mp3 -> media/[007]/[001]/[010]/文件名.mp3
    const pathParts = normalizedPath.split('/').filter(part => part.length > 0);
    // 对每个路径段进行 URL 编码，保留路径结构
    const encodedParts = pathParts.map(part => encodeURIComponent(part));
    const encodedPath = encodedParts.join('/');
    
    const basePath = import.meta.env.BASE_URL || '';
    return `${basePath}media/${encodedPath}`;
  }

  // 先查找映射表中的精确匹配（旧格式：theme1/task10_dialog.mp3）
  if (mediaFileMapping[audioPath]) {
    const mappedPath = mediaFileMapping[audioPath].trim().replace(/\\/g, '/').replace(/\/+$/, '');
    const pathParts = mappedPath.split('/').filter(part => part.length > 0);
    const encodedParts = pathParts.map(part => encodeURIComponent(part));
    const encodedPath = encodedParts.join('/');
    
    const basePath = import.meta.env.BASE_URL || '';
    return `${basePath}media/${encodedPath}`;
  }

  // 如果没有精确匹配，尝试直接使用原路径
  console.warn(`未找到音频文件映射: ${audioPath}，使用原始路径`);
  const pathParts = normalizedPath.split('/').filter(part => part.length > 0);
  const encodedParts = pathParts.map(part => encodeURIComponent(part));
  const encodedPath = encodedParts.join('/');
  
  const basePath = import.meta.env.BASE_URL || '';
  return `${basePath}media/${encodedPath}`;
}

/**
 * 判断文件是否为视频文件
 */
export function isVideoFile(filePath: string): boolean {
  return /\.(mp4|webm|ogg|mov)$/i.test(filePath);
}

