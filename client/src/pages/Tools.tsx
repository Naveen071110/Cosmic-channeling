import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DreamInterpreter from '@/components/tools/DreamInterpreter';
import CosmicSignals from '@/components/tools/CosmicSignals';
import { Sparkles, Moon, Star, Compass } from 'lucide-react';

export default function Tools() {
  const [activeTab, setActiveTab] = useState('dreams');
  
  return (
    <main className="container mx-auto px-4 py-8">
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-space">
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Cosmic Tools
            </span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Explore our collection of tools designed to deepen your cosmic understanding and 
            enhance your spiritual journey through the universe.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="dreams" className="flex items-center justify-center">
              <Moon className="mr-2 h-4 w-4" />
              Dream Interpreter
            </TabsTrigger>
            <TabsTrigger value="signals" className="flex items-center justify-center">
              <Sparkles className="mr-2 h-4 w-4" />
              Cosmic Signals
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dreams">
            <DreamInterpreter />
          </TabsContent>
          
          <TabsContent value="signals">
            <CosmicSignals />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}