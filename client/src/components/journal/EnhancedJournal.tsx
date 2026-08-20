import { useState, useEffect, useMemo } from "react";
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
  Lock,
  LogIn,
  CheckCircle2,
  Trash2
} from "lucide-react";
import LoginDialog from "@/components/ui/LoginDialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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

export default function EnhancedJournal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showLoginDialog, setShowLoginDialog] = useState<boolean>(false);
  const [loginDialogContext, setLoginDialogContext] = useState<'entries' | 'view' | 'save'>('entries');
  const [activeTab, setActiveTab] = useState<string>("write");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [journalContent, setJournalContent] = useState<string>("");
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState<string>("");
  const [selectedPrompt, setSelectedPrompt] = useState<JournalPrompt | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load journal entries when user is logged in
  useEffect(() => {
    if (user) {
      const fetchEntries = async () => {
        try {
          const res = await apiRequest("GET", "/api/journal-entries");
          if (res.ok) {
            const rawEntries: any = await res.json();
            const formatted: JournalEntry[] = (Array.isArray(rawEntries) ? rawEntries : []).map((e: any) => ({
              id: String(e.id),
              date: new Date(e.createdAt || Date.now()),
              content: e.text || "",
              tags: e.tags || [],
              sentiment: 0.5,
              wordCount: (e.text || "").split(/\s+/).filter(Boolean).length,
              themes: ["Cosmic Reflection", "Mindfulness"],
            }));
            setJournalEntries(formatted);
            return;
          }
        } catch (err) {
          console.warn("Failed to fetch server journal entries, reading local storage:", err);
        }

        // Local storage fallback for this user
        const local = localStorage.getItem(`cosmic_journal_${user.id}`);
        if (local) {
          try {
            const parsed = JSON.parse(local);
            setJournalEntries(parsed.map((e: any) => ({ ...e, date: new Date(e.date) })));
          } catch (e) {
            // ignore
          }
        }
      };

      fetchEntries();
    } else {
      setJournalEntries([]);
    }
  }, [user]);

  // Handle tab changes and enforce login protection
  const handleTabChange = (value: string) => {
    if ((value === 'entries' || value === 'insights') && !user) {
      setLoginDialogContext('view');
      setShowLoginDialog(true);
      return;
    }
    setActiveTab(value);
  };

  // Get available journal entries for the selected date
  const entriesForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return journalEntries.filter(entry => 
      entry.date.getDate() === selectedDate.getDate() &&
      entry.date.getMonth() === selectedDate.getMonth() &&
      entry.date.getFullYear() === selectedDate.getFullYear()
    );
  }, [journalEntries, selectedDate]);

  // Handle date selection
  useEffect(() => {
    if (entriesForSelectedDate.length > 0) {
      setSelectedEntry(entriesForSelectedDate[0]);
      setJournalContent(entriesForSelectedDate[0].content);
      setCurrentTags(entriesForSelectedDate[0].tags);
    } else {
      setSelectedEntry(null);
      setJournalContent("");
      setCurrentTags([]);
    }
  }, [selectedDate, entriesForSelectedDate]);

  // Handle journal entry selection
  const handleEntrySelect = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setJournalContent(entry.content);
    setCurrentTags(entry.tags);
    setActiveTab("write");
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
  const handleSaveEntry = async () => {
    if (!user) {
      setLoginDialogContext('save');
      setShowLoginDialog(true);
      return;
    }

    if (!journalContent.trim()) {
      toast({
        title: "Empty Reflection",
        description: "Please write some cosmic reflections before saving.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    const wordCount = journalContent.trim().split(/\s+/).filter(Boolean).length;
    const sentiment = Math.random() * 2 - 1; // Between -1 and 1
    const possibleThemes = ["cosmic connection", "meditation", "self-discovery", "existential questions", "purpose", "perspective", "synchronicity", "celestial influence"];
    const themes = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
      possibleThemes[Math.floor(Math.random() * possibleThemes.length)]
    );

    const newEntry: JournalEntry = {
      id: selectedEntry?.id || String(Date.now()),
      date: selectedDate || new Date(),
      content: journalContent,
      tags: currentTags,
      prompt: selectedPrompt?.text,
      sentiment,
      wordCount,
      themes,
    };

    try {
      // Save to backend API
      await apiRequest("POST", "/api/journal-entries", {
        text: journalContent,
        tags: currentTags,
      });

      // Update state
      const updatedList = selectedEntry
        ? journalEntries.map(e => (e.id === selectedEntry.id ? newEntry : e))
        : [newEntry, ...journalEntries];

      setJournalEntries(updatedList);
      setSelectedEntry(newEntry);

      // Persist to local storage
      localStorage.setItem(`cosmic_journal_${user.id}`, JSON.stringify(updatedList));

      toast({
        title: "Reflection Saved",
        description: "Your journal entry has been safely recorded in the cosmic archives.",
      });
    } catch (error) {
      console.error("Error saving journal entry:", error);
      // Still persist locally
      const updatedList = [newEntry, ...journalEntries];
      setJournalEntries(updatedList);
      localStorage.setItem(`cosmic_journal_${user.id}`, JSON.stringify(updatedList));
      
      toast({
        title: "Saved Locally",
        description: "Your entry is saved on this device.",
      });
    } finally {
      setIsSaving(false);
    }
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
      setJournalContent(journalContent ? `${journalContent}\n\n${prompt.text}\n` : `${prompt.text}\n\n`);
    }
  };

  // Export journal entries to Markdown file
  const handleExportJournal = () => {
    if (journalEntries.length === 0) {
      toast({
        title: "No Entries to Export",
        description: "You haven't recorded any journal entries yet.",
        variant: "destructive"
      });
      return;
    }

    const mdContent = `# Cosmic Journal Reflections\n\nAuthor: ${user?.username || 'Cosmic Traveler'}\nExported: ${new Date().toLocaleDateString()}\n\n---\n\n` +
      journalEntries.map(e => (
        `### ${e.date.toLocaleDateString()}\n\n${e.prompt ? `*Prompt: ${e.prompt}*\n\n` : ''}${e.content}\n\nTags: ${e.tags.map(t => `#${t}`).join(' ')}\n\n---\n`
      )).join('\n');

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cosmic-journal-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Journal Exported",
      description: "Downloaded your reflections as Markdown document.",
    });
  };

  return (
    <div className="container max-w-6xl mx-auto px-4">
      {/* Auth Banner Prompt for Unauthenticated Users */}
      {!user && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-950/60 via-[#1E1B4B]/80 to-sky-950/60 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Private Cosmic Reflections</p>
              <p className="text-xs text-gray-300">Sign in to save your reflections and access your personal history across devices.</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => { setLoginDialogContext('save'); setShowLoginDialog(true); }}
            className="bg-gradient-to-r from-[#7E22CE] to-[#EC4899] text-white text-xs h-8 px-4 shrink-0"
          >
            <LogIn className="w-3.5 h-3.5 mr-1.5" />
            Sign In / Register
          </Button>
        </div>
      )}

      {/* Login Dialog */}
      <LoginDialog 
        isOpen={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)}
        title={loginDialogContext === 'save' 
          ? "Sign in to save your reflection" 
          : "Sign in to view your journal" 
        }
        description={loginDialogContext === 'save' 
          ? "Create a free cosmic account or sign in to save and sync your reflections securely." 
          : "Sign in to access your private entries and emotional insights." 
        }
      />
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8 bg-[#1E293B] border border-white/10">
          <TabsTrigger value="write">
            <FileText className="w-4 h-4 mr-2" />
            Write Reflection
          </TabsTrigger>
          <TabsTrigger value="entries">
            <Book className="w-4 h-4 mr-2" />
            Past Entries {!user && <Lock className="w-3 h-3 ml-1.5 text-gray-400" />}
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Sparkles className="w-4 h-4 mr-2" />
            Insights {!user && <Lock className="w-3 h-3 ml-1.5 text-gray-400" />}
          </TabsTrigger>
        </TabsList>
        
        {/* Write Tab */}
        <TabsContent value="write" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Writing Area */}
            <div className="md:col-span-2 space-y-4">
              <Card className="bg-[#0F172A]/90 border-[#334155] shadow-lg">
                <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-white/5">
                  <div>
                    <CardTitle className="text-xl font-space text-white">
                      {selectedEntry ? "Edit Cosmic Reflection" : "New Cosmic Reflection"}
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-400">
                      {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </CardDescription>
                  </div>
                  {selectedEntry && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleNewEntry}
                      className="text-xs border-white/10 hover:bg-white/5"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      New Entry
                    </Button>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4 pt-4">
                  {selectedPrompt && (
                    <div className="bg-purple-950/40 border border-purple-500/30 rounded-lg p-3 text-xs text-purple-200">
                      <p className="font-semibold mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        Prompt:
                      </p>
                      <p>{selectedPrompt.text}</p>
                    </div>
                  )}
                  
                  <Textarea 
                    placeholder="Channel your cosmic thoughts, dreams, synchronicities, or quiet realizations..."
                    value={journalContent}
                    onChange={(e) => setJournalContent(e.target.value)}
                    className="min-h-[260px] bg-[#020617]/70 border-[#334155] text-gray-100 placeholder:text-gray-500 focus:border-purple-500 leading-relaxed text-sm"
                  />
                  
                  {/* Tags */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                      {currentTags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary"
                          className="bg-purple-900/40 hover:bg-purple-900/60 text-purple-200 border border-purple-500/30 text-xs cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          #{tag} &times;
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="Add a cosmic tag (e.g. #lucid-dream)..."
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                        className="text-xs bg-[#020617]/70 border border-[#334155] rounded-md px-3 py-1.5 text-gray-200 placeholder:text-gray-500 flex-1 focus:outline-none focus:border-purple-500"
                      />
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline" 
                        onClick={handleAddTag}
                        className="text-xs border-white/10 text-gray-300 hover:bg-white/5"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        Add Tag
                      </Button>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between border-t border-white/5 pt-4">
                  <div className="text-xs text-gray-400">
                    {journalContent.trim().split(/\s+/).filter(Boolean).length} words
                  </div>
                  
                  <Button 
                    onClick={handleSaveEntry}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-[#7E22CE] to-[#EC4899] hover:opacity-90 text-white text-xs h-9 px-5"
                  >
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                    {isSaving ? "Archiving..." : user ? "Save Reflection" : "Sign In & Save"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Sidebar: Calendar & Inspiration */}
            <div className="space-y-4">
              <Card className="bg-[#0F172A]/90 border-[#334155]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-space text-white flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-sky-400" />
                    Cosmic Date
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border border-white/5 text-white"
                  />
                </CardContent>
              </Card>
              
              <Card className="bg-[#0F172A]/90 border-[#334155]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-space text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Contemplation Prompts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {samplePrompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={() => handlePromptSelect(prompt.id)}
                      className="w-full text-left text-xs p-2.5 rounded-lg bg-white/5 hover:bg-purple-900/30 text-gray-300 hover:text-white transition-all border border-transparent hover:border-purple-500/30"
                    >
                      {prompt.text}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Past Entries Tab */}
        <TabsContent value="entries" className="space-y-6">
          <Card className="bg-[#0F172A]/90 border-[#334155]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-space text-white">Your Cosmic Journal Archive</CardTitle>
                <CardDescription className="text-xs text-gray-400">
                  {journalEntries.length} recorded cosmic reflections
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportJournal}
                className="text-xs border-white/10 text-gray-300 hover:bg-white/5"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export Journal
              </Button>
            </CardHeader>
            <CardContent>
              {journalEntries.length === 0 ? (
                <div className="text-center py-12">
                  <Book className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-300 text-sm mb-1">No reflections recorded yet</p>
                  <p className="text-xs text-gray-500 mb-4">Start recording your thoughts, dreams, and cosmic insights.</p>
                  <Button 
                    size="sm" 
                    onClick={() => setActiveTab("write")}
                    className="bg-purple-600 hover:bg-purple-700 text-xs"
                  >
                    Write First Reflection
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {journalEntries.map((entry) => (
                    <div 
                      key={entry.id}
                      onClick={() => handleEntrySelect(entry)}
                      className="p-4 rounded-xl bg-[#1E293B]/80 hover:bg-[#1E293B] border border-white/5 hover:border-purple-500/40 transition-all cursor-pointer space-y-2"
                    >
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span className="font-mono text-purple-300">
                          {entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span>{entry.wordCount} words</span>
                      </div>
                      <p className="text-xs text-gray-200 line-clamp-3 leading-relaxed">
                        {entry.content}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {entry.tags.map((t, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/20">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card className="bg-[#0F172A]/90 border-[#334155]">
            <CardHeader>
              <CardTitle className="text-xl font-space text-white">Journal Insights & Patterns</CardTitle>
              <CardDescription className="text-xs text-gray-400">
                Consciousness metrics and themes detected in your cosmic writing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-space font-bold text-white mb-1">{journalEntries.length}</p>
                  <p className="text-xs text-purple-300 uppercase tracking-wider">Reflections Recorded</p>
                </div>
                <div className="bg-sky-950/40 border border-sky-500/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-space font-bold text-white mb-1">
                    {journalEntries.reduce((acc, curr) => acc + curr.wordCount, 0)}
                  </p>
                  <p className="text-xs text-sky-300 uppercase tracking-wider">Total Words Channeled</p>
                </div>
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-space font-bold text-white mb-1">
                    {new Set(journalEntries.flatMap(e => e.tags)).size}
                  </p>
                  <p className="text-xs text-emerald-300 uppercase tracking-wider">Unique Themes</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-space font-medium text-white mb-3">Recurring Consciousness Themes</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(journalEntries.flatMap(e => e.tags))).length > 0 ? (
                    Array.from(new Set(journalEntries.flatMap(e => e.tags))).map((theme, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-purple-950/40 text-purple-200 border-purple-500/30 px-3 py-1">
                        #{theme}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 italic">Write and tag reflections to generate themes.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}