import { Camera, Keyboard, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { DetectionStatus } from '@/hooks/useSignDetection';

interface CameraPanelProps {
  currentLetter: string | null;
  status: DetectionStatus;
  statusMessage: string;
  onSimulateDetection: (letter: string) => void;
  videoRef?: React.RefObject<HTMLVideoElement>;
  remainingTime?: number;
  stablePrediction?: string;
  stableCount?: number;
  isConnected?: boolean;
}

const CameraPanel = ({ 
  currentLetter, 
  status, 
  statusMessage, 
  onSimulateDetection,
  videoRef,
  remainingTime = 0,
  stablePrediction,
  stableCount = 0,
  isConnected = false
}: CameraPanelProps) => {
  const [showKeyboard, setShowKeyboard] = useState(false);

  const handleKeyPress = (letter: string) => {
    onSimulateDetection(letter);
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="flex flex-col gap-2.5">
      {/* Camera Feed Card */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        {/* Status bar */}
        <div className="flex items-center gap-2.5 px-3 py-2 border-b border-border bg-muted/40">
          <div
            className={`
              w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 font-bold text-sm
              ${currentLetter
                ? 'bg-primary text-primary-foreground shadow-glow animate-celebrate'
                : 'bg-muted text-muted-foreground'
              }
            `}
          >
            {currentLetter || '–'}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold truncate transition-colors ${status === 'detected' ? 'text-success' : 'text-foreground'}`}>
              {statusMessage}
            </p>
            {status === 'idle' && (
              <p className="text-[10px] text-muted-foreground leading-tight">Make a hand sign in front of the camera</p>
            )}
          </div>
          {remainingTime > 0 && (
            <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md flex-shrink-0">
              {remainingTime}s
            </span>
          )}
        </div>

        {/* Camera area */}
        <div className="relative bg-camera" style={{ aspectRatio: '4/3' }}>
          {videoRef ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* HUD overlay */}
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black/55 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-white flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span className="text-[11px] font-medium">{isConnected ? 'Connected' : 'Disconnected'}</span>
                  </div>
                  {stablePrediction && stablePrediction !== 'nothing' && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-white/70">Detecting:</span>
                      <span className="text-sm font-bold">{stablePrediction.toUpperCase()}</span>
                      <span className="text-[10px] text-white/60">({stableCount}/8)</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Camera className="w-6 h-6 text-white/30" />
              </div>
              <p className="text-xs font-medium text-white/40">Camera feed</p>
              <p className="text-[10px] text-white/25">Start camera to begin detection</p>
            </div>
          )}

          {status === 'detecting' && (
            <div className="absolute inset-0 border-2 border-primary rounded-xl animate-pulse-soft pointer-events-none" />
          )}
        </div>
      </div>

      {/* Test Keyboard */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <button
          onClick={() => setShowKeyboard(!showKeyboard)}
          className="w-full flex items-center justify-between px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <Keyboard className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Test Keyboard</span>
          </div>
          {showKeyboard ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showKeyboard && (
          <div className="px-2.5 pb-2.5 border-t border-border">
            <div className="grid grid-cols-9 gap-1 mt-2">
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleKeyPress(letter)}
                  className="
                    w-full aspect-square rounded-md
                    bg-muted text-foreground
                    font-bold text-xs
                    hover:bg-primary hover:text-primary-foreground
                    hover:scale-105 active:scale-95
                    transition-all duration-150
                  "
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraPanel;
