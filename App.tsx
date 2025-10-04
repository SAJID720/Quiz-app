
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Country, Difficulty, QuizResult, User } from './types';
import { COUNTRIES } from './constants';
import StartScreen from './components/StartScreen';
import GameCard from './components/GameCard';
import EndScreen from './components/EndScreen';
import { getFunFact, getHint } from './services/geminiService';
import LoginScreen from './components/LoginScreen';
import { LogoutIcon } from './components/icons';

const DIFFICULTY_SETTINGS = {
  [Difficulty.Easy]: {
    questions: 5,
    levels: ['easy']
  },
  [Difficulty.Medium]: {
    questions: 10,
    levels: ['easy', 'medium']
  },
  [Difficulty.Hard]: {
    questions: 15,
    levels: ['easy', 'medium', 'hard']
  },
};

// Helper function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [questions, setQuestions] = useState<Country[]>([]);
  const [countryPool, setCountryPool] = useState<Country[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [funFact, setFunFact] = useState<string | null>(null);
  const [isFactLoading, setIsFactLoading] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [hint, setHint] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Check for logged-in user on mount
  useEffect(() => {
    try {
        const loggedInUser = localStorage.getItem('currentUser');
        if (loggedInUser) {
            setCurrentUser(loggedInUser);
        }
    } catch (error) {
        console.error("Failed to read from localStorage:", error);
    }
  }, []);

  // Load user-specific history when user logs in
  useEffect(() => {
    if (!currentUser) return;
    try {
      const storedHistory = localStorage.getItem(`quizHistory_${currentUser}`);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      } else {
        setHistory([]);
      }
    } catch (error) {
        console.error("Failed to load history from localStorage:", error);
        setHistory([]);
    }
  }, [currentUser]);

  const setupGame = useCallback((selectedDifficulty: Difficulty) => {
    const settings = DIFFICULTY_SETTINGS[selectedDifficulty];
    setTotalQuestions(settings.questions);
    setDifficulty(selectedDifficulty);

    const availableCountries = COUNTRIES.filter(c => settings.levels.includes(c.difficulty));
    setCountryPool(availableCountries);

    const shuffledCountries = shuffleArray(availableCountries);
    setQuestions(shuffledCountries.slice(0, settings.questions));
    
    setCurrentQuestionIndex(0);
    setScore(0);
    setFunFact(null);
    setHintsRemaining(3);
    setHint(null);
  }, []);

  const transitionTo = (action: () => void) => {
    setIsTransitioning(true);
    setTimeout(() => {
      action();
      setIsTransitioning(false);
    }, 400); // Duration of the fade-out animation
  };

  const handleStartGame = (selectedDifficulty: Difficulty) => {
    transitionTo(() => {
        setupGame(selectedDifficulty);
        setGameState(GameState.Playing);
    });
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
     transitionTo(() => {
        setFunFact(null);
        setHint(null);
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          // Game finished, save result
          if (difficulty !== null && currentUser) {
            const newResult: QuizResult = {
              score,
              totalQuestions,
              difficulty,
              date: new Date().toISOString(),
            };
            const updatedHistory = [newResult, ...history];
            setHistory(updatedHistory);
            localStorage.setItem(`quizHistory_${currentUser}`, JSON.stringify(updatedHistory));
          }
          setGameState(GameState.Finished);
        }
    });
  };

  const handleRestart = () => {
    transitionTo(() => {
        setGameState(GameState.Start);
    });
  };

  const handleClearHistory = () => {
    if (!currentUser) return;
    setHistory([]);
    localStorage.removeItem(`quizHistory_${currentUser}`);
  };
  
  const fetchFunFact = async (countryName: string, language: string) => {
    setIsFactLoading(true);
    setFunFact(null);
    try {
      const fact = await getFunFact(countryName, language);
      setFunFact(fact);
    } catch (error) {
      console.error("Failed to fetch fun fact:", error);
      setFunFact("Sorry, I couldn't think of a fun fact right now.");
    } finally {
      setIsFactLoading(false);
    }
  };

  const fetchHint = async (countryName: string, language: string) => {
    if (hintsRemaining <= 0 || hint) return;

    setIsHintLoading(true);
    setHintsRemaining(prev => prev - 1);
    try {
      const newHint = await getHint(countryName, language);
      setHint(newHint);
    } catch (error) {
      console.error("Failed to fetch hint:", error);
      setHint("Sorry, I couldn't come up with a hint right now.");
    } finally {
      setIsHintLoading(false);
    }
  };

  const handleSignUp = (email: string, password: string): boolean => {
    try {
        const usersJSON = localStorage.getItem('users');
        const users: User[] = usersJSON ? JSON.parse(usersJSON) : [];

        if (users.some(user => user.email === email)) {
            return false; // User already exists
        }

        const newUser: User = { email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', email);
        setCurrentUser(email);
        return true;
    } catch (error) {
        console.error("Sign up failed:", error);
        return false;
    }
  };

  const handleLogin = (email: string, password: string): boolean => {
      try {
          const usersJSON = localStorage.getItem('users');
          if (!usersJSON) return false;

          const users: User[] = JSON.parse(usersJSON);
          const user = users.find(u => u.email === email && u.password === password);

          if (user) {
              localStorage.setItem('currentUser', email);
              setCurrentUser(email);
              return true;
          }
          return false;
      } catch (error) {
          console.error("Login failed:", error);
          return false;
      }
  };

  const handleLogout = () => {
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
      setGameState(GameState.Start); // Reset to start screen after logout
  };

  const renderGameState = () => {
    switch (gameState) {
      case GameState.Playing:
        if (questions.length === 0) return null;
        const currentQuestion = questions[currentQuestionIndex];
        return (
          <GameCard
            country={currentQuestion}
            countryPool={countryPool}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
            onGetFunFact={fetchFunFact}
            funFact={funFact}
            isFactLoading={isFactLoading}
            onGetHint={fetchHint}
            hint={hint}
            isHintLoading={isHintLoading}
            hintsRemaining={hintsRemaining}
          />
        );
      case GameState.Finished:
        return (
          <EndScreen 
            score={score} 
            totalQuestions={totalQuestions} 
            onRestart={handleRestart}
            history={history}
            onClearHistory={handleClearHistory}
          />
        );
      case GameState.Start:
      default:
        return <StartScreen onStart={handleStartGame} />;
    }
  };
  
  const animationClass = isTransitioning ? 'animate-fade-out-down' : 'animate-fade-in-up';
  
  if (!currentUser) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white min-h-screen flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')] opacity-10"></div>
        <main className="z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
          <LoginScreen onLogin={handleLogin} onSignUp={handleSignUp} />
        </main>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white min-h-screen flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')] opacity-10"></div>
      <main className="z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
        <div className={animationClass}>
            {renderGameState()}
        </div>
      </main>
      <footer className="absolute bottom-4 text-slate-500 text-sm w-full max-w-2xl mx-auto flex justify-between items-center z-20 px-4">
        <p className="hidden sm:inline">Language Explorer Game &copy; 2024</p>
        <div className="flex items-center gap-4">
            <span className="text-slate-400 hidden sm:inline">{currentUser}</span>
            <button onClick={handleLogout} className="flex items-center gap-1.5 bg-slate-700/50 hover:bg-slate-700 transition-colors px-3 py-1.5 rounded-md text-slate-300 hover:text-white">
                <LogoutIcon className="w-4 h-4" />
                Logout
            </button>
        </div>
    </footer>
    </div>
  );
};

export default App;
