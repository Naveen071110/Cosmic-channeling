import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { User as UserIcon, LogOut, LogIn } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const isActive = (path: string) => location === path;

  return (
    <>
      <header className="py-4 px-6 flex justify-between items-center border-b border-white/[0.08] bg-[#090A0F]/80 backdrop-blur-md sticky top-0 z-40">
        <Link href="/" className="flex items-center space-x-3 cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
            <i className="ri-planet-line text-lg text-[#F8FAFC]"></i>
          </div>
          <span className="text-lg font-space font-semibold text-[#F8FAFC] tracking-tight">
            Cosmic Channeling
          </span>
        </Link>
        
        <nav className="hidden lg:flex space-x-7">
          <Link href="/" className={`text-sm transition-colors ${isActive('/') ? 'text-white font-medium' : 'text-[#94A3B8] hover:text-white'}`}>
            Home
          </Link>
          <Link href="/meditate" className={`text-sm transition-colors ${isActive('/meditate') ? 'text-white font-medium' : 'text-[#94A3B8] hover:text-white'}`}>
            Meditate
          </Link>
          <Link href="/explore" className={`text-sm transition-colors ${isActive('/explore') ? 'text-white font-medium' : 'text-[#94A3B8] hover:text-white'}`}>
            Explore
          </Link>
          <Link href="/journal" className={`text-sm transition-colors ${isActive('/journal') ? 'text-white font-medium' : 'text-[#94A3B8] hover:text-white'}`}>
            Journal
          </Link>
          <Link href="/tools" className={`text-sm transition-colors ${isActive('/tools') ? 'text-white font-medium' : 'text-[#94A3B8] hover:text-white'}`}>
            Tools
          </Link>
          <Link href="/blog" className={`text-sm transition-colors ${isActive('/blog') ? 'text-white font-medium' : 'text-[#94A3B8] hover:text-white'}`}>
            Blog
          </Link>
          <Link href="/religions" className={`text-sm transition-colors ${isActive('/religions') ? 'text-white font-medium' : 'text-[#94A3B8] hover:text-white'}`}>
            Religions
          </Link>
          <Link href="/profile" className={`text-sm transition-colors ${isActive('/profile') ? 'text-white font-medium' : 'text-[#94A3B8] hover:text-white'}`}>
            Profile
          </Link>
        </nav>
        
        <div className="flex items-center space-x-3">
          <a href="https://www.youtube.com/@CosmicChanneling001" target="_blank" rel="noopener noreferrer" className="text-[#94A3B8] hover:text-white transition-colors p-1" aria-label="YouTube Channel">
            <i className="ri-youtube-line text-lg"></i>
          </a>
          <a href="/#community" className="text-[#94A3B8] hover:text-white transition-colors p-1" aria-label="Newsletter">
            <i className="ri-mail-line text-lg"></i>
          </a>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <Link href="/profile">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-slate-200 cursor-pointer transition-all">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium max-w-[100px] truncate">{user.username}</span>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="text-slate-400 hover:text-white hover:bg-white/[0.04] text-xs h-8 px-2.5 rounded-lg"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-1.5">Logout</span>
              </Button>
            </div>
          ) : (
            <Link href="/auth">
              <Button
                size="sm"
                className="bg-white text-black hover:bg-slate-200 font-medium text-xs h-8 px-4 rounded-lg shadow-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 mr-1.5" />
                Sign In
              </Button>
            </Link>
          )}

          <button 
            className="lg:hidden text-[#F1F5F9] p-1 ml-1" 
            aria-label="Menu" 
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            onClick={toggleMenu}
          >
            <i className="ri-menu-line text-xl"></i>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div 
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 bg-[#090A0F]/98 backdrop-blur-xl z-50 p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                  <i className="ri-planet-line text-base text-[#F8FAFC]"></i>
                </div>
                <span className="font-space font-semibold text-white">Cosmic Channeling</span>
              </div>
              <button aria-label="Close menu" onClick={closeMenu} className="text-slate-400 hover:text-white">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            
            <nav className="flex flex-col space-y-5 text-lg">
              <Link href="/" onClick={closeMenu} className={isActive('/') ? 'text-white font-medium' : 'text-[#94A3B8]'}>
                Home
              </Link>
              <Link href="/meditate" onClick={closeMenu} className={isActive('/meditate') ? 'text-white font-medium' : 'text-[#94A3B8]'}>
                Meditate
              </Link>
              <Link href="/explore" onClick={closeMenu} className={isActive('/explore') ? 'text-white font-medium' : 'text-[#94A3B8]'}>
                Explore
              </Link>
              <Link href="/journal" onClick={closeMenu} className={isActive('/journal') ? 'text-white font-medium' : 'text-[#94A3B8]'}>
                Journal
              </Link>
              <Link href="/tools" onClick={closeMenu} className={isActive('/tools') ? 'text-white font-medium' : 'text-[#94A3B8]'}>
                Tools
              </Link>
              <Link href="/blog" onClick={closeMenu} className={isActive('/blog') ? 'text-white font-medium' : 'text-[#94A3B8]'}>
                Blog
              </Link>
              <Link href="/religions" onClick={closeMenu} className={isActive('/religions') ? 'text-white font-medium' : 'text-[#94A3B8]'}>
                Religions
              </Link>
              <Link href="/profile" onClick={closeMenu} className={isActive('/profile') ? 'text-white font-medium' : 'text-[#94A3B8]'}>
                Profile
              </Link>
            </nav>
          </div>

          <div className="pt-6 border-t border-white/[0.08]">
            <p className="text-xs text-[#94A3B8]">Deep Space Sanctuary & Solfeggio Meditation</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
