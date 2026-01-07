import { useEffect, useState } from 'react';
import { mapAudioPath, isVideoFile } from '../utils/fileMapper';

// 用简单的正则切分内容
const REGEX = /(\[\[AUDIO:.*?\]\]|\[\[INPUT:.*?\]\]|\[\[RADIO:.*?\]\])/g;

interface AnswerItem {
  id: string;
  answer: string;
  type: 'text' | 'boolean' | 'radio';
}

export default function ExamRenderer({ paperId }: { paperId: string }) {
  const [content, setContent] = useState('');
  const [answers, setAnswers] = useState<Record<string, AnswerItem>>({}); // 存放标准答案
  const [userInputs, setUserInputs] = useState<Record<string, string>>({}); // 存放学生输入
  const [isGraded, setIsGraded] = useState(false); // 是否已批改
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. 加载 Markdown 文件
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/exams/${paperId}.md`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`无法加载考卷: ${paperId}.md`);
        }
        return res.text();
      })
      .then(text => {
        // 分离 题目 和 答案
        const [examPart, answerPart] = text.split('---ANSWERS---');
        setContent(examPart);
        
        // 解析答案 JSON 行
        const ansObj: Record<string, AnswerItem> = {};
        if (answerPart) {
          answerPart.trim().split('\n').forEach(line => {
            if(!line.trim()) return;
            try {
              const item = JSON.parse(line) as AnswerItem;
              ansObj[item.id] = item;
            } catch (e) {
              console.warn('解析答案行失败:', line);
            }
          });
        }
        setAnswers(ansObj);
        // 重置状态
        setUserInputs({});
        setIsGraded(false);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [paperId]);

  // 2. 渲染逻辑
  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-8">加载中...</div>;
    }

    if (error) {
      return (
        <div className="text-center py-8 text-red-600">
          <p className="mb-4">{error}</p>
          <p className="text-sm text-gray-500">请确保考卷文件存在: /exams/{paperId}.md</p>
        </div>
      );
    }

    // 按照正则切分字符串
    const parts = content.split(REGEX);

    return parts.map((part, index) => {
      // 渲染音频/视频
      if (part.startsWith('[[AUDIO:')) {
        const src = part.match(/\[\[AUDIO:(.*?)\]\]/)?.[1].trim();
        const actualPath = mapAudioPath(src);
        const isVideo = isVideoFile(src);

        return (
          <div key={index} className="my-4 p-3 bg-gray-50 rounded border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">
              {isVideo ? '视频' : '音频'}: {src}
            </p>
            {isVideo ? (
              <div className="space-y-2">
                <video controls src={actualPath} className="w-full rounded" />
                <audio controls src={actualPath} className="w-full" />
                <p className="text-xs text-gray-400">提示：上方为视频播放器，下方为纯音频播放器</p>
              </div>
            ) : (
              <audio controls src={actualPath} className="w-full" />
            )}
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
                  ? (userInputs[id]?.trim() === correct?.trim() 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-red-500 bg-red-50')
                  : 'border-gray-300'
              }`}
              placeholder="请输入俄语答案..."
              value={userInputs[id] || ''}
              onChange={(e) => setUserInputs({ ...userInputs, [id]: e.target.value })}
              disabled={isGraded}
            />
            {isGraded && userInputs[id]?.trim() !== correct?.trim() && (
              <p className="text-sm text-red-600 mt-1">
                正确答案: <span className="font-bold">{correct}</span>
              </p>
            )}
          </div>
        );
      }

      // 渲染判断题/单选题
      if (part.startsWith('[[RADIO:')) {
        const id = part.match(/\[\[RADIO:(.*?)\]\]/)?.[1].trim();
        if (!id) return null;
        const answerItem = answers[id];
        const correctStr = answerItem?.answer;
        const answerType = answerItem?.type;

        // 判断是判断题（True/False）还是单选题（A/B/C/D）
        const isBoolean = answerType === 'boolean' || (correctStr && (correctStr === 'True' || correctStr === 'False'));
        
        if (isBoolean) {
          // 判断题：True/False
          return (
            <div key={index} className="my-2 flex gap-4 items-center">
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
              {isGraded && userInputs[id] === correctStr && (
                <span className="text-green-500 text-sm">✓ 正确</span>
              )}
            </div>
          );
        } else {
          // 单选题：A/B/C/D
          const options = ['A', 'B', 'C', 'D'];
          return (
            <div key={index} className="my-2">
              <div className="flex gap-4 flex-wrap items-center">
                {options.map(val => (
                  <label key={val} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name={id} 
                      value={val}
                      checked={userInputs[id] === val}
                      onChange={() => setUserInputs({...userInputs, [id]: val})}
                      disabled={isGraded}
                      className="w-4 h-4"
                    />
                    <span className={isGraded && userInputs[id] === val && val === correctStr ? 'text-green-600 font-bold' : 
                                     isGraded && userInputs[id] === val && val !== correctStr ? 'text-red-600 font-bold' :
                                     isGraded && val === correctStr && userInputs[id] !== correctStr ? 'text-green-600 font-bold' :
                                     ''}>
                      {val}
                    </span>
                  </label>
                ))}
              </div>
              {isGraded && userInputs[id] !== correctStr && (
                <p className="text-sm text-red-600 mt-2">
                  你的答案: <span className="font-bold">{userInputs[id] || '(未作答)'}</span> | 
                  正确答案: <span className="font-bold">{correctStr}</span>
                </p>
              )}
              {isGraded && userInputs[id] === correctStr && (
                <p className="text-sm text-green-600 mt-2">✓ 回答正确</p>
              )}
            </div>
          );
        }
      }

      // 普通文本 (支持 Markdown 标题换行)
      const processedText = part
        .replace(/^### (.*)$/gm, '<h3 class="text-xl font-bold my-3">$1</h3>')
        .replace(/^## (.*)$/gm, '<h2 class="text-2xl font-bold my-4">$1</h2>')
        .replace(/^# (.*)$/gm, '<h1 class="text-3xl font-bold my-4">$1</h1>')
        .replace(/\n/g, '<br/>');
      
      return (
        <div 
          key={index} 
          className="prose prose-slate max-w-none" 
          dangerouslySetInnerHTML={{ __html: processedText }} 
        />
      );
    });
  };

  // 计算得分
  const calculateScore = () => {
    let correct = 0;
    let total = 0;
    
    Object.keys(answers).forEach(id => {
      total++;
      if (userInputs[id]?.trim() === answers[id]?.answer?.trim()) {
        correct++;
      }
    });
    
    return { correct, total, percentage: total > 0 ? Math.round((correct / total) * 100) : 0 };
  };

  const score = isGraded ? calculateScore() : null;

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
            {score && (
              <p className="text-xl mb-2">
                得分: <span className="text-blue-600">{score.correct}</span> / {score.total} 
                <span className="ml-2 text-gray-600">({score.percentage}%)</span>
              </p>
            )}
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

