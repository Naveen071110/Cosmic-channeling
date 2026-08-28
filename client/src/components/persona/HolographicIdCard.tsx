import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Share2,
  Telescope,
  Radio,
  Star,
  RefreshCw,
  Award,
  ExternalLink,
} from 'lucide-react';
import { CosmicPersona } from '@/lib/persona/types';
import { useToast } from '@/hooks/use-toast';
import WebGpuHologram from './WebGpuHologram';

interface HolographicIdCardProps {
  persona: CosmicPersona;
  username?: string | null;
  photoURL?: string | null;
  onRetake?: () => void;
}

export default function HolographicIdCard({
  persona,
  username = 'Cosmic Traveler',
  photoURL,
  onRetake,
}: HolographicIdCardProps) {
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [glarePos, setGlarePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const archetype = persona.archetype;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -10; // max 10 deg
    const rY = ((x - centerX) / centerX) * 10;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100),
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos({ x: 50, y: 50 });
  };

  const handleShareToX = () => {
    const text = encodeURIComponent(
      `✨ I just discovered my Celestial Persona on Cosmic Channeling: I am "${archetype.title}" (${persona.element} Element • ${persona.rulingFrequency}Hz ${archetype.frequencyName})!\n\nAlign your consciousness with the living cosmos:`
    );
    const url = encodeURIComponent('https://cosmic-channeling.vercel.app');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4">
      {/* 3D Holographic Card Container */}
      <div
        className="perspective-1000 select-none"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={cardRef}
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
            transformStyle: 'preserve-3d',
            boxShadow: `0 15px 40px rgba(0,0,0,0.8), 0 0 30px ${archetype.colorTheme.glow}`,
          }}
          className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-gradient-to-br from-[#0B0F19] via-[#151226] to-[#0B0F19] border border-purple-500/40"
        >
          {/* WebGPU Hardware-Accelerated Holographic Foil Layer (with CSS Fallback) */}
          <WebGpuHologram
            rulingFrequency={persona.rulingFrequency}
            auraHex={archetype.colorTheme.primary}
          />

          {/* Holographic Border Shimmer */}
          <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />

          {/* Header Row: Badge & Stardate */}
          <div className="relative z-10 flex items-center justify-between gap-2 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-purple-300">Cosmic Channeling</span>
                <p className="text-[11px] font-mono text-gray-400">Celestial Citizen ID</p>
              </div>
            </div>

            <Badge className={`${archetype.colorTheme.badgeBg} font-mono text-[10px] uppercase tracking-wider`}>
              {persona.stardate}
            </Badge>
          </div>

          {/* Center Info: User & Archetype */}
          <div className="relative z-10 space-y-4 my-4">
            <div className="flex items-center gap-4">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt={username || 'User avatar'}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-400/60 shadow-lg shadow-purple-950/60"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-800 to-indigo-600 border-2 border-purple-400/50 flex items-center justify-center text-xl font-bold font-space text-white shadow-lg">
                  {username ? username.substring(0, 2).toUpperCase() : 'CC'}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-mono text-gray-300 truncate">@{username}</h3>
                <h2 className="text-2xl sm:text-3xl font-space font-bold bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent truncate">
                  {archetype.title}
                </h2>
                <p className="text-xs font-space text-purple-300 truncate">{archetype.subtitle}</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 italic leading-relaxed border-l-2 border-purple-500/40 pl-3 py-0.5">
              "{archetype.tagline}"
            </p>
          </div>

          {/* Specs Grid: Element, Ruling Frequency, Patron Cosmos */}
          <div className="relative z-10 grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-xs">
            <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
              <span className="text-[9px] uppercase font-mono text-gray-400">Element</span>
              <p className="font-bold text-white flex items-center gap-1 text-xs truncate">
                <Star className="w-3 h-3 text-pink-400 shrink-0" />
                {persona.element}
              </p>
            </div>

            <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
              <span className="text-[9px] uppercase font-mono text-gray-400">Ruling Tone</span>
              <p className="font-bold text-white flex items-center gap-1 text-xs truncate">
                <Radio className="w-3 h-3 text-sky-400 shrink-0" />
                {persona.rulingFrequency} Hz
              </p>
            </div>

            <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
              <span className="text-[9px] uppercase font-mono text-gray-400">Patron Body</span>
              <p className="font-bold text-white flex items-center gap-1 text-xs truncate">
                <Telescope className="w-3 h-3 text-yellow-400 shrink-0" />
                {archetype.patronCelestialBody.split('(')[0]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions: Share to X & Retake */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Button
          onClick={handleShareToX}
          className="flex-1 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs h-9 shadow-md"
        >
          <Share2 className="w-3.5 h-3.5 mr-1.5" />
          Share ID to X (Twitter)
        </Button>

        {onRetake && (
          <Button
            variant="outline"
            onClick={onRetake}
            className="border-purple-500/30 hover:bg-purple-950/40 text-purple-300 text-xs h-9"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Retake Alignment Quiz
          </Button>
        )}
      </div>
    </div>
  );
}
