import { Check, RefreshCw, Eye, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { SpellingResult } from '@/hooks/useWordBuilder';

interface ResultDisplayProps {
  result: SpellingResult;
  currentWord: string;
  correctedWords: string[];
  onTryAgain: () => void;
  onShowSign: () => void;
  onShowCorrectedSigns: (word: string) => void;
  isTestMode?: boolean;
  onNextWord?: () => void;
}

const ResultDisplay = ({
  result,
  currentWord,
  correctedWords,
  onTryAgain,
  onShowSign,
  onShowCorrectedSigns,
  isTestMode = false,
  onNextWord
}: ResultDisplayProps) => {
  if (result === 'pending') return null;

  const isCorrect = result === 'correct';

  return (
    <div
      className={`
        rounded-xl border shadow-card animate-slide-up overflow-hidden flex-shrink-0
        ${isCorrect
          ? 'border-success/30 bg-success/5'
          : 'border-warning/30 bg-warning/5'
        }
      `}
    >
      {/* Coloured top accent bar */}
      <div className={`h-1.5 w-full ${isCorrect ? 'bg-success' : 'bg-warning'}`} />

      <div className="p-4">
        {isCorrect ? (
          // ── Success State ──
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-success flex items-center justify-center flex-shrink-0 animate-celebrate shadow-success-glow">
              <Check className="w-6 h-6 text-success-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-success flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Amazing Job!
              </h3>
              <p className="text-sm text-foreground mt-1">
                You spelled <span className="font-bold text-success">"{currentWord}"</span> correctly!
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={onShowSign}
                  size="sm"
                  className="h-9 text-sm font-semibold rounded-lg gap-1.5 bg-primary hover:bg-primary/90 px-4"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Show Sign
                </Button>
                {isTestMode ? (
                  <Button
                    onClick={onNextWord}
                    size="sm"
                    className="h-9 text-sm font-semibold rounded-lg gap-1.5 bg-success hover:bg-success/90 px-4"
                  >
                    Next Word
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <Button
                    onClick={onTryAgain}
                    variant="outline"
                    size="sm"
                    className="h-9 text-sm font-semibold rounded-lg gap-1.5 px-4"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Try Another
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          // ── Correction State ──
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-warning flex items-center justify-center flex-shrink-0 animate-wiggle">
              <AlertCircle className="w-6 h-6 text-warning-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-warning">Almost There!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You spelled: <span className="font-semibold text-foreground">"{currentWord}"</span>
              </p>
              <p className="text-sm font-semibold text-foreground mt-0.5 mb-2">
                Did you mean:
              </p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {correctedWords.map((word) => (
                  <Button
                    key={word}
                    onClick={() => onShowCorrectedSigns(word)}
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs font-bold rounded-lg gap-1.5 border-primary/20 hover:bg-primary/10 hover:text-primary text-foreground"
                  >
                    <Eye className="w-3 h-3" />
                    {word}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-border/50">
                <Button
                  onClick={onTryAgain}
                  variant="outline"
                  size="sm"
                  className="h-9 text-sm font-semibold rounded-lg gap-1.5 px-4"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
