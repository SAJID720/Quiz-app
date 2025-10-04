
import React from 'react';
import { GlobeIcon } from './icons';
import { Difficulty } from '../types';

interface StartScreenProps {
  onStart: (difficulty: Difficulty) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center bg-slate-800/50 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-2xl border border-slate-700">
        <div className="mb-6">
            <GlobeIcon className="w-24 h-24 text-cyan-400 mx-auto" />
        </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">Language Explorer</h1>
      <p className="text-slate-300 mb-8 max-w-md mx-auto">
        How well do you know the world's languages? Test your knowledge and learn fun facts along the way!
      </p>
      <div className="flex flex-col md:flex-row gap-4 justify-center">
         <button
            onClick={() => onStart(Difficulty.Easy)}
            className="w-full md:w-auto bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-10 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/30"
          >
            Easy
          </button>
          <button
            onClick={() => onStart(Difficulty.Medium)}
            className="w-full md:w-auto bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-10 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30"
          >
            Medium
          </button>
           <button
            onClick={() => onStart(Difficulty.Hard)}
            className="w-full md:w-auto bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-10 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/30"
          >
            Hard
          </button>
      </div>
    </div>
  );
};

export default StartScreen;