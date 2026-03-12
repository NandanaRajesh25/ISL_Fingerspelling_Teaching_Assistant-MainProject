import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trophy, Star, RefreshCw, Hand, Gamepad2, ArrowRight } from 'lucide-react';
import CameraPanel from '@/components/CameraPanel';
import WordBuilder from '@/components/WordBuilder';
import ResultDisplay from '@/components/ResultDisplay';
import SignViewer from '@/components/SignViewer';
import { Button } from '@/components/ui/button';
import { useSignDetection } from '@/hooks/useSignDetection';
import { useWordBuilder } from '@/hooks/useWordBuilder';
import { useTestSession } from '@/hooks/useTestSession';

const Index = () => {
  const {
    currentLetter,
    status,
    statusMessage,
    simulateDetection,
    clearDetection,
    videoRef,
    remainingTime,
    stablePrediction,
    stableCount,
    isConnected,
    startDetection,
    stopDetection
  } = useSignDetection();
  
  const {
    letters,
    currentWord,
    result,
    suggestedWords,
    wordVideo,
    letterVideos,
    addLetter,
    removeLetter,
    clearWord,
    checkSpelling,
    acceptCorrection,
    resetResult
  } = useWordBuilder();

  const testSession = useTestSession();

  const [signViewerOpen, setSignViewerOpen] = useState(false);
  const [signViewerMode, setSignViewerMode] = useState<'word' | 'letters'>('word');

  // Add detected letter to word builder
  useEffect(() => {
    if (status === 'detected' && currentLetter) {
      if (currentLetter === 'DEL') {
        removeLetter();
      } else {
        addLetter(currentLetter);
      }
      const timer = setTimeout(() => {
        clearDetection();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [status, currentLetter, addLetter, removeLetter, clearDetection]);

  const handleCheckSpelling = () => {
    checkSpelling(); // In both modes, we just check against the dictionary
  };

  // Run whenever `result` changes to track points during a test
  useEffect(() => {
    if (testSession.isActive && result !== 'pending') {
      testSession.recordAttempt(result === 'correct');
    }
  }, [result, testSession.isActive]);

  const handleNextWord = () => {
    clearWord();
    resetResult();
    clearDetection();
    testSession.nextWord();
  };

  const handleTryAgain = () => {
    clearWord();
    resetResult();
    clearDetection();
  };

  const handleShowSign = () => {
    setSignViewerMode('word');
    setSignViewerOpen(true);
  };

  const [viewingWord, setViewingWord] = useState('');

  const handleShowCorrectedSigns = (word: string) => {
    acceptCorrection(word);
    setViewingWord(word);
    setSignViewerMode('letters');
    setSignViewerOpen(true);
  };

  const handleCloseSignViewer = () => {
    setSignViewerOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>SignSync | Learn ASL Spelling</title>
        <meta name="description" content="A child-friendly sign language detection and spelling correction tool designed for young deaf students. Learn to spell with fun, interactive hand signs!" />
      </Helmet>

      <div className="h-screen bg-background flex flex-col overflow-hidden">
        {/* Top Nav Bar */}
        <header className="flex-shrink-0 bg-card border-b border-border shadow-card relative z-10">
          <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-lg">🤟</span>
              </div>
              <span className="text-xl font-extrabold text-foreground tracking-tight">Sign<span className="text-primary">Sync</span></span>
            </div>

            {/* Mode Toggle & Status */}
            <div className="flex items-center gap-3">
              {!testSession.isActive && !testSession.isComplete && (
                <Button 
                  onClick={testSession.startTest}
                  className="hidden sm:flex h-9 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-lg shadow-sm gap-1.5"
                >
                  <Trophy className="w-4 h-4" />
                  Start Challenge
                </Button>
              )}
              {testSession.isActive && (
                <Button 
                  onClick={() => {
                    testSession.quitTest();
                    handleTryAgain();
                  }}
                  variant="outline"
                  className="hidden sm:flex h-9 font-bold rounded-lg text-muted-foreground hover:text-destructive"
                >
                  Quit Challenge
                </Button>
              )}
            </div>

            {/* Camera Control */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full ${isConnected ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-success' : 'bg-muted-foreground animate-pulse'}`} />
                {isConnected ? 'Camera Live' : 'Camera Offline'}
              </div>
              {!isConnected ? (
                <button
                  onClick={startDetection}
                  className="px-4 py-2 text-xs bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Start Camera
                </button>
              ) : (
                <button
                  onClick={stopDetection}
                  className="px-4 py-2 text-xs bg-destructive text-destructive-foreground rounded-lg font-bold hover:bg-destructive/90 transition-colors shadow-sm"
                >
                  Stop
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 min-h-0 max-w-6xl w-full mx-auto px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            {/* Left Panel – Camera & Detection */}
            <section aria-label="Sign Detection" className="overflow-y-auto overflow-x-hidden h-full">
              <CameraPanel
                currentLetter={currentLetter}
                status={status}
                statusMessage={statusMessage}
                onSimulateDetection={simulateDetection}
                videoRef={videoRef}
                remainingTime={remainingTime}
                stablePrediction={stablePrediction}
                stableCount={stableCount}
                isConnected={isConnected}
              />
            </section>

            {/* Right Panel – Word Builder / Scorecard */}
            <section aria-label="Word Builder" className="flex flex-col gap-4 overflow-y-auto overflow-x-hidden h-full">
              
              {testSession.isComplete ? (
                // 🏆 End of Test Scorecard
                <div className="bg-card rounded-2xl border border-border shadow-lift overflow-hidden h-full flex flex-col items-center justify-center p-8 text-center animate-slide-up relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mb-6 shadow-glow">
                      <Trophy className="w-12 h-12 text-accent" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-foreground mb-2">Challenge Complete!</h2>
                    <p className="text-muted-foreground font-medium mb-8">You spelled all {testSession.totalWords} words.</p>
                    
                    <div className="bg-background rounded-2xl p-6 border border-border shadow-inner w-full max-w-sm mb-8">
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Score</p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-5xl font-black text-primary">{testSession.score}</span>
                        <span className="text-xl font-bold text-muted-foreground mt-3">/ {testSession.maxScore}</span>
                      </div>
                      
                      <div className="flex justify-center gap-1 mt-4">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-6 h-6 ${i < (testSession.score / testSession.maxScore) * 5 ? 'text-accent fill-accent' : 'text-muted fill-muted'} transition-all`} 
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 w-full max-w-sm">
                      <Button 
                        onClick={() => {
                          testSession.quitTest();
                          handleTryAgain();
                        }}
                        variant="outline"
                        className="flex-1 h-12 text-sm font-bold rounded-xl"
                      >
                        <Hand className="w-4 h-4 mr-2" />
                        Free Play
                      </Button>
                      <Button 
                        onClick={() => {
                          testSession.startTest();
                          handleTryAgain();
                        }}
                        className="flex-1 h-12 text-sm font-bold rounded-xl bg-primary hover:bg-primary/90 shadow-sm"
                      >
                        <Gamepad2 className="w-4 h-4 mr-2" />
                        Play Again!
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                // 🎮 Active Game / Free Play Mode
                <>
                  {testSession.isActive && (
                    <div className="bg-primary text-primary-foreground rounded-xl p-4 shadow-lift flex items-center justify-between animate-slide-up flex-shrink-0">
                      <div>
                        <p className="text-primary-foreground/70 text-xs font-bold uppercase tracking-wider mb-0.5">
                          Challenge • Words Completed: {testSession.wordsCompleted} / {testSession.totalWords}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-medium">Spell any valid word!</span>
                        </div>
                      </div>
                      <div className="bg-black/20 rounded-lg px-4 py-2 text-right">
                        <p className="text-[10px] font-bold text-primary-foreground/70 uppercase">Score</p>
                        <p className="text-xl font-black">{testSession.score}</p>
                      </div>
                    </div>
                  )}

                  <WordBuilder
                    letters={letters}
                    onClearWord={clearWord}
                    onCheckSpelling={handleCheckSpelling}
                    onRemoveLetter={removeLetter}
                    disabled={result !== 'pending'}
                  />

                  {result !== 'pending' && (
                    <ResultDisplay
                      result={result}
                      currentWord={currentWord}
                      correctedWords={suggestedWords}
                      onTryAgain={handleTryAgain}
                      onShowSign={handleShowSign}
                      onShowCorrectedSigns={handleShowCorrectedSigns}
                      isTestMode={testSession.isActive}
                      onNextWord={handleNextWord}
                    />
                  )}
                </>
              )}
            </section>
          </div>
        </main>

        {/* Sign Viewer Modal */}
        <SignViewer
          isOpen={signViewerOpen}
          onClose={handleCloseSignViewer}
          mode={signViewerMode}
          word={signViewerMode === 'word' ? currentWord : viewingWord}
          wordVideo={wordVideo}
          letters={signViewerMode === 'letters' ? viewingWord.split('') : letters}
          letterVideos={letterVideos}
        />
      </div>
    </>
  );
};

export default Index;
