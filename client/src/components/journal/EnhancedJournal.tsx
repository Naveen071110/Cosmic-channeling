import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { 
  Book, 
  Calendar as CalendarIcon, 
  Plus, 
  Star, 
  Tag, 
  Save, 
  Download, 
  FileText, 
  Sparkles,
  Lightbulb,
  Lock
} from "lucide-react";
import LoginDialog from "@/components/ui/LoginDialog";

// Type definitions for journal-related data
interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  tags: string[];
  prompt?: string;
  sentiment: number; // -1 to 1
  wordCount: number;
  themes: string[];
}

interface JournalPrompt {
  id: string;
  text: string;
  category: 'gratitude' | 'reflection' | 'goals' | 'cosmic';
  tags: string[];
}

// Journal prompts to help users get started
const samplePrompts: JournalPrompt[] = [
  {
    id: "1",
    text: "What cosmic patterns have you noticed repeating in your life lately?",
    category: "reflection",
    tags: ["patterns", "cosmos", "reflection"]
  },
  {
    id: "2",
    text: "Describe a connection you felt with the universe today. How did it manifest?",
    category: "cosmic",
    tags: ["connection", "universe", "presence"]
  },
  {
    id: "3",
    text: "What are three things you're grateful for in your cosmic journey today?",
    category: "gratitude",
    tags: ["gratitude", "journey", "appreciation"]
  },
  {
    id: "4",
    text: "How do you hope to align your energy with cosmic forces this week?",
    category: "goals",
    tags: ["alignment", "energy", "planning"]
  },
  {
    id: "5",
    text: "If you could communicate with a celestial body, which would it be and what would you ask?",
    category: "cosmic",
    tags: ["communication", "celestial", "curiosity"]
  }
];

// We'll load journal entries from the server when the user is logged in
const emptyJournalEntries: JournalEntry[] = [];

export default function EnhancedJournal() {
  const { user } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState<boolean>(false);
  const [loginDialogContext, setLoginDialogContext] = useState<string>('entries');
  
  const [activeTab, setActiveTab] = useState<string>("write");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(emptyJournalEntries);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [journalContent, setJournalContent] = useState<string>("");
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState<string>("");
  const [selectedPrompt, setSelectedPrompt] = useState<JournalPrompt | null>(null);
  
  // Get available journal entries for the selected date
  const getEntriesForDate = (date: Date | undefined) => {
    if (!date) return [];
    
    return journalEntries.filter(entry => 
      entry.date.getDate() === date.getDate() &&
      entry.date.getMonth() === date.getMonth() &&
      entry.date.getFullYear() === date.getFullYear()
    );
  };
  
  // Handle date selection
  useEffect(() => {
    const entriesForDate = getEntriesForDate(selectedDate);
    if (entriesForDate.length > 0) {
      setSelectedEntry(entriesForDate[0]);
      setJournalContent(entriesForDate[0].content);
      setCurrentTags(entriesForDate[0].tags);
    } else {
      setSelectedEntry(null);
      setJournalContent("");
      setCurrentTags([]);
    }
  }, [selectedDate]);
  
  // Handle journal entry selection
  const handleEntrySelect = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setJournalContent(entry.content);
    setCurrentTags(entry.tags);
  };
  
  // Handle adding a new tag
  const handleAddTag = () => {
    if (newTagInput.trim() && !currentTags.includes(newTagInput.trim())) {
      setCurrentTags([...currentTags, newTagInput.trim()]);
      setNewTagInput("");
    }
  };
  
  // Handle removing a tag
  const handleRemoveTag = (tag: string) => {
    setCurrentTags(currentTags.filter(t => t !== tag));
  };
  
  // Handle saving the journal entry
  const handleSaveEntry = () => {
    // If user is not logged in, show login dialog
    if (!user) {
      setLoginDialogContext('save');
      setShowLoginDialog(true);
      return;
    }
    
    if (!journalContent.trim()) return;
    
    // Calculate word count
    const wordCount = journalContent.trim().split(/\s+/).length;
    
    // Simulate sentiment analysis and theme extraction (would be done by an API in production)
    const sentiment = Math.random() * 2 - 1; // Between -1 and 1
    const possibleThemes = ["cosmic connection", "meditation", "self-discovery", "existential questions", "purpose", "perspective", "synchronicity", "celestial influence", "connections"];
    const themes = Array.from({length: Math.floor(Math.random() * 3) + 1}, () => 
      possibleThemes[Math.floor(Math.random() * possibleThemes.length)]
    );
    
    const newEntry: JournalEntry = {
      id: selectedEntry?.id || Date.now().toString(),
      date: selectedDate || new Date(),
      content: journalContent,
      tags: currentTags,
      prompt: selectedPrompt?.text,
      sentiment,
      wordCount,
      themes
    };
    
    if (selectedEntry) {
      // Update existing entry
      setJournalEntries(journalEntries.map(entry => 
        entry.id === selectedEntry.id ? newEntry : entry
      ));
    } else {
      // Create new entry
      setJournalEntries([...journalEntries, newEntry]);
    }
    
    setSelectedEntry(newEntry);
  };
  
  // Handle creating a new entry
  const handleNewEntry = () => {
    setSelectedEntry(null);
    setJournalContent("");
    setCurrentTags([]);
    setSelectedPrompt(null);
  };
  
  // Handle prompt selection
  const handlePromptSelect = (promptId: string) => {
    const prompt = samplePrompts.find(p => p.id === promptId);
    if (prompt) {
      setSelectedPrompt(prompt);
      setJournalContent(journalContent ? journalContent : prompt.text + "\n\n");
    }
  };
  
  // Calculate the sentiment color
  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.5) return "text-green-500";
    if (sentiment > 0) return "text-blue-500";
    if (sentiment > -0.5) return "text-yellow-500";
    return "text-red-500";
  };
  
  return (
    <div className="container max-w-6xl mx-auto px-4">
      <Tabs defaultValue="write" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="write">
            <FileText className="w-4 h-4 mr-2" />
            Write
          </TabsTrigger>
          <TabsTrigger value="entries">
            <Book className="w-4 h-4 mr-2" />
            Entries
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Sparkles className="w-4 h-4 mr-2" />
            Insights
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="write" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-white">
                      {selectedEntry ? "Edit Entry" : "New Journal Entry"}
                    </CardTitle>
                    <CardDescription>
                      {selectedDate?.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedEntry && (
                      <Button variant="outline" size="sm" onClick={handleNewEntry}>
                        <Plus className="w-4 h-4 mr-1" />
                        New
                      </Button>
                    )}
                    <Button onClick={handleSaveEntry}>
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedPrompt && (
                    <div className="bg-purple-900/30 border-l-4 border-purple-500 p-3 rounded">
                      <p className="text-purple-200 italic">
                        <Lightbulb className="w-4 h-4 inline mr-2 text-purple-300" />
                        {selectedPrompt.text}
                      </p>
                    </div>
                  )}
                  <Textarea
                    placeholder="Record your cosmic journey today..."
                    className="min-h-[300px] bg-black/20 border-gray-700 focus:border-purple-500 text-gray-100"
                    value={journalContent}
                    onChange={(e) => setJournalContent(e.target.value)}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    {currentTags.map((tag, index) => (
                      <Badge 
                        key={index}
                        variant="outline"
                        className="bg-purple-900/30 hover:bg-purple-900/50 text-gray-200 cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag}
                        <span className="ml-1 text-gray-400">×</span>
                      </Badge>
                    ))}
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Add tag..."
                        className="w-24 h-6 bg-black/20 border-gray-700 rounded-l-md text-sm px-2 focus:outline-none focus:border-purple-500 text-gray-200"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      />
                      <button
                        className="h-6 px-2 rounded-r-md bg-purple-900 text-gray-200 text-sm focus:outline-none hover:bg-purple-800"
                        onClick={handleAddTag}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="border border-gray-700 rounded-md"
                  />
                </CardContent>
              </Card>
              
              <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Journal Prompts</CardTitle>
                  <CardDescription>Choose a prompt for inspiration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {samplePrompts.map((prompt) => (
                    <div 
                      key={prompt.id}
                      className="p-3 rounded-md border border-gray-700 hover:border-purple-500 cursor-pointer transition-colors"
                      onClick={() => handlePromptSelect(prompt.id)}
                    >
                      <p className="text-gray-200">{prompt.text}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {prompt.tags.map((tag, idx) => (
                          <Badge 
                            key={idx}
                            variant="outline"
                            className="bg-purple-900/20 text-gray-300 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="entries" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {journalEntries.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400">No journal entries yet. Start writing your cosmic journey!</p>
                <Button 
                  onClick={() => setActiveTab("write")}
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Entry
                </Button>
              </div>
            ) : (
              journalEntries.sort((a, b) => b.date.getTime() - a.date.getTime()).map((entry) => (
                <Card 
                  key={entry.id}
                  className="bg-black/40 backdrop-blur-sm border-purple-500/30 hover:border-purple-500/50 transition-all cursor-pointer"
                  onClick={() => {
                    handleEntrySelect(entry);
                    setSelectedDate(entry.date);
                    setActiveTab("write");
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-white">{entry.date.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}</CardTitle>
                      <div className="flex items-center space-x-1">
                        <span className={`flex items-center ${getSentimentColor(entry.sentiment)}`}>
                          <Star className="w-4 h-4 fill-current" />
                        </span>
                        <span className="text-sm text-gray-400">{entry.wordCount} words</span>
                      </div>
                    </div>
                    {entry.prompt && (
                      <CardDescription className="italic text-gray-400">
                        Prompt: {entry.prompt}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 line-clamp-3">{entry.content}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {entry.tags.map((tag, idx) => (
                        <Badge 
                          key={idx}
                          variant="outline"
                          className="bg-purple-900/20 text-gray-300 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-6">
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-xl text-white">Journal Insights</CardTitle>
              <CardDescription>
                Patterns and themes detected in your cosmic journaling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Common Themes</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Array.from(new Set(journalEntries.flatMap(entry => entry.themes))).map((theme, idx) => (
                    <div key={idx} className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 text-center">
                      <p className="text-purple-200">{theme}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Emotional Journey</h3>
                <div className="h-40 bg-black/30 rounded-lg p-4 flex items-center justify-center">
                  <p className="text-gray-400 italic">Visualization of your emotional patterns would appear here</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Journaling Streak</h3>
                <div className="flex items-center justify-between bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <div>
                    <p className="text-lg font-medium text-white">{journalEntries.length} Entries</p>
                    <p className="text-sm text-gray-400">Keep writing to build your streak!</p>
                  </div>
                  <Button>
                    <Download className="w-4 h-4 mr-2" />
                    Export Journal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}