# 项目设置指南

## 安装步骤

1. **安装依赖**
```bash
npm install
```

2. **准备音频文件**
   - 将所有音频文件（.mp3, .mp4）复制到 `public/audio/` 目录
   - 可以按主题分类组织，例如：
     - `public/audio/theme1/xxx.mp3`
     - `public/audio/theme2/xxx.mp3`

3. **准备考卷文件**
   - 在 `public/exams/` 目录下创建 Markdown 格式的考卷文件
   - 文件命名格式：`paper_01.md`, `paper_02.md`, ...
   - 参考 `public/exams/paper_01.md` 的格式

## 开发

```bash
npm run dev
```

访问 http://localhost:5173

## 构建

```bash
npm run build
```

构建产物在 `dist` 目录。

## 考卷 Markdown 格式说明

### 基本语法

1. **音频标签**
```markdown
[[AUDIO: theme1/audio_file.mp3]]
```

2. **文本输入框**
```markdown
[[INPUT: question_id]]
```

3. **判断题（对/错）**
```markdown
[[RADIO: question_id]]
```

4. **答案区**
```markdown
---ANSWERS---
{"id": "question_id", "answer": "正确答案", "type": "text"}
{"id": "question_id", "answer": "True", "type": "boolean"}
```

### 示例

完整示例请参考 `public/exams/paper_01.md`

