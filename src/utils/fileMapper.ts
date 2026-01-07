import { mediaFileMapping } from '../config/mediaConfig';

// 媒体文件索引（文件名 -> 实际路径），由构建脚本生成
let mediaIndex: Record<string, string> | null = null;

/**
 * 加载媒体文件索引
 */
async function loadMediaIndex(): Promise<Record<string, string>> {
  if (mediaIndex !== null) {
    return mediaIndex;
  }

  try {
    const basePath = import.meta.env.BASE_URL || '';
    const response = await fetch(`${basePath}media-index.json`);
    if (response.ok) {
      mediaIndex = await response.json();
      return mediaIndex!;
    }
  } catch (error) {
    console.warn('Failed to load media index:', error);
  }

  // 如果加载失败，返回空对象
  mediaIndex = {};
  return mediaIndex;
}

/**
 * 从路径中提取文件名
 * 例如：[007] Тема 7...\Тема 7-1-10.mp3 -> Тема 7-1-10.mp3
 */
function extractFileName(path: string): string {
  // 统一使用正斜杠
  const normalized = path.replace(/\\/g, '/');
  // 获取最后一个路径段（文件名）
  const parts = normalized.split('/').filter(part => part.length > 0);
  return parts[parts.length - 1] || path;
}

/**
 * 将考卷中的音频路径转换为实际文件路径
 * 
 * 策略：从路径中提取文件名，然后在媒体索引中查找实际路径
 * 例如：[007] Тема 7...\Тема 7-1-10.mp3 -> 查找 Тема 7-1-10.mp3 的实际路径
 */
export async function mapAudioPath(audioPath: string): Promise<string> {
  // 如果路径已经是完整URL，直接返回
  if (audioPath.startsWith('http://') || audioPath.startsWith('https://')) {
    return audioPath;
  }

  // 如果路径已经是绝对路径（以 / 开头），可能需要加上 basePath
  if (audioPath.startsWith('/')) {
    const basePath = import.meta.env.BASE_URL || '';
    if (audioPath.startsWith(basePath)) {
      return audioPath;
    }
    return `${basePath}${audioPath.slice(1)}`;
  }

  // 从路径中提取文件名
  const fileName = extractFileName(audioPath);
  
  // 加载媒体索引
  const index = await loadMediaIndex();
  
  // 在索引中查找文件名
  if (index[fileName]) {
    const actualPath = index[fileName];
    // 将路径规范化并编码
    const normalizedPath = actualPath.replace(/\\/g, '/');
    const pathParts = normalizedPath.split('/').filter(part => part.length > 0);
    const encodedParts = pathParts.map(part => encodeURIComponent(part));
    const encodedPath = encodedParts.join('/');
    
    const basePath = import.meta.env.BASE_URL || '';
    return `${basePath}media/${encodedPath}`;
  }

  // 如果索引中没有，回退到旧逻辑
  if (mediaFileMapping[audioPath]) {
    const mappedPath = mediaFileMapping[audioPath].trim().replace(/\\/g, '/').replace(/\/+$/, '');
    const pathParts = mappedPath.split('/').filter(part => part.length > 0);
    const encodedParts = pathParts.map(part => encodeURIComponent(part));
    const encodedPath = encodedParts.join('/');
    
    const basePath = import.meta.env.BASE_URL || '';
    return `${basePath}media/${encodedPath}`;
  }

  // 最后的回退：使用文件名尝试直接路径
  console.warn(`Media file not found in index: ${fileName}, trying direct path`);
  const basePath = import.meta.env.BASE_URL || '';
  const encodedFileName = encodeURIComponent(fileName);
  return `${basePath}media/${encodedFileName}`;
}

/**
 * 判断文件是否为视频文件
 */
export function isVideoFile(filePath: string): boolean {
  return /\.(mp4|webm|ogg|mov)$/i.test(filePath);
}

