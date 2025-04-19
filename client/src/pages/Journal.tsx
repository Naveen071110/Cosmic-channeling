import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { JournalEntry } from '@/types';

const Journal = () => {
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>('astro-journal', []);
  const [newEntry, setNewEntry] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('write');
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const { toast } = useToast();
  
  const availableTags = ['Dream', 'Wonder', 'Insight', 'Question', 'Gratitude', 'Cosmic', 'Meditation', 'Reflection'];

  const handleSaveEntry = () => {
    if (!newEntry.trim()) {
      toast({
        title: "Empty journal entry",
        description: "Please write something before saving your entry.",
        variant: "destructive"
      });
      return;
    }
    
    if (editingEntry) {
      // Update existing entry
      const updatedEntries = entries.map(entry => 
        entry.id === editingEntry.id 
          ? { ...entry, text: newEntry, tags: selectedTags }
          : entry
      );
      
      setEntries(updatedEntries);
      toast({
        title: "Entry updated",
        description: "Your cosmic journal entry has been updated.",
      });
    } else {
      // Create new entry
      const entry: JournalEntry = {
        id: Date.now().toString(),
        text: newEntry,
        date: new Date().toLocaleDateString(),
        tags: selectedTags
      };
      
      setEntries([entry, ...entries]);
      toast({
        title: "Entry saved",
        description: "Your cosmic reflection has been added to your journal.",
      });
    }
    
    // Reset form
    setNewEntry('');
    setSelectedTags([]);
    setEditingEntry(null);
    setShowTagSelector(false);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setNewEntry(entry.text);
    setSelectedTags(entry.tags);
    setEditingEntry(entry);
    setActiveTab('write');
    window.scrollTo(0, 0);
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries(entries.filter(entry => entry.id !== entryId));
    toast({
      title: "Entry deleted",
      description: "Your journal entry has been removed.",
    });
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const cancelEditing = () => {
    setNewEntry('');
    setSelectedTags([]);
    setEditingEntry(null);
    setShowTagSelector(false);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-space">
            <span className="bg-gradient-to-r from-[#EC4899] to-[#0EA5E9] bg-clip-text text-transparent">
              Astro Journal
            </span>
          </h1>
          <p className="text-[#F1F5F9] max-w-2xl mx-auto">
            Record your cosmic thoughts, dreams, and spiritual insights. Your private space to reflect on your journey through the universe.
          </p>
        </div>
        
        <Tabs defaultValue="write" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="write">Write Entry</TabsTrigger>
            <TabsTrigger value="entries">My Entries {entries.length > 0 && `(${entries.length})`}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="write" className="focus:outline-none">
            <Card className="bg-[#1E293B] border-[#334155]">
              <CardHeader>
                <CardTitle className="text-[#F1F5F9]">
                  {editingEntry ? "Edit Entry" : "New Cosmic Reflection"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Record your cosmic thoughts, dreams, and revelations..." 
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-md p-3 text-[#F1F5F9] placeholder-[#64748B] focus:border-[#7E22CE] focus:outline-none transition-colors mb-4 resize-none h-48"
                />
                
                <div className="flex items-center gap-3 mb-4">
                  <button 
                    onClick={() => setShowTagSelector(!showTagSelector)}
                    className="flex items-center gap-1 bg-[#334155] hover:bg-[#475569] rounded-md py-1.5 px-3 transition-colors text-sm" 
                  >
                    <i className="ri-price-tag-3-line text-sm"></i>
                    <span>{showTagSelector ? 'Hide Tags' : 'Add Tags'}</span>
                  </button>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map(tag => (
                      <span 
                        key={tag} 
                        className="text-xs bg-[#7E22CE]/20 text-[#7E22CE] px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        {tag}
                        <button 
                          onClick={() => toggleTag(tag)}
                          className="hover:text-[#EC4899] ml-1"
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                
                {showTagSelector && (
                  <div className="mb-4 flex flex-wrap gap-2">
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
                  {editingEntry ? (
                    <>
                      <Button 
                        onClick={cancelEditing}
                        className="bg-[#334155] hover:bg-[#475569] text-[#F1F5F9] py-2 px-4 rounded-md transition-colors"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSaveEntry}
                        disabled={!newEntry.trim()}
                        className="bg-[#EC4899] hover:bg-pink-600 text-white py-2 px-6 rounded-md transition-colors"
                      >
                        Update Entry
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={handleSaveEntry}
                      disabled={!newEntry.trim()}
                      className="bg-[#EC4899] hover:bg-pink-600 text-white py-2 px-6 rounded-md transition-colors ml-auto"
                    >
                      Save Entry
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="entries" className="focus:outline-none">
            {entries.length === 0 ? (
              <Card className="bg-[#1E293B] border-[#334155] p-8 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#0F172A] flex items-center justify-center">
                    <i className="ri-book-2-line text-3xl text-[#64748B]"></i>
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-2">Your Cosmic Journal is Empty</h3>
                <p className="text-[#64748B] mb-6">
                  Start recording your cosmic thoughts, dreams, and insights to build your personal journey through the stars.
                </p>
                <Button 
                  onClick={() => setActiveTab('write')}
                  className="bg-[#7E22CE] hover:bg-purple-800 text-white py-2 px-6 rounded-md transition-colors"
                >
                  Create First Entry
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {entries.map((entry) => (
                  <Card key={entry.id} className="bg-[#1E293B] border-[#334155]">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-xs text-[#64748B] block mb-1">
                            {entry.date}
                          </span>
                          {entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {entry.tags.map(tag => (
                                <span 
                                  key={tag} 
                                  className="text-xs bg-[#7E22CE]/20 text-[#7E22CE] px-2 py-0.5 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditEntry(entry)}
                            className="text-[#64748B] hover:text-[#0EA5E9] transition-colors"
                            aria-label="Edit entry"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button 
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="text-[#64748B] hover:text-[#EC4899] transition-colors"
                            aria-label="Delete entry"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </div>
                      <p className="text-[#F1F5F9] whitespace-pre-wrap">
                        {entry.text}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
};

export default Journal;
