import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DimensionScores, CosmicPersona } from '@/lib/persona/types';
import { Sparkles, Brain, Compass, Flame, Heart, Orbit, Award } from 'lucide-react';

interface CosmicRadarChartProps {
  persona: CosmicPersona;
}

interface DimensionItem {
  key: keyof DimensionScores;
  label: string;
  sublabel: string;
  icon: any;
  color: string;
  barColor: string;
}

const DIMENSION_CONFIG: DimensionItem[] = [
  {
    key: 'intuition',
    label: 'Intuitive Coherence',
    sublabel: 'Subconscious lucidity, dream decoding & instinctual guidance',
    icon: Brain,
    color: 'text-purple-400',
    barColor: 'bg-purple-500',
  },
  {
    key: 'curiosity',
    label: 'Astrophysical Curiosity',
    sublabel: 'Deep space exploration, spacetime laws & intellectual wonder',
    icon: Compass,
    color: 'text-sky-400',
    barColor: 'bg-sky-500',
  },
  {
    key: 'vitality',
    label: 'Solar Vitality',
    sublabel: 'Creative drive, manifestation momentum & energetic courage',
    icon: Flame,
    color: 'text-amber-400',
    barColor: 'bg-amber-500',
  },
  {
    key: 'harmony',
    label: 'Lunar Equilibrium',
    sublabel: 'Relational balance, tidal cycles & gentle grounding',
    icon: Heart,
    color: 'text-teal-400',
    barColor: 'bg-teal-500',
  },
  {
    key: 'transcendence',
    label: 'Crown Consciousness',
    sublabel: 'Quantum interconnectedness, stillness & macrocosmic unity',
    icon: Orbit,
    color: 'text-pink-400',
    barColor: 'bg-pink-500',
  },
];

export default function CosmicRadarChart({ persona }: CosmicRadarChartProps) {
  const { dimensions, archetype } = persona;

  return (
    <Card className="bg-[#0F172A]/90 border-purple-500/30 p-6 space-y-6 shadow-xl backdrop-blur-xl">
      <CardHeader className="p-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-space font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            5-Dimension Celestial Resonance
          </CardTitle>
          <Badge className="bg-purple-950/80 text-purple-300 border-purple-500/30 font-mono text-[11px]">
            Active Alignment Matrix
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-5">
        {DIMENSION_CONFIG.map((dim) => {
          const score = dimensions[dim.key] || 50;
          const Icon = dim.icon;

          return (
            <div key={dim.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${dim.color} shrink-0`} />
                  <span className="font-semibold text-white">{dim.label}</span>
                </div>
                <span className="font-mono font-bold text-gray-200">{score} / 100</span>
              </div>

              <div className="relative h-2 w-full bg-[#1E293B] rounded-full overflow-hidden">
                <div
                  className={`h-full ${dim.barColor} transition-all duration-1000 rounded-full shadow-[0_0_10px_currentColor]`}
                  style={{ width: `${score}%` }}
                />
              </div>

              <p className="text-[10px] text-gray-400 leading-tight">{dim.sublabel}</p>
            </div>
          );
        })}

        {/* Spiritual Gifts & Innate Powers */}
        <div className="pt-4 border-t border-white/5 space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-yellow-400" />
            Archetype Spiritual Gifts &amp; Superpowers
          </h4>
          <div className="flex flex-wrap gap-2">
            {archetype.spiritualGifts.map((gift, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-purple-200 transition-colors"
              >
                ✨ {gift}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
