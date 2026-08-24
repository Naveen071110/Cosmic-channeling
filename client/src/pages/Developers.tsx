import { useState } from 'react';
import SEO from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Code,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Bot,
  Orbit,
  BookOpen,
  FileCode,
  Cpu,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DevelopersPage() {
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    toast({
      title: 'Copied to clipboard',
      description: 'Code snippet copied successfully.',
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const curlCelestial = `curl -s https://cosmic-channeling.vercel.app/api/celestial`;
  const curlRandomQuote = `curl -s https://cosmic-channeling.vercel.app/api/quotes/random`;
  const curlApod = `curl -s https://cosmic-channeling.vercel.app/api/nasa/apod`;
  const curlMarkdown = `curl -H "Accept: text/markdown" https://cosmic-channeling.vercel.app/`;

  const tsSnippet = `// Fetch 30+ Celestial Objects with TypeScript
import type { CelestialObject } from './types';

async function fetchCelestialAtlas(): Promise<CelestialObject[]> {
  const response = await fetch('https://cosmic-channeling.vercel.app/api/celestial', {
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(\`Failed to fetch celestial atlas: \${response.statusText}\`);
  }

  const objects: CelestialObject[] = await response.json();
  console.log(\`Loaded \${objects.length} deep-space objects\`);
  return objects;
}

fetchCelestialAtlas().then(data => console.log(data[0]));`;

  const pySnippet = `# Query Celestial Telemetry with Python
import requests

def get_random_cosmic_quote():
    url = "https://cosmic-channeling.vercel.app/api/quotes/random"
    response = requests.get(url, headers={"Accept": "application/json"})
    
    if response.status_code == 200:
        quote_data = response.json()
        print(f'"{quote_data["text"]}" — {quote_data["author"]}')
        return quote_data
    else:
        raise Exception(f"API Error {response.status_code}")

if __name__ == "__main__":
    get_random_cosmic_quote()`;

  const agentSchemaSnippet = `{
  "name": "getCelestialObjectById",
  "description": "Fetch detailed astronomical telemetry, mission data, and description for a specific celestial body.",
  "parameters": {
    "type": "object",
    "required": ["id"],
    "properties": {
      "id": {
        "type": "string",
        "description": "Slug of the celestial body (e.g. 'jupiter', 'andromeda', 'carina-cliffs', 'trappist1e', 'sagittarius-a')"
      }
    }
  }
}`;

  return (
    <>
      <SEO
        title="Developer API Hub & OpenAPI 3.1 Documentation | Cosmic Channeling"
        description="Access REST and agentic endpoints for 30+ celestial bodies, NASA APOD feeds, Solfeggio soundscape parameters, and zero-shot LLM function calling."
        canonical="https://cosmic-channeling.vercel.app/developers"
      />
      <main className="container mx-auto px-4 sm:px-6 py-12 max-w-6xl space-y-12">
      {/* Hero Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-mono">
          <Cpu className="w-3.5 h-3.5 text-sky-400" />
          <span>OpenAPI 3.1 & Agentic Web Protocol</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-space text-white">
          Cosmic Channeling <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-sky-400 bg-clip-text text-transparent">Developer Hub</span>
        </h1>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          Integrate deep space telemetry, real-time Solfeggio soundscape mathematics, and astronomical observation feeds into your applications, AI agents, and LLM tool-calling workflows.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="/openapi.json"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-900 border border-purple-400/30 text-white text-xs font-mono transition-all"
          >
            <FileCode className="w-4 h-4 text-pink-400" />
            <span>OpenAPI 3.1 Spec</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
          <a
            href="/llms.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-950/60 hover:bg-sky-900/80 border border-sky-400/30 text-sky-200 text-xs font-mono transition-all"
          >
            <Bot className="w-4 h-4 text-sky-400" />
            <span>llms.txt Guide</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-mono transition-all"
          >
            <Orbit className="w-4 h-4 text-yellow-400" />
            <span>sitemap.xml</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
      </div>

      {/* Quickstart Code Snippets */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-space font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-purple-400" />
              Quickstart Code Samples
            </h2>
            <p className="text-xs text-gray-400">Zero authentication required for public exploration endpoints</p>
          </div>
        </div>

        <Tabs defaultValue="curl" className="w-full">
          <TabsList className="bg-[#1E293B] border border-white/10">
            <TabsTrigger value="curl" className="text-xs font-mono">cURL</TabsTrigger>
            <TabsTrigger value="ts" className="text-xs font-mono">TypeScript</TabsTrigger>
            <TabsTrigger value="py" className="text-xs font-mono">Python</TabsTrigger>
            <TabsTrigger value="agent" className="text-xs font-mono">LLM Tool Calling</TabsTrigger>
          </TabsList>

          <TabsContent value="curl" className="mt-4 space-y-4">
            <Card className="bg-[#0B0F19] border-purple-500/30 text-white overflow-hidden shadow-xl">
              <div className="p-4 bg-[#0F172A] border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-gray-400">cURL Terminal Commands</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(curlCelestial, 'curl')}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  {copiedCode === 'curl' ? <Check className="w-3.5 h-3.5 mr-1 text-green-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  Copy
                </Button>
              </div>
              <CardContent className="p-4 font-mono text-xs text-sky-300 space-y-3 bg-[#070A13]">
                <div>
                  <p className="text-gray-500"># 1. Fetch 30+ Celestial Atlas objects</p>
                  <p className="text-purple-300">{curlCelestial}</p>
                </div>
                <div>
                  <p className="text-gray-500"># 2. Get random inspirational quote</p>
                  <p className="text-purple-300">{curlRandomQuote}</p>
                </div>
                <div>
                  <p className="text-gray-500"># 3. Retrieve NASA Astronomy Picture of the Day</p>
                  <p className="text-purple-300">{curlApod}</p>
                </div>
                <div>
                  <p className="text-gray-500"># 4. Negotiate Markdown content (acceptmarkdown.com standard)</p>
                  <p className="text-purple-300">{curlMarkdown}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ts" className="mt-4">
            <Card className="bg-[#0B0F19] border-purple-500/30 text-white overflow-hidden shadow-xl">
              <div className="p-4 bg-[#0F172A] border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-gray-400">TypeScript / Node 18+</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(tsSnippet, 'ts')}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  {copiedCode === 'ts' ? <Check className="w-3.5 h-3.5 mr-1 text-green-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  Copy
                </Button>
              </div>
              <CardContent className="p-4 font-mono text-xs text-purple-200 bg-[#070A13] overflow-x-auto whitespace-pre">
                {tsSnippet}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="py" className="mt-4">
            <Card className="bg-[#0B0F19] border-purple-500/30 text-white overflow-hidden shadow-xl">
              <div className="p-4 bg-[#0F172A] border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-gray-400">Python 3.9+</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(pySnippet, 'py')}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  {copiedCode === 'py' ? <Check className="w-3.5 h-3.5 mr-1 text-green-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  Copy
                </Button>
              </div>
              <CardContent className="p-4 font-mono text-xs text-sky-200 bg-[#070A13] overflow-x-auto whitespace-pre">
                {pySnippet}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agent" className="mt-4">
            <Card className="bg-[#0B0F19] border-purple-500/30 text-white overflow-hidden shadow-xl">
              <div className="p-4 bg-[#0F172A] border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-gray-400">JSON Schema for OpenAI / Claude / Gemini Tools</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(agentSchemaSnippet, 'agent')}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  {copiedCode === 'agent' ? <Check className="w-3.5 h-3.5 mr-1 text-green-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  Copy
                </Button>
              </div>
              <CardContent className="p-4 font-mono text-xs text-pink-200 bg-[#070A13] overflow-x-auto whitespace-pre">
                {agentSchemaSnippet}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Core Endpoint Reference Table */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-space font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-sky-400" />
            Public API Route Index
          </h2>
          <p className="text-xs text-gray-400">All responses support ETag caching and CORS</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-[#0F172A]/90 border-[#334155] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Badge className="bg-green-950/80 text-green-300 border border-green-500/30 font-mono text-xs">GET</Badge>
              <span className="font-mono text-xs text-purple-300">operationId: getCelestialObjects</span>
            </div>
            <h3 className="font-mono text-sm text-white font-bold">/api/celestial</h3>
            <p className="text-xs text-gray-300">
              Retrieves the full array of 30+ celestial bodies including solar systems, spiral galaxies, JWST nebulae, exoplanets, and black holes with telemetry.
            </p>
          </Card>

          <Card className="bg-[#0F172A]/90 border-[#334155] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Badge className="bg-green-950/80 text-green-300 border border-green-500/30 font-mono text-xs">GET</Badge>
              <span className="font-mono text-xs text-purple-300">operationId: getCelestialObjectById</span>
            </div>
            <h3 className="font-mono text-sm text-white font-bold">/api/celestial/:id</h3>
            <p className="text-xs text-gray-300">
              Retrieves a single celestial object by its unique slug identifier (e.g. <code>jupiter</code>, <code>andromeda</code>, <code>carina-cliffs</code>).
            </p>
          </Card>

          <Card className="bg-[#0F172A]/90 border-[#334155] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Badge className="bg-green-950/80 text-green-300 border border-green-500/30 font-mono text-xs">GET</Badge>
              <span className="font-mono text-xs text-purple-300">operationId: getAstronomyPictureOfTheDay</span>
            </div>
            <h3 className="font-mono text-sm text-white font-bold">/api/nasa/apod</h3>
            <p className="text-xs text-gray-300">
              Fetches the official daily NASA Astronomy Picture of the Day with astrophysicist explanations and HD image links.
            </p>
          </Card>

          <Card className="bg-[#0F172A]/90 border-[#334155] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Badge className="bg-green-950/80 text-green-300 border border-green-500/30 font-mono text-xs">GET</Badge>
              <span className="font-mono text-xs text-purple-300">operationId: getSpaceNews</span>
            </div>
            <h3 className="font-mono text-sm text-white font-bold">/api/space-news</h3>
            <p className="text-xs text-gray-300">
              Fetches live global spaceflight news aggregated in real-time from Spaceflight News API (SNAPI v4) and space agencies.
            </p>
          </Card>
        </div>
      </section>
    </main>
    </>
  );
}
