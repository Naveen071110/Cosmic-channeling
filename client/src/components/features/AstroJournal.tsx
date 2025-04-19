import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface JournalEntry {
  id: string;
  text: string;
  date: string;
  tags: string[];
}

const AstroJournal = () => {
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>('astro-journal', []);
  const [newEntry, setNewEntry] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagSelector, setShowTagSelector] = useState(false);
  
  const availableTags = ['Dream', 'Wonder', 'Insight', 'Question', 'Gratitude'];

  const handleSaveEntry = () => {
    if (!newEntry.trim()) return;
    
    const entry: JournalEntry = {
      id: Date.now().toString(),
      text: newEntry,
      date: new Date().toLocaleDateString(),
      tags: selectedTags
    };
    
    setEntries([entry, ...entries]);
    setNewEntry('');
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="bg-[#1E293B] rounded-xl overflow-hidden border border-[#334155] shadow-lg hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all hover:border-[#7E22CE]/40">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <i className="ri-book-2-line text-2xl text-[#EC4899] mr-3"></i>
          <h3 className="text-xl font-medium">Astro-Journal</h3>
        </div>
        
        {entries.length > 0 && (
          <div className="mb-4">
            <div className="bg-[#334155] rounded-md p-3 mb-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Cosmic Reflection</h4>
                <span className="text-xs text-[#64748B]">{entries[0].date}</span>
              </div>
              <p className="text-sm text-[#F1F5F9]">{entries[0].text.length > 100 ? entries[0].text.substring(0, 100) + '...' : entries[0].text}</p>
              {entries[0].tags.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {entries[0].tags.map(tag => (
                    <span key={tag} className={`text-xs ${tag === 'Dream' ? 'bg-[#7E22CE]/20 text-[#7E22CE]' : 'bg-[#0EA5E9]/20 text-[#0EA5E9]'} px-2 py-1 rounded-full`}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        <Textarea 
          placeholder="Record your cosmic thoughts and dreams..." 
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          className="w-full bg-[#0F172A] border border-[#334155] rounded-md p-3 text-[#F1F5F9] placeholder-[#64748B] focus:border-[#7E22CE] focus:outline-none transition-colors mb-4 resize-none h-24"
        />
        
        {showTagSelector && (
          <div className="mb-3 flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-xs px-2 py-1 rounded-full ${
                  selectedTags.includes(tag) 
                    ? 'bg-[#7E22CE] text-white' 
                    : 'bg-[#334155] text-[#F1F5F9] hover:bg-[#475569]'
                } transition-colors`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowTagSelector(!showTagSelector)}
              className="bg-[#334155] hover:bg-[#475569] rounded-full p-1.5 transition-colors" 
              aria-label="Add tag"
            >
              <i className="ri-price-tag-3-line text-sm"></i>
            </button>
            <button 
              className="bg-[#334155] hover:bg-[#475569] rounded-full p-1.5 transition-colors" 
              aria-label="Add emotion"
            >
              <i className="ri-emotion-line text-sm"></i>
            </button>
          </div>
          
          <Button 
            onClick={handleSaveEntry}
            disabled={!newEntry.trim()}
            className="bg-[#EC4899] hover:bg-pink-600 text-white py-1.5 px-4 rounded-md transition-colors text-sm"
          >
            Save Entry
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AstroJournal;
