import React, { useState, useEffect, useMemo } from 'react';
import { Country } from '../types';
import { CheckCircleIcon, XCircleIcon, SparklesIcon, LoadingIcon, LightbulbIcon } from './icons';

interface GameCardProps {
  country: Country;
  countryPool: Country[];
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
  onGetFunFact: (countryName: string, language: string) => void;
  funFact: string | null;
  isFactLoading: boolean;
  onGetHint: (countryName: string, language: string) => void;
  hint: string | null;
  isHintLoading: boolean;
  hintsRemaining: number;
}

const GameCard: React.FC<GameCardProps> = ({
  country,
  countryPool,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
  onGetFunFact,
  funFact,
  isFactLoading,
  onGetHint,
  hint,
  isHintLoading,
  hintsRemaining,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const options = useMemo(() => {
    const correctLanguage = country.language;
    const incorrectLanguages = countryPool
      .filter(c => c.language !== correctLanguage)
      .map(c => c.language);
    
    const uniqueIncorrect = [...new Set(incorrectLanguages)];
    const shuffledIncorrect = uniqueIncorrect.sort(() => 0.5 - Math.random());
    const finalOptions = [correctLanguage, ...shuffledIncorrect.slice(0, 3)];
    
    return finalOptions.sort(() => 0.5 - Math.random());
  }, [country, countryPool]);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [country]);

  const handleSelectAnswer = (language: string) => {
    if (selectedAnswer) return;
    
    const correct = language === country.language;
    setSelectedAnswer(language);
    setIsCorrect(correct);
    onAnswer(correct);
  };

  const getButtonClass = (language: string) => {
    if (!selectedAnswer) {
      return 'bg-slate-700 hover:bg-slate-600';
    }
    // Highlight the correct answer in green
    if (language === country.language) {
      return 'bg-green-600 ring-2 ring-green-400 scale-105 shadow-lg shadow-green-500/30';
    }
    // Highlight the user's incorrect choice in red
    if (language === selectedAnswer && !isCorrect) {
      return 'bg-red-600 ring-2 ring-red-500 scale-105 shadow-lg shadow-red-500/30';
    }
    // Dim other incorrect options
    return 'bg-slate-700 opacity-50';
  };

  return (
    <div className="w-full bg-slate-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-cyan-400">Language Explorer</h2>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-lg font-semibold" title={`${hintsRemaining} hints remaining`}>
                <LightbulbIcon className={`w-6 h-6 ${hintsRemaining > 0 ? 'text-yellow-400' : 'text-slate-600'}`} />
                <span className={`${hintsRemaining > 0 ? 'text-slate-300' : 'text-slate-600'}`}>{hintsRemaining}</span>
            </div>
            <div className="text-lg font-semibold text-slate-300">
            {questionNumber} / {totalQuestions}
            </div>
        </div>
      </div>
      
      <div className="text-center mb-6">
        <img
          src={`https://flagcdn.com/w160/${country.code.toLowerCase()}.png`}
          alt={`${country.name} flag`}
          className="w-32 h-auto mx-auto mb-4 rounded-lg shadow-lg border-2 border-slate-600"
        />
        <p className="text-2xl font-semibold text-slate-200">
          What is the official language of <span className="font-bold text-white">{country.name}</span>?
        </p>
      </div>

      <div className="min-h-[76px] mb-6 flex flex-col justify-center items-center">
        {!selectedAnswer && !hint && !isHintLoading && hintsRemaining > 0 && (
            <button
                onClick={() => onGetHint(country.name, country.language)}
                disabled={isHintLoading}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-yellow-300 font-semibold py-2 px-5 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-wait animate-fade-in"
            >
                <LightbulbIcon className="w-5 h-5" />
                Use a Hint
            </button>
        )}
        {isHintLoading && (
            <div className="flex items-center justify-center gap-2 text-slate-400 animate-fade-in">
                <LoadingIcon />
                <span>Thinking of a hint...</span>
            </div>
        )}
        {hint && !isHintLoading && (
            <div className="w-full bg-slate-900/70 p-4 rounded-lg border border-slate-700 text-center animate-fade-in">
                <p className="text-slate-300 italic">"{hint}"</p>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {options.map(lang => (
          <button
            key={lang}
            onClick={() => handleSelectAnswer(lang)}
            disabled={!!selectedAnswer}
            className={`flex items-center justify-between w-full p-4 rounded-lg text-left text-white font-semibold transition-all duration-300 ease-in-out transform ${!selectedAnswer ? 'hover:scale-105' : ''} ${getButtonClass(lang)} disabled:cursor-not-allowed`}
          >
            <span>{lang}</span>
            {selectedAnswer && (
              <span className="animate-pop">
                {lang === country.language && <CheckCircleIcon className="w-6 h-6 text-white"/>}
                {selectedAnswer === lang && !isCorrect && <XCircleIcon className="w-6 h-6 text-white"/>}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {selectedAnswer && (
        <div 
            className="flex flex-col items-center space-y-4 animate-fade-in-up"
            style={{ animationDelay: '300ms', opacity: 0 }}
        >
            <div className="w-full text-center min-h-[76px] flex flex-col items-center justify-center">
                {isFactLoading ? (
                    <div className="flex items-center justify-center gap-2 text-slate-400 animate-fade-in">
                        <LoadingIcon />
                        <span>Thinking of a fact...</span>
                    </div>
                ) : funFact ? (
                    <div className="w-full bg-slate-900/70 p-4 rounded-lg border border-slate-700 text-center animate-fade-in">
                        <p className="text-slate-300">{funFact}</p>
                    </div>
                ) : isCorrect ? (
                    <button 
                        onClick={() => onGetFunFact(country.name, country.language)} 
                        className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 animate-fade-in"
                    >
                        <SparklesIcon />
                        Get a Fun Fact!
                    </button>
                ) : null}
            </div>

          <button
            onClick={onNext}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300"
          >
            {questionNumber === totalQuestions ? 'Finish' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
};

export default GameCard;