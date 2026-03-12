import { useState, useCallback } from "react";

export interface TestSessionState {
  isActive: boolean;
  wordsCompleted: number;
  score: number;
  attemptsForCurrent: number;
  isComplete: boolean;
}

const WORDS_PER_TEST = 5;
const POINTS_FIRST_TRY = 100;
const POINTS_RETRY = 50;

export const useTestSession = () => {
  const [session, setSession] = useState<TestSessionState>({
    isActive: false,
    wordsCompleted: 0,
    score: 0,
    attemptsForCurrent: 0,
    isComplete: false,
  });

  const startTest = useCallback(() => {
    setSession({
      isActive: true,
      wordsCompleted: 0,
      score: 0,
      attemptsForCurrent: 0,
      isComplete: false,
    });
  }, []);

  const recordAttempt = useCallback((isCorrect: boolean) => {
    setSession((prev) => {
      if (!prev.isActive || prev.isComplete) return prev;

      const newAttempts = prev.attemptsForCurrent + 1;
      
      if (isCorrect) {
        // Calculate points: 100 for first try, 50 for subsequent tries
        const pointsEarned = newAttempts === 1 ? POINTS_FIRST_TRY : POINTS_RETRY;
        return {
          ...prev,
          score: prev.score + pointsEarned,
          attemptsForCurrent: newAttempts,
        };
      }
      
      return {
        ...prev,
        attemptsForCurrent: newAttempts,
      };
    });
  }, []);

  const nextWord = useCallback(() => {
    setSession((prev) => {
      if (!prev.isActive || prev.isComplete) return prev;

      const newCompleted = prev.wordsCompleted + 1;
      const isDone = newCompleted >= WORDS_PER_TEST;

      return {
        ...prev,
        wordsCompleted: newCompleted,
        attemptsForCurrent: 0,
        isComplete: isDone,
        isActive: !isDone, // End session automatically when complete
      };
    });
  }, []);

  const quitTest = useCallback(() => {
    setSession({
      isActive: false,
      wordsCompleted: 0,
      score: 0,
      attemptsForCurrent: 0,
      isComplete: false,
    });
  }, []);

  return {
    ...session,
    startTest,
    recordAttempt,
    nextWord,
    quitTest,
    maxScore: WORDS_PER_TEST * POINTS_FIRST_TRY,
    totalWords: WORDS_PER_TEST
  };
};
