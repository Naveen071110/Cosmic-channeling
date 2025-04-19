import { useState } from 'react';
import { useJournal } from '@/hooks/useJournal';
import { formatRelative } from 'date-fns';

type JournalTag = {
  id: string;
  name: string;
  colorClass: string;
};

const availableTags: JournalTag[] = [
  { id: 'dream', name: 'Dream', colorClass: 'bg-cosmic-purple/20 text-cosmic-purple' },
  { id: 'wonder', name: 'Wonder', colorClass: 'bg-cosmic-blue/20 text-cosmic-blue' },
  { id: 'insight', name: 'Insight', colorClass: 'bg-cosmic-pink/20 text-cosmic-pink' },
  { id: 'vision', name: 'Vision', colorClass: 'bg-cosmic-green/20 text-cosmic-green' },
];

export default function AstroJournal() {
  const [entryText, setEntryText] = useState('');
  const [selectedTags, setSelectedTags] = useState<JournalTag[]>([]);
  const [showTagSelector, setShowTagSelector] = useState(false);
  
  const { entries, addEntry } = useJournal();
  
  const handleAddTag = (tag: JournalTag) => {
    if (!selectedTags.some(t => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setShowTagSelector(false);
  };
  
  const handleSaveEntry = () => {
    if (entryText.trim()) {
      addEntry({
        text: entryText,
        tags: selectedTags,
        date: new Date()
      });
      setEntryText('');
      setSelectedTags([]);
    }
  };

  return (
    <div className="bg-space-900 rounded-xl overflow-hidden border border-space-800 shadow-lg hover:shadow-cosmic transition-all hover:border-cosmic-purple/40">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <i className="ri-book-2-line text-2xl text-cosmic-pink mr-3"></i>
          <h3 className="text-xl font-medium">Astro-Journal</h3>
        </div>
        
        {entries.length > 0 && (
          <div className="mb-4">
            <div className="bg-space-800 rounded-md p-3 mb-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Cosmic Reflection</h4>
                <span className="text-xs text-space-600">
                  {formatRelative(new Date(entries[0].date), new Date())}
                </span>
              </div>
              <p className="text-sm text-space-100">{entries[0].text}</p>
              <div className="flex gap-2 mt-2">
                {entries[0].tags.map(tag => (
                  <span key={tag.id} className={`text-xs ${tag.colorClass} px-2 py-1 rounded-full`}>
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <textarea 
          value={entryText}
          onChange={(e) => setEntryText(e.target.value)}
          placeholder="Record your cosmic thoughts and dreams..." 
          className="w-full bg-space-950 border border-space-800 rounded-md p-3 text-space-100 placeholder-space-600 focus:border-cosmic-purple focus:outline-none transition-colors mb-4 resize-none h-24"
        />
        
        <div className="flex justify-between">
          <div className="flex items-center gap-2 relative">
            <button 
              onClick={() => setShowTagSelector(!showTagSelector)}
              className="bg-space-800 hover:bg-space-700 rounded-full p-1.5 transition-colors" 
              aria-label="Add tag"
            >
              <i className="ri-price-tag-3-line text-sm"></i>
            </button>
            
            {showTagSelector && (
              <div className="absolute top-full left-0 mt-2 bg-space-800 p-2 rounded-md z-10">
                {availableTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleAddTag(tag)}
                    className={`block px-3 py-1 text-xs rounded-full my-1 ${tag.colorClass}`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
            
            {selectedTags.map(tag => (
              <span 
                key={tag.id} 
                className={`text-xs ${tag.colorClass} px-2 py-1 rounded-full`}
              >
                {tag.name}
              </span>
            ))}
          </div>
          
          <button 
            onClick={handleSaveEntry}
            disabled={!entryText.trim()}
            className={`${entryText.trim() ? 'bg-cosmic-pink hover:bg-pink-600' : 'bg-space-800 cursor-not-allowed'} text-white py-1.5 px-4 rounded-md transition-colors text-sm`}
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
}
