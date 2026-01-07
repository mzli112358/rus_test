import { useState } from 'react';
import ExamRenderer from './components/ExamRenderer';

const PAPER_COUNT = 20; // 假设我们生成了20套

export default function App() {
  const [currentPaper, setCurrentPaper] = useState<number | null>(null);

  if (currentPaper) {
    return (
      <div className="max-w-4xl mx-auto p-4">
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
    <div className="max-w-4xl mx-auto p-8">
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

