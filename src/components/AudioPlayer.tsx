interface AudioPlayerProps {
  src: string;
  label?: string;
}

export default function AudioPlayer({ src, label }: AudioPlayerProps) {
  return (
    <div className="my-4 p-3 bg-gray-50 rounded border border-gray-200">
      {label && (
        <p className="text-sm text-gray-500 mb-1">{label}</p>
      )}
      <audio controls src={`/audio/${src}`} className="w-full" />
    </div>
  );
}

