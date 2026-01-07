import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mediaDir = path.resolve(__dirname, '../public/media');
const outputFile = path.resolve(__dirname, '../public/media-index.json');

/**
 * 递归扫描目录，生成文件名到路径的映射
 * 文件名格式：Тема 7-1-10.mp3 -> 实际路径
 */
function scanDirectory(dir, relativePath = '') {
  const mapping = {};
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativeFilePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      // 递归扫描子目录
      const subMapping = scanDirectory(fullPath, relativeFilePath);
      Object.assign(mapping, subMapping);
    } else if (entry.isFile()) {
      // 只处理音频和视频文件
      const ext = path.extname(entry.name).toLowerCase();
      if (['.mp3', '.mp4', '.webm', '.ogg', '.mov'].includes(ext)) {
        // 使用文件名为key（不包含路径）
        const fileName = entry.name;
        // 存储相对于 media 目录的路径
        const relativeFromMedia = relativeFilePath.replace(/\\/g, '/');
        mapping[fileName] = relativeFromMedia;
      }
    }
  }

  return mapping;
}

try {
  console.log('Scanning media directory...');
  const mapping = scanDirectory(mediaDir);
  
  console.log(`Found ${Object.keys(mapping).length} media files`);
  console.log('Sample mappings:');
  Object.entries(mapping).slice(0, 5).forEach(([filename, filepath]) => {
    console.log(`  ${filename} -> ${filepath}`);
  });

  // 写入JSON文件
  fs.writeFileSync(outputFile, JSON.stringify(mapping, null, 2), 'utf-8');
  console.log(`\nMedia index written to: ${outputFile}`);
} catch (error) {
  console.error('Error generating media index:', error);
  process.exit(1);
}

