import { X } from 'lucide-react';

interface LetterBubbleProps {
  letter: string;
  index: number;
  onRemove?: () => void;
  showRemove?: boolean;
}

const bubbleColors = [
  'bg-bubble-1 text-white',
  'bg-bubble-2 text-white',
  'bg-bubble-3 text-white',
  'bg-bubble-4 text-white',
  'bg-bubble-5 text-white',
];

const LetterBubble = ({ letter, index, onRemove, showRemove = false }: LetterBubbleProps) => {
  const colorClass = bubbleColors[index % bubbleColors.length];
  
  return (
    <div 
      className={`
        relative group
        w-14 h-14 md:w-16 md:h-16
        ${colorClass}
        rounded-xl
        flex items-center justify-center
        shadow-soft
        animate-pop-in
        transition-transform hover:scale-105
      `}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <span className="text-2xl md:text-3xl font-bold tracking-tight">
        {letter}
      </span>
      
      {showRemove && onRemove && (
        <button
          onClick={onRemove}
          className="
            absolute -top-1.5 -right-1.5
            w-5 h-5 rounded-full
            bg-destructive text-destructive-foreground
            flex items-center justify-center
            opacity-0 group-hover:opacity-100
            transition-opacity duration-150
            hover:scale-110
            shadow-sm
          "
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

export default LetterBubble;
