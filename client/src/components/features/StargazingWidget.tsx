import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Moon,
  Sun,
  Eye,
  Cloud,
  Wind,
  Compass,
  MapPin,
  RefreshCw,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface StargazingData {
  clarityScore: number;
  qualityRating: string;
  advice: string;
  current: {
    cloudCover: number;
    humidity: number;
    windSpeedKmh: number;
    temperatureC: number;
  };
  location: {
    lat: number;
    lng: number;
    timezone?: string;
  };
  isFallback?: boolean;
}

interface SolarLunarData {
  solar: {
    sunrise: string;
    sunset: string;
    solarNoon: string;
    dayLengthFormatted: string;
    civilTwilight: { begin: string; end: string };
    nauticalTwilight: { begin: string; end: string };
    astronomicalTwilight: { begin: string; end: string };
  };
  lunar: {
    phaseIndex: number;
    phaseName: string;
    emoji: string;
    theme: string;
    illuminationPercent: number;
    ageDays: number;
  };
  location: { lat: number; lng: number };
  isFallback?: boolean;
}

export default function StargazingWidget() {
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 28.61,
    lng: 77.2,
  });
  const [locName, setLocName] = useState<string>('Local Cosmic Horizon');
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Request browser geolocation once on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: Math.round(pos.coords.latitude * 100) / 100,
            lng: Math.round(pos.coords.longitude * 100) / 100,
          });
          setLocName('Your Celestial Coordinates');
          setIsLocating(false);
        },
        (err) => {
          console.log('Geolocation permission denied or unavailable, using standard baseline:', err.message);
          setIsLocating(false);
        },
        { timeout: 5000 }
      );
    }
  }, []);

  // Fetch Stargazing Clarity Forecast
  const {
    data: stargazing,
    isLoading: isLoadingSky,
    refetch: refetchSky,
    isFetching: isFetchingSky,
  } = useQuery<StargazingData>({
    queryKey: [`/api/stargazing-forecast?lat=${coords.lat}&lng=${coords.lng}`],
    staleTime: 1000 * 60 * 30, // 30 mins
  });

  // Fetch Solar & Lunar Cycles
  const {
    data: cycles,
    isLoading: isLoadingCycles,
    refetch: refetchCycles,
  } = useQuery<SolarLunarData>({
    queryKey: [`/api/solar-cycles?lat=${coords.lat}&lng=${coords.lng}`],
    staleTime: 1000 * 60 * 60 * 6, // 6 hours
  });

  const formatTime = (isoString?: string) => {
    if (!isoString) return '--:--';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '--:--';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30';
    if (score >= 60) return 'text-sky-400 border-sky-500/40 bg-sky-950/30';
    if (score >= 40) return 'text-amber-400 border-amber-500/40 bg-amber-950/30';
    return 'text-rose-400 border-rose-500/40 bg-rose-950/30';
  };

  const score = stargazing?.clarityScore ?? 80;
  const lunar = cycles?.lunar;
  const solar = cycles?.solar;

  return (
    <Card className="bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#0A0F1D] border-[#1E293B] shadow-xl overflow-hidden">
      <CardHeader className="pb-4 border-b border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#0EA5E9]" />
              <CardTitle className="text-xl font-bold font-space text-white">
                Live Cosmic Stargazing & Solar Alignment
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
              <MapPin className="h-3.5 w-3.5 text-purple-400" />
              {isLocating ? 'Acquiring coordinates...' : `${locName} (${coords.lat}°, ${coords.lng}°)`}
            </CardDescription>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              refetchSky();
              refetchCycles();
            }}
            disabled={isFetchingSky}
            className="text-xs text-gray-400 hover:text-white self-start sm:self-auto h-8 px-2.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isFetchingSky ? 'animate-spin' : ''}`} />
            Live Sync
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Stargazing Index Gauge */}
          <div className="flex flex-col justify-between p-5 rounded-xl bg-black/40 border border-white/5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Night Sky Clarity
              </span>
              <Eye className="h-4 w-4 text-[#0EA5E9]" />
            </div>

            <div className="my-4 flex items-baseline gap-3">
              <div className="text-5xl font-black font-space bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
                {isLoadingSky ? '--' : score}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium">/ 100 Index</span>
                <Badge className={`text-xs px-2 py-0.5 mt-1 border ${getScoreColor(score)}`}>
                  {stargazing?.qualityRating || 'Calculating...'}
                </Badge>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              {stargazing?.advice ||
                'Clear atmospheric stability projected. Ideal for tracking constellations and planetary alignments.'}
            </p>

            {/* Quick atmospheric stats */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/5 text-center text-xs text-gray-400">
              <div>
                <div className="flex items-center justify-center gap-1 text-gray-500 mb-0.5">
                  <Cloud className="h-3 w-3" />
                  <span>Cloud</span>
                </div>
                <span className="font-semibold text-white">
                  {stargazing?.current?.cloudCover ?? 15}%
                </span>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-gray-500 mb-0.5">
                  <Wind className="h-3 w-3" />
                  <span>Wind</span>
                </div>
                <span className="font-semibold text-white">
                  {stargazing?.current?.windSpeedKmh ?? 8} km/h
                </span>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-gray-500 mb-0.5">
                  <Compass className="h-3 w-3" />
                  <span>Temp</span>
                </div>
                <span className="font-semibold text-white">
                  {stargazing?.current?.temperatureC ?? 19}°C
                </span>
              </div>
            </div>
          </div>

          {/* 2. Lunar Phase & Illumination */}
          <div className="flex flex-col justify-between p-5 rounded-xl bg-black/40 border border-white/5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Current Lunar Phase
              </span>
              <Moon className="h-4 w-4 text-purple-400" />
            </div>

            <div className="my-4 flex items-center gap-4">
              <div className="text-4xl filter drop-shadow-[0_0_12px_rgba(236,72,153,0.4)]">
                {lunar?.emoji || '🌕'}
              </div>
              <div>
                <h4 className="text-lg font-bold font-space text-white">
                  {lunar?.phaseName || 'Full Moon'}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs text-purple-300 border-purple-500/30">
                    {lunar?.illuminationPercent ?? 98}% Illuminated
                  </Badge>
                  <span className="text-xs text-gray-500">Day {lunar?.ageDays ?? 14}</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-500/20">
              <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider block mb-1">
                Cosmic Spiritual Energy
              </span>
              <p className="text-xs text-gray-200 italic">
                "{lunar?.theme || 'Enhanced intuition, spiritual awareness & manifestation'}"
              </p>
            </div>
          </div>

          {/* 3. Solar & Deep Sky Twilight Windows */}
          <div className="flex flex-col justify-between p-5 rounded-xl bg-black/40 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Celestial Alignment Windows
              </span>
              <Sun className="h-4 w-4 text-amber-400" />
            </div>

            <div className="space-y-2.5 my-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-white/[0.03]">
                <div className="flex items-center gap-2 text-amber-300">
                  <Sun className="h-3.5 w-3.5" />
                  <span>Sunrise / Sunset</span>
                </div>
                <span className="font-mono text-white font-medium">
                  {formatTime(solar?.sunrise)} • {formatTime(solar?.sunset)}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-white/[0.03]">
                <div className="flex items-center gap-2 text-sky-300">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Dusk Meditation Window</span>
                </div>
                <span className="font-mono text-white font-medium">
                  {formatTime(solar?.civilTwilight?.begin)} - {formatTime(solar?.civilTwilight?.end)}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-white/[0.03]">
                <div className="flex items-center gap-2 text-purple-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Deep Dark Sky (Astro)</span>
                </div>
                <span className="font-mono text-white font-medium">
                  {formatTime(solar?.astronomicalTwilight?.end)} onwards
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
              <span>
                Solar Day Length: <strong className="text-white">{solar?.dayLengthFormatted || '12h 30m'}</strong>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
