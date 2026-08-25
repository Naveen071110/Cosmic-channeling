import { useState } from 'react';
import SEO from '@/components/SEO';
import { useAuth } from '@/hooks/use-auth';
import { useCosmicPersona } from '@/lib/persona/storage';
import HolographicIdCard from '@/components/persona/HolographicIdCard';
import LiveAlignmentCard from '@/components/persona/LiveAlignmentCard';
import CosmicRadarChart from '@/components/persona/CosmicRadarChart';
import CosmicPersonaModal from '@/components/persona/CosmicPersonaModal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Telescope,
  Radio,
  BookOpen,
  LogOut,
  User,
  Clock,
  Compass,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import { useLocation } from 'wouter';

export default function Profile() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { persona, hasPersona } = useCosmicPersona(user?.uid);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    setLocation('/');
  };

  return (
    <>
      <SEO
        title="My Celestial Persona & Cosmic Alignment | Cosmic Channeling"
        description="View your personalized celestial archetype, real-time astronomical alignment score, 5-dimension resonance matrix, and tailored meditation soundscapes."
        canonical="https://cosmic-channeling.vercel.app/profile"
      />

      <main className="container mx-auto px-4 sm:px-6 py-8 md:py-12 max-w-6xl space-y-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Cosmic Sanctuary Profile</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-space font-bold text-white">
              {user ? (
                <>
                  Greetings,{' '}
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-sky-400 bg-clip-text text-transparent">
                    {user.username}
                  </span>
                </>
              ) : (
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-sky-400 bg-clip-text text-transparent">
                  Celestial Traveler
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300">
              {hasPersona
                ? `Your consciousness is currently aligned as "${persona?.archetype.title}" (${persona?.element} Element).`
                : 'Complete your 5-step cosmic onboarding assessment to reveal your celestial archetype.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs h-9"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Sign Out
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => setLocation('/auth')}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-9"
              >
                <User className="w-3.5 h-3.5 mr-1.5" />
                Sign In to Save
              </Button>
            )}
          </div>
        </div>

        {/* Persona Section */}
        {hasPersona && persona ? (
          <div className="space-y-10">
            {/* Top Grid: Holographic ID Card & Live Alignment */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5">
                <HolographicIdCard
                  persona={persona}
                  username={user?.username || 'Cosmic Explorer'}
                  photoURL={user?.photoURL}
                  onRetake={() => setModalOpen(true)}
                />
              </div>

              <div className="lg:col-span-7">
                <LiveAlignmentCard persona={persona} />
              </div>
            </div>

            {/* Middle Grid: 5-Dimension Radar Chart & Journey Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7">
                <CosmicRadarChart persona={persona} />
              </div>

              <div className="lg:col-span-5 space-y-6">
                {/* Journey Stats Card */}
                <Card className="bg-[#0F172A]/90 border-purple-500/30 p-6 space-y-5 shadow-xl backdrop-blur-xl">
                  <CardHeader className="p-0">
                    <CardTitle className="text-base font-space font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-sky-400" />
                      Sanctuary Journey Milestones
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-0 space-y-3.5">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-900/60 border border-purple-400/30 flex items-center justify-center text-purple-300">
                          <Radio className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">Meditation Soundscape</p>
                          <p className="text-[11px] text-gray-400 font-mono">Default: {persona.rulingFrequency} Hz</p>
                        </div>
                      </div>
                      <Badge className="bg-purple-950/80 text-purple-200 border-purple-500/30 font-mono text-[10px]">
                        Active
                      </Badge>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sky-900/60 border border-sky-400/30 flex items-center justify-center text-sky-300">
                          <Telescope className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">Celestial Atlas</p>
                          <p className="text-[11px] text-gray-400 font-mono">30+ Verified Space Objects</p>
                        </div>
                      </div>
                      <Badge className="bg-sky-950/80 text-sky-200 border-sky-500/30 font-mono text-[10px]">
                        Unlocked
                      </Badge>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-900/60 border border-teal-400/30 flex items-center justify-center text-teal-300">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">Astro-Journal</p>
                          <p className="text-[11px] text-gray-400 font-mono">Cloud Synchronized</p>
                        </div>
                      </div>
                      <Badge className="bg-teal-950/80 text-teal-200 border-teal-500/30 font-mono text-[10px]">
                        Ready
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Navigation Card */}
                <Card className="bg-[#0F172A]/90 border-[#334155] p-5 space-y-3">
                  <h4 className="text-xs font-space font-bold text-white flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-pink-400" />
                    Quick Sanctuary Portals
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLocation('/meditate')}
                      className="border-white/10 hover:bg-white/5 text-gray-200 justify-start"
                    >
                      <Radio className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
                      Meditate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLocation('/explore')}
                      className="border-white/10 hover:bg-white/5 text-gray-200 justify-start"
                    >
                      <Telescope className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
                      Explore Atlas
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLocation('/tools')}
                      className="border-white/10 hover:bg-white/5 text-gray-200 justify-start"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5 text-yellow-400" />
                      Cosmic Tools
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLocation('/journal')}
                      className="border-white/10 hover:bg-white/5 text-gray-200 justify-start"
                    >
                      <BookOpen className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
                      Astro-Journal
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State: Prompting Questionnaire */
          <Card className="bg-[#0F172A]/90 border-purple-500/40 p-8 sm:p-12 text-center space-y-6 shadow-2xl backdrop-blur-xl max-w-2xl mx-auto my-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-sky-400 flex items-center justify-center mx-auto text-white shadow-[0_0_35px_rgba(168,85,247,0.5)] animate-float">
              <Sparkles className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-space font-bold text-white">
                Discover Your Cosmic Identity
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
                Take our curated 5-step celestial alignment assessment to reveal your archetype, calculate your 5-dimension resonance matrix, and unlock auto-tuned Solfeggio soundscapes.
              </p>
            </div>

            <div className="pt-2">
              <Button
                onClick={() => setModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-sky-500 hover:opacity-95 text-white font-semibold text-xs sm:text-sm h-11 px-8 shadow-xl shadow-purple-950/80"
              >
                Begin 5-Step Celestial Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {/* Assessment Questionnaire Modal */}
        <CosmicPersonaModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          userId={user?.uid}
        />
      </main>
    </>
  );
}
