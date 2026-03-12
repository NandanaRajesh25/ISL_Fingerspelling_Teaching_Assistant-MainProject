import { X, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

interface SignViewerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "word" | "letters";
  // for word mode
  word: string;
  wordVideo: string | null;
  // for letter mode
  letters: string[];
  letterVideos: string[];
}

const SignViewer = ({
  isOpen,
  onClose,
  mode,
  word,
  wordVideo,
  letters,
  letterVideos
}: SignViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoKey, setVideoKey] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
    setVideoKey(prev => prev + 1);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentIndex < letterVideos.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleReplay = () => {
    if (mode === "word") {
      setVideoKey(prev => prev + 1);
    } else {
      setCurrentIndex(0);
      setVideoKey(prev => prev + 1);
    }
  };

  const videoSrc = mode === "word" ? wordVideo : letterVideos[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm">
      <div className="bg-card rounded-xl border border-border shadow-lift w-full max-w-sm animate-pop-in max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              {mode === "word" ? "Sign Language" : `Letter ${currentIndex + 1} of ${letters.length}`}
            </p>
            <h3 className="text-sm font-bold text-foreground leading-tight">
              {mode === "word"
                ? `Sign for "${word}"`
                : `Letter: ${letters[currentIndex]}`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors text-muted-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Video */}
        <div className="aspect-video bg-black flex items-center justify-center flex-shrink-0 overflow-hidden">
          {videoSrc ? (
            <video
              key={`${videoSrc}-${videoKey}`}
              src={videoSrc}
              autoPlay
              controls={false}
              className="w-full h-full object-contain"
            />
          ) : (
            <p className="text-muted-foreground text-xs">No sign video available</p>
          )}
        </div>

        {/* Letter navigation chips */}
        {mode === "letters" && letterVideos.length > 1 && (
          <div className="flex items-center justify-center gap-2 px-4 py-2.5 border-t border-border flex-shrink-0 bg-muted/30">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-7 h-7 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-1 flex-wrap justify-center">
              {letters.map((letter, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs transition-colors
                    ${idx === currentIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }
                  `}
                >
                  {letter}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex === letterVideos.length - 1}
              className="w-7 h-7 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex gap-2 p-3 border-t border-border flex-shrink-0">
          <Button
            onClick={handleReplay}
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs font-semibold rounded-lg gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Replay
          </Button>

          <Button
            onClick={onClose}
            size="sm"
            className="flex-1 h-8 text-xs font-semibold rounded-lg gap-1.5 bg-success hover:bg-success/90 text-success-foreground"
          >
            Got it!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignViewer;
