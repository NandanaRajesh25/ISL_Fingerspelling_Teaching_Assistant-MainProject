import { useState, useCallback } from "react";

/* ---------------- TYPES ---------------- */

export type SpellingResult = "pending" | "correct" | "incorrect";

interface UseWordBuilderReturn {
  letters: string[];
  currentWord: string;
  result: SpellingResult;
  suggestedWords: string[];
  wordVideo: string | null;
  letterVideos: string[];
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  clearWord: () => void;
  checkSpelling: () => void;
  acceptCorrection: (word: string) => void;
  resetResult: () => void;
}

/* ---------------- DICTIONARY ---------------- */

export const DICTIONARY = [
   "BAG","CAT", "DOG", "BIRD", "FISH", "BEAR", "LION", "TREE", "BOOK", "BALL", "STAR",
  "SUN", "MOON", "RAIN", "SNOW", "HAND", "FOOT", "HEAD", "EYE", "EAR", "NOSE",
  "APPLE", "BANANA", "ORANGE", "GRAPE", "WATER", "MILK", "BREAD", "CAKE",
  "HELLO", "GOODBYE", "PLEASE", "THANKS", "SORRY", "HAPPY", "SAD", "LOVE",
  "MOM", "DAD", "BABY", "FRIEND", "SCHOOL", "HOME", "PLAY", "EAT", "DRINK", "SLEEP"
];

/* ---------------- PATHS ---------------- */

const WORD_VIDEO_PATH = "/isl_videos/words/";
const LETTER_VIDEO_PATH = "/isl_videos/letters/";

/* ---------------- LEVENSHTEIN ---------------- */

const levenshteinDistance = (a: string, b: string): number => {
  const dp = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 +
            Math.min(
              dp[i - 1][j],     // deletion
              dp[i][j - 1],     // insertion
              dp[i - 1][j - 1]  // substitution
            );
    }
  }

  return dp[a.length][b.length];
};

const findClosestWords = (word: string, count: number = 3): string[] => {
  // Calculate distance for all words
  const distances = DICTIONARY.map(dictWord => ({
    word: dictWord,
    distance: levenshteinDistance(word, dictWord)
  }));

  // Sort by closest distance
  distances.sort((a, b) => a.distance - b.distance);

  // Return the top `count` closest words
  return distances.slice(0, count).map(d => d.word);
};

/* ---------------- HOOK ---------------- */

export const useWordBuilder = (): UseWordBuilderReturn => {
  const [letters, setLetters] = useState<string[]>([]);
  const [result, setResult] = useState<SpellingResult>("pending");
  const [suggestedWords, setSuggestedWords] = useState<string[]>([]);
  const [wordVideo, setWordVideo] = useState<string | null>(null);
  const [letterVideos, setLetterVideos] = useState<string[]>([]);

  const currentWord = letters.join("").toUpperCase();

  const addLetter = useCallback((letter: string) => {
    setLetters(prev => [...prev, letter.toUpperCase()]);
    setResult("pending");
    setSuggestedWords([]);
    setWordVideo(null);
    setLetterVideos([]);
  }, []);

  const removeLetter = useCallback(() => {
    setLetters(prev => prev.slice(0, -1));
    setResult("pending");
    setSuggestedWords([]);
    setWordVideo(null);
    setLetterVideos([]);
  }, []);

  const clearWord = useCallback(() => {
    setLetters([]);
    setResult("pending");
    setSuggestedWords([]);
    setWordVideo(null);
    setLetterVideos([]);
  }, []);

  const checkSpelling = useCallback(() => {
    if (!currentWord) return;

    // 🎮 Dictionary Match
    if (DICTIONARY.includes(currentWord)) {
      setResult("correct");
      setWordVideo(`${WORD_VIDEO_PATH}${currentWord}.mp4`);
      return;
    }

    // ❌ Incorrect → find top 3 closest using Levenshtein distance
    const closestWords = findClosestWords(currentWord);
    setResult("incorrect");
    setSuggestedWords(closestWords);
  }, [currentWord]);

  // User selects one of the suggested words → show LETTER signs for that word
  const acceptCorrection = useCallback((word: string) => {
    const videos = word.split("").map(
      letter => `${LETTER_VIDEO_PATH}${letter}.mp4`
    );
    setLetterVideos(videos);
  }, []);

  const resetResult = useCallback(() => {
    setResult("pending");
    setSuggestedWords([]);
    setWordVideo(null);
    setLetterVideos([]);
  }, []);

  return {
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
  };
};
