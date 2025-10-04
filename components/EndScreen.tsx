
import React, { useState } from 'react';
import { TrophyIcon, HistoryIcon } from './icons';
import { QuizResult, Difficulty } from '../types';

interface EndScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  history: QuizResult[];
  onClearHistory: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ score, totalQuestions, onRestart, history, onClearHistory }) => {
    const [showHistory, setShowHistory] = useState(false);
    const percentage = Math.round((score / totalQuestions) * 100);

    const getFeedback = () => {
        if (percentage === 100) return "Perfect Score! You're a true linguist!";
        if (percentage >= 80) return "Excellent! You really know your languages!";
        if (percentage >= 50) return "Great job! A solid performance.";
        return "Good effort! Keep learning and try again!";
    }

    const difficultyColors: { [key in Difficulty]: string } = {
        [Difficulty.Easy]: 'text-green-400',
        [Difficulty.Medium]: 'text-cyan-400',
        [Difficulty.Hard]: 'text-red-400',
    };

  return (
    <div className="w-full max-w-md mx-auto">
        <div className="text-center bg-slate-800/50 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-2xl border border-slate-700 mb-4">
        <div className="mb-6">
                <TrophyIcon className="w-24 h-24 text-yellow-400 mx-auto" />
            </div>
        <h1 className="text-3xl font-bold mb-2 text-slate-100">Game Over!</h1>
        <p className="text-slate-300 mb-4 text-lg">{getFeedback()}</p>
        <div className="bg-slate-900/50 rounded-lg p-6 my-6">
            <p className="text-slate-400 text-sm font-semibold mb-1">YOUR FINAL SCORE</p>
            <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                {score} <span className="text-3xl text-slate-400">/ {totalQuestions}</span>
            </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
            <button
                onClick={onRestart}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30"
            >
                Play Again
            </button>
            <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
            >
                <HistoryIcon className="w-6 h-6" />
                <span>{showHistory ? 'Hide' : 'View'} History</span>
            </button>
        </div>
        </div>
        {showHistory && (
             <div className="w-full bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-slate-700 animate-fade-in-up">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-200">Quiz History</h2>
                    {history.length > 0 && (
                        <button onClick={onClearHistory} className="text-sm text-slate-400 hover:text-red-400 transition-colors">
                            Clear History
                        </button>
                    )}
                </div>
                {history.length > 0 ? (
                    <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {history.map((result, index) => (
                            <li key={index} className="flex justify-between items-center bg-slate-900/70 p-3 rounded-lg">
                                <div>
                                    <p className="font-bold text-slate-200">
                                        Score: {result.score} / {result.totalQuestions}
                                        <span className={`ml-3 font-semibold ${difficultyColors[result.difficulty]}`}>
                                            {Difficulty[result.difficulty]}
                                        </span>
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {new Date(result.date).toLocaleString()}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-slate-400 py-4">No history yet. Play a game to see your results!</p>
                )}
            </div>
        )}
    </div>
  );
};

export default EndScreen;
