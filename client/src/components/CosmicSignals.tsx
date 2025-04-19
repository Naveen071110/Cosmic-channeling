import { useState } from 'react';
import { spaceAudio } from '@/data/spaceAudio';
import AudioPlayer from '@/components/AudioPlayer';

export default function CosmicSignals() {
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  
  return (
    <div className="bg-space-900 rounded-xl overflow-hidden border border-space-800 shadow-lg hover:shadow-cosmic transition-all hover:border-cosmic-purple/40">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <i className="ri-broadcast-line text-2xl text-cosmic-pink mr-3"></i>
          <h3 className="text-xl font-medium">Cosmic Signals</h3>
        </div>
        
        <div className="space-y-4 mb-4">
          {spaceAudio.slice(0, 2).map((audio) => (
            <div key={audio.id} className="bg-space-950 rounded-md p-3 border border-space-800">
              <h4 className="mb-1 font-medium text-sm">{audio.title}</h4>
              <p className="text-xs text-space-600 mb-2">{audio.description}</p>
              
              <AudioPlayer 
                audio={audio} 
                isActive={activeAudioId === audio.id}
                onPlay={() => setActiveAudioId(audio.id)}
                onPause={() => setActiveAudioId(null)}
              />
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => {/* Would navigate to a full signals page */}}
          className="w-full bg-space-800 hover:bg-space-700 text-space-50 py-2 rounded-md transition-colors flex items-center justify-center"
        >
          <i className="ri-sound-module-line mr-2"></i> Browse All Signals
        </button>
      </div>
    </div>
  );
}
