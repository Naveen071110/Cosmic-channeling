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
    <section id="faq" className="space-y-10 max-w-4xl mx-auto px-4" aria-labelledby="faq-heading">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-slate-300 text-xs font-mono">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 id="faq-heading" className="text-2xl sm:text-3xl md:text-4xl font-semibold font-space text-[#F8FAFC] tracking-tight">
          Astrophysics &amp; Meditation FAQs
        </h2>
        <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-lg mx-auto font-normal">
          Everything you need to know about our Solfeggio soundscapes, Celestial Atlas telemetry, and deep space sanctuary.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <Card
              key={index}
              className={`bg-white/[0.02] border transition-all duration-200 overflow-hidden rounded-2xl shadow-none ${
                isOpen ? 'border-white/20 bg-white/[0.03]' : 'border-white/[0.06] hover:border-white/15'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleIndex(index)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30 cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="font-space font-medium text-sm sm:text-base text-[#F8FAFC] flex items-center gap-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <CardContent className="px-5 sm:px-6 pb-6 pt-0 text-sm text-[#94A3B8] leading-relaxed border-t border-white/[0.06] mt-1 pt-4">
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
