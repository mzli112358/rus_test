# 老师发的消息：
视听说期末考试的题型:1.请听这些消息和问题。从四个选项中选择一个正确的答案在答题卡上将对应的字母涂掉。(2%x15=30%)(单选题)1.请听这些消息，然后判断这些陈述是否与消息内容相符。在答题卡上用“√”或“x”来表示你的答案。(1%x10=10%)(判断题)
小. 请听这些问题，然后写出你的答案。(3%x10=30%)(听问题并回答问题)I.请听这段文字，然后回答相关问题。(5%x6=30%)(听短文回答问题)
注意事项:每段材料都会播放两遍2.考试范围:第1至第5课中听过的所有材料。

# 老师说的：
考原题，还是一模一样的听力，问题和答案

# 我是技术人员，从老师教学，和学生应试备考的角度，能做什么，一个交互网页？



以下是为你定制的**“Markdown 驱动”式俄语备考网页架构方案**。

---

### 1. 核心协议：考卷 Markdown 格式约定

为了让你的网页能“读懂”哪里该放音频、哪里该放输入框、哪里是答案，我们需要约定一套简单的**标签语法**。

等会儿我生成考卷时，就会严格遵守这个格式：

```markdown
# 俄语视听说期末模拟卷 - 第 1 套

## 第一部分：听短文回答问题 (30%)

1. 请听录音，回答下列问题。

[[AUDIO: theme1/viktor_dialog.mp3]]

Q1: Виктор и Андрей не виделись... (Viktor和Andrey多久没见？)
[[INPUT: q1_1]]

Q2: Где работает Виктор?
[[INPUT: q1_2]]

---

## 第二部分：判断题 (10%)

2. 请听录音，判断正误。

[[AUDIO: theme2/guest_rules.mp3]]

Q3: 古时候人们就互相串门。
[[RADIO: q2_1]]

---
(分隔符，下面是答案区，学生平时看不见，点击“批改”后读取)
---ANSWERS---
{"id": "q1_1", "answer": "очень давно", "type": "text"}
{"id": "q1_2", "answer": "В крупной компании", "type": "text"}
{"id": "q2_1", "answer": "True", "type": "boolean"}
```

---

### 2. 项目文件结构树

基于 React + Vite，结构非常扁平：

```text
russian-exam-lite/
├── public/
│   ├── exams/              # 存放 AI 生成的考卷 MD 文件
│   │   ├── paper_01.md
│   │   ├── paper_02.md
│   │   └── ...
│   └── audio/              # 存放音频文件 (你需要按这个整理好文件名)
│       ├── theme1/
│       │   ├── viktor_dialog.mp3
│       │   └── ...
│       ├── theme2/
│       └── ...
├── src/
│   ├── components/
│   │   ├── ExamRenderer.tsx  # 【核心】解析 MD，渲染音频和题目
│   │   ├── AudioPlayer.tsx   # 封装好的播放器
│   │   └── ResultCard.tsx    # 批改后的结果展示
│   ├── App.tsx               # 首页，选择考卷列表
│   └── main.tsx
└── package.json
```

---

### 3. 核心代码逻辑实现

只要写好 `ExamRenderer`，这事就成了。

#### 第一步：安装依赖
你需要安装 Tailwind (写样式) 和 一个轻量级的 ID 生成库 (可选)。
`npm install clsx tailwind-merge`

#### 第二步：`App.tsx` (考卷选择器)

```tsx
import { useState } from 'react';
import ExamRenderer from './components/ExamRenderer';

const PAPER_COUNT = 20; // 假设我们生成了20套

export default function App() {
  const [currentPaper, setCurrentPaper] = useState<number | null>(null);

  if (currentPaper) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <button 
          onClick={() => setCurrentPaper(null)}
          className="mb-4 text-blue-500 hover:underline"
        >
          ← 返回考卷列表
        </button>
        {/* 这里传入考卷文件名 */}
        <ExamRenderer paperId={`paper_${String(currentPaper).padStart(2, '0')}`} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">俄语视听说·期末突击训练</h1>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: PAPER_COUNT }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPaper(i + 1)}
            className="p-4 bg-white border-2 border-blue-100 hover:border-blue-500 rounded-lg shadow-sm transition"
          >
            第 {i + 1} 套
          </button>
        ))}
      </div>
    </div>
  );
}
```

#### 第三步：`ExamRenderer.tsx` (解析引擎)

这是最关键的部分，它把 `[[AUDIO]]` 变成播放器，把 `[[INPUT]]` 变成输入框。

```tsx
import { useEffect, useState } from 'react';

// 用简单的正则切分内容
const REGEX = /(\[\[AUDIO:.*?\]\]|\[\[INPUT:.*?\]\]|\[\[RADIO:.*?\]\])/g;

export default function ExamRenderer({ paperId }: { paperId: string }) {
  const [content, setContent] = useState('');
  const [answers, setAnswers] = useState<any>({}); // 存放标准答案
  const [userInputs, setUserInputs] = useState<any>({}); // 存放学生输入
  const [isGraded, setIsGraded] = useState(false); // 是否已批改

  // 1. 加载 Markdown 文件
  useEffect(() => {
    fetch(`/exams/${paperId}.md`)
      .then(res => res.text())
      .then(text => {
        // 分离 题目 和 答案
        const [examPart, answerPart] = text.split('---ANSWERS---');
        setContent(examPart);
        
        // 解析答案 JSON 行
        const ansObj: any = {};
        if (answerPart) {
          answerPart.trim().split('\n').forEach(line => {
            if(!line.trim()) return;
            try {
              const item = JSON.parse(line);
              ansObj[item.id] = item;
            } catch (e) {}
          });
        }
        setAnswers(ansObj);
        // 重置状态
        setUserInputs({});
        setIsGraded(false);
      });
  }, [paperId]);

  // 2. 渲染逻辑
  const renderContent = () => {
    // 按照正则切分字符串
    const parts = content.split(REGEX);

    return parts.map((part, index) => {
      // 渲染音频
      if (part.startsWith('[[AUDIO:')) {
        const src = part.match(/\[\[AUDIO:(.*?)\]\]/)?.[1].trim();
        return (
          <div key={index} className="my-4 p-3 bg-gray-50 rounded border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">音频: {src}</p>
            <audio controls src={`/audio/${src}`} className="w-full" />
          </div>
        );
      }

      // 渲染填空输入框
      if (part.startsWith('[[INPUT:')) {
        const id = part.match(/\[\[INPUT:(.*?)\]\]/)?.[1].trim();
        if (!id) return null;
        const correct = answers[id]?.answer;
        
        return (
          <div key={index} className="my-2">
            <input
              type="text"
              className={`w-full p-2 border rounded ${
                isGraded 
                  ? (userInputs[id] === correct ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50')
                  : 'border-gray-300'
              }`}
              placeholder="请输入俄语答案..."
              value={userInputs[id] || ''}
              onChange={(e) => setUserInputs({ ...userInputs, [id]: e.target.value })}
              disabled={isGraded}
            />
            {isGraded && userInputs[id] !== correct && (
              <p className="text-sm text-red-600 mt-1">
                正确答案: <span className="font-bold">{correct}</span>
              </p>
            )}
          </div>
        );
      }

      // 渲染判断题/单选 (简化为Yes/No)
      if (part.startsWith('[[RADIO:')) {
        const id = part.match(/\[\[RADIO:(.*?)\]\]/)?.[1].trim();
        if (!id) return null;
        const correctStr = answers[id]?.answer; // "True" or "False"

        return (
           <div key={index} className="my-2 flex gap-4">
              {['True', 'False'].map(val => (
                 <label key={val} className="flex items-center gap-2 cursor-pointer">
                    <input 
                       type="radio" 
                       name={id} 
                       checked={userInputs[id] === val}
                       onChange={() => setUserInputs({...userInputs, [id]: val})}
                       disabled={isGraded}
                    />
                    {val === 'True' ? '对 (Да)' : '错 (Нет)'}
                 </label>
              ))}
              {isGraded && userInputs[id] !== correctStr && (
                  <span className="text-red-500 text-sm">❌ (应选 {correctStr === 'True' ? 'Да' : 'Нет'})</span>
              )}
           </div>
        )
      }

      // 普通文本 (支持 Markdown 标题换行)
      return (
        <div key={index} 
             className="prose prose-slate max-w-none" 
             dangerouslySetInnerHTML={{ 
               // 简单的把换行转br，或者用 react-markdown 库渲染这一小段
               __html: part.replace(/\n/g, '<br/>').replace(/# (.*)/g, '<h1 class="text-2xl font-bold my-4">$1</h1>') 
             }} 
        />
      );
    });
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 min-h-screen">
      {renderContent()}
      
      <div className="mt-8 pt-4 border-t border-gray-200">
        {!isGraded ? (
          <button 
            onClick={() => setIsGraded(true)}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
          >
            提交并批改
          </button>
        ) : (
          <div className="text-center p-4 bg-gray-50 rounded">
            <p className="font-bold text-lg mb-2">批改完成！</p>
            <button 
              onClick={() => { setIsGraded(false); setUserInputs({}); }}
              className="text-blue-500 underline"
            >
              重做本卷
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### 4. 项目已创建完成！

项目结构已按照方案建立完成，包括：
- ✅ React + Vite + TypeScript 项目配置
- ✅ Tailwind CSS 样式系统
- ✅ 核心组件（App.tsx, ExamRenderer.tsx）
- ✅ 辅助组件（AudioPlayer.tsx, ResultCard.tsx）
- ✅ 示例考卷文件

### 5. 使用步骤

**⚠️ 重要：首次使用前必须先安装 Node.js**

- 如果未安装 Node.js，请查看 `QUICKSTART.md` 文件了解详细安装步骤
- 或直接双击 `start.bat` 文件，它会自动检测并提示

1. **安装依赖**：
```bash
npm install
```

或者直接运行：
```bash
start.bat
```

2. **准备音频文件**：
   - 将所有音频文件（.mp3, .mp4）复制到 `public/audio/` 目录
   - 可以按主题分类组织，例如：
     - `public/audio/theme1/xxx.mp3`
     - `public/audio/theme2/xxx.mp3`

3. **准备考卷文件**：
   - 参考 `public/exams/paper_01.md` 的格式
   - 创建更多考卷文件：`paper_02.md`, `paper_03.md`, ...

4. **启动开发服务器**：
```bash
npm run dev
```
访问 http://localhost:5173

5. **生成考卷**：
   - 只需要生成 Markdown 格式的考卷内容
   - 保存为 `public/exams/paper_XX.md`

6. **构建发布**：
```bash
npm run build
```
构建产物在 `dist` 目录，可以部署到服务器或 GitHub Pages。

更多详细信息请查看 `SETUP.md` 文件。

