import { Check, Eraser, CornerDownLeft } from 'lucide-react';
import LetterBubble from './LetterBubble';
import { Button } from './ui/button';

interface WordBuilderProps {
  letters: string[];
  onClearWord: () => void;
  onCheckSpelling: () => void;
  onRemoveLetter: () => void;
  disabled?: boolean;
}

const WordBuilder = ({ 
  letters, 
  onClearWord, 
  onCheckSpelling,
  onRemoveLetter,
  disabled = false,
}: WordBuilderProps) => {
  return (
    <div className="flex flex-col gap-2.5 flex-shrink-0">
      {/* Word Display Card – fixed height so it never resizes when result appears */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden flex flex-col h-[340px]">
        {/* Section header */}
        <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">Word Builder</h2>
          {letters.length > 0 && (
            <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
              {letters.length} letter{letters.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Letter area – flex-1 fills the remaining card height */}
        <div className="flex-1 p-5 flex items-center justify-center overflow-auto">
          {letters.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                <span className="text-3xl">🖐️</span>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold">Sign letters to build a word</p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">Or use the test keyboard below</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5 justify-center items-center w-full">
              {letters.map((letter, index) => (
                <LetterBubble
                  key={`${letter}-${index}`}
                  letter={letter}
                  index={index}
                  showRemove={index === letters.length - 1}
                  onRemove={onRemoveLetter}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-shrink-0">
        <Button
          onClick={onRemoveLetter}
          disabled={letters.length === 0 || disabled}
          variant="outline"
          size="sm"
          className="flex-1 h-10 text-sm font-semibold rounded-lg gap-1.5 border-border"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
          Undo
        </Button>

        <Button
          onClick={onClearWord}
          disabled={letters.length === 0 || disabled}
          variant="outline"
          size="sm"
          className="flex-1 h-10 text-sm font-semibold rounded-lg gap-1.5 border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
        >
          <Eraser className="w-3.5 h-3.5" />
          Clear
        </Button>

        <Button
          onClick={onCheckSpelling}
          disabled={letters.length === 0 || disabled}
          size="sm"
          className="flex-1 h-10 text-sm font-semibold rounded-lg gap-1.5 bg-success hover:bg-success/90 text-success-foreground"
        >
          <Check className="w-3.5 h-3.5" />
          Check
        </Button>
      </div>
    </div>
  );
};

export default WordBuilder;
