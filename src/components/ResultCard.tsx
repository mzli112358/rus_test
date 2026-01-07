interface ResultCardProps {
  correct: number;
  total: number;
  onRetry: () => void;
}

export default function ResultCard({ correct, total, onRetry }: ResultCardProps) {
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const isPass = percentage >= 60;

  return (
    <div className={`text-center p-6 rounded-lg ${
      isPass ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
    }`}>
      <p className={`font-bold text-2xl mb-2 ${isPass ? 'text-green-700' : 'text-red-700'}`}>
        {isPass ? '✓ 通过' : '✗ 未通过'}
      </p>
      <p className="text-xl mb-4">
        得分: <span className="font-bold">{correct}</span> / {total}
      </p>
      <p className="text-lg text-gray-600 mb-4">
        正确率: <span className="font-bold">{percentage}%</span>
      </p>
      <button 
        onClick={onRetry}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        重做本卷
      </button>
    </div>
  );
}

