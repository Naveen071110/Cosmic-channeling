import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "What is Cosmic Channeling?",
    answer: "Cosmic Channeling is an edge-deployed astronomical and mindfulness sanctuary that bridges astrophysics with meditation. It features procedural Solfeggio soundscapes, an interactive 30+ Celestial Atlas, real-time NASA observation feeds, and an OpenAPI developer API.",
  },
  {
    question: "What are 432 Hz and 528 Hz Solfeggio frequencies used for?",
    answer: "432 Hz is a sacred harmonic frequency associated with deep relaxation, natural resonance, and mental clarity. 528 Hz is the Solfeggio frequency associated with cellular vitality, emotional transformation, and DNA repair. Both are generated procedurally in your browser via the Web Audio API without streaming lag.",
  },
  {
    question: "How does the 30+ HD Celestial Atlas work?",
    answer: "The Celestial Atlas features 30+ high-definition astronomical bodies spanning the Solar System, deep galaxies (Andromeda, Whirlpool), JWST nebulae (Carina Cliffs, Pillars of Creation), habitable exoplanets (TRAPPIST-1e), and supermassive black holes with scientific telemetry and general-relativistic raymarching simulations.",
  },
  {
    question: "How does the Web Audio procedural synthesizer generate sound?",
    answer: "The procedural synthesizer uses the browser's native Web Audio API to synthesize pure harmonic sine waves in real time. It generates custom 432Hz and 528Hz carriers, 6Hz Theta binaural beat carriers, and physical Tibetan singing bowl acoustics on-device with zero server streaming latency.",
  },
  {
    question: "Is Cosmic Channeling free to use?",
    answer: "Yes, Cosmic Channeling is completely free to use for celestial exploration, guided journeys, soundscape meditation, and public astronomical data.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="my-16 max-w-4xl mx-auto px-4" aria-labelledby="faq-heading">
      <div className="text-center mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-mono">
          <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 id="faq-heading" className="text-2xl sm:text-3xl font-bold font-space text-white">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-sky-400 bg-clip-text text-transparent">
            Astrophysics &amp; Meditation FAQs
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto">
          Everything you need to know about our Solfeggio soundscapes, Celestial Atlas telemetry, and deep space sanctuary.
        </p>
      </div>

      <div className="space-y-3.5">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <Card
              key={index}
              className={`bg-[#0F172A]/90 border transition-all duration-200 overflow-hidden ${
                isOpen ? 'border-purple-500/50 shadow-lg shadow-purple-950/40' : 'border-[#334155]/70 hover:border-[#334155]'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleIndex(index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                aria-expanded={isOpen}
              >
                <span className="font-space font-medium text-sm sm:text-base text-white flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-purple-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <CardContent className="px-5 pb-5 pt-0 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5 mt-1 pt-3">
                  <p>{faq.answer}</p>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
