import { useState, useEffect, useRef } from 'react';
import { formatTime } from '@/lib/utils';
import { useMeditation } from '@/hooks/useMeditation';

export default function MeditationTimer() {
  const { 
    isRunning, 
    timeLeft, 
    selectedDuration,
    setDuration,
    startTimer,
    pauseTimer,
    resetTimer,
    selectedSound,
    setSound,
    availableSounds
  } = useMeditation();

  return (
    <div className="bg-space-900 rounded-xl overflow-hidden border border-space-800 shadow-lg hover:shadow-cosmic transition-all hover:border-cosmic-purple/40">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <i className="ri-moon-clear-line text-2xl text-cosmic-blue mr-3"></i>
          <h3 className="text-xl font-medium">Cosmic Meditation</h3>
        </div>
        
        <div className="relative h-60 mb-6 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-space-800 flex items-center justify-center relative z-10">
            <span className="text-3xl font-space font-bold">{formatTime(timeLeft)}</span>
          </div>
          
          {/* Orbital animation */}
          <div className="cosmic-orbiter">
            <div className="orbit-dot"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mb-4">
          <button 
            onClick={() => setDuration(60)} 
            className={`py-2 px-3 ${selectedDuration === 60 ? 'bg-cosmic-purple' : 'bg-space-800 hover:bg-space-700'} rounded text-sm transition-colors`}
          >
            1m
          </button>
          <button 
            onClick={() => setDuration(180)} 
            className={`py-2 px-3 ${selectedDuration === 180 ? 'bg-cosmic-purple' : 'bg-space-800 hover:bg-space-700'} rounded text-sm transition-colors`}
          >
            3m
          </button>
          <button 
            onClick={() => setDuration(300)} 
            className={`py-2 px-3 ${selectedDuration === 300 ? 'bg-cosmic-purple' : 'bg-space-800 hover:bg-space-700'} rounded text-sm transition-colors`}
          >
            5m
          </button>
          <button 
            onClick={() => setDuration(600)} 
            className={`py-2 px-3 ${selectedDuration === 600 ? 'bg-cosmic-purple' : 'bg-space-800 hover:bg-space-700'} rounded text-sm transition-colors`}
          >
            10m
          </button>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center relative group">
            <button className="p-2 text-lg text-cosmic-blue hover:text-cosmic-pink transition-colors" aria-label="Sound options">
              <i className="ri-volume-up-line"></i>
            </button>
            <span className="text-xs text-space-600">{selectedSound?.name || 'No sound'}</span>
            
            {/* Sound dropdown - can be implemented with Shadcn Dropdown */}
            {/* <div className="absolute left-0 bottom-full mb-2 bg-space-800 rounded p-2 hidden group-hover:block">
              {availableSounds.map(sound => (
                <button 
                  key={sound.id}
                  onClick={() => setSound(sound)}
                  className="block w-full text-left px-2 py-1 text-sm hover:bg-space-700 rounded"
                >
                  {sound.name}
                </button>
              ))}
            </div> */}
          </div>
          
          <button 
            onClick={isRunning ? pauseTimer : startTimer}
            className="bg-cosmic-purple hover:bg-purple-800 text-white py-2 px-4 rounded-md transition-colors"
          >
            {isRunning ? 'Pause' : 'Begin'}
          </button>
        </div>
      </div>
    </div>
  );
}
