import { useState } from 'react';
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

  const isActive = (path: string) => location === path;

  return (
    <>
      <header className="py-4 px-6 flex justify-between items-center border-b border-[#334155]">
        <Link href="/" className="flex items-center space-x-2 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-[#7E22CE] flex items-center justify-center shadow-md shadow-purple-900/40">
            <i className="ri-planet-line text-xl text-[#F8FAFC]"></i>
          </div>
          <h1 className="text-xl font-space font-bold bg-gradient-to-r from-[#EC4899] to-[#0EA5E9] bg-clip-text text-transparent">
            Cosmic Channeling
          </h1>
        </Link>
        
        <nav className="hidden lg:flex space-x-6">
          <Link href="/" className={`transition-colors ${isActive('/') ? 'text-[#F1F5F9] font-medium' : 'text-[#64748B] hover:text-[#0EA5E9]'}`}>
            Home
          </Link>
          <Link href="/meditate" className={`transition-colors ${isActive('/meditate') ? 'text-[#F1F5F9] font-medium' : 'text-[#64748B] hover:text-[#0EA5E9]'}`}>
            Meditate
          </Link>
          <Link href="/explore" className={`transition-colors ${isActive('/explore') ? 'text-[#F1F5F9] font-medium' : 'text-[#64748B] hover:text-[#0EA5E9]'}`}>
            Explore
          </Link>
          <Link href="/journal" className={`transition-colors ${isActive('/journal') ? 'text-[#F1F5F9] font-medium' : 'text-[#64748B] hover:text-[#0EA5E9]'}`}>
            Journal
          </Link>
          <Link href="/tools" className={`transition-colors ${isActive('/tools') ? 'text-[#F1F5F9] font-medium' : 'text-[#64748B] hover:text-[#0EA5E9]'}`}>
            Tools
          </Link>
          <Link href="/blog" className={`transition-colors ${isActive('/blog') ? 'text-[#F1F5F9] font-medium' : 'text-[#64748B] hover:text-[#0EA5E9]'}`}>
            Blog
          </Link>
          <Link href="/religions" className={`transition-colors ${isActive('/religions') ? 'text-[#F1F5F9] font-medium' : 'text-[#64748B] hover:text-[#0EA5E9]'}`}>
            Religions
          </Link>
        </nav>
        
        <div className="flex items-center space-x-3">
          <a href="https://www.youtube.com/@CosmicChanneling001" target="_blank" rel="noopener noreferrer" className="text-[#F1F5F9] hover:text-[#EC4899] transition-colors p-1" aria-label="YouTube Channel">
            <i className="ri-youtube-line text-lg"></i>
          </a>
          <a href="/#newsletter" className="text-[#F1F5F9] hover:text-[#EC4899] transition-colors p-1" aria-label="Newsletter">
            <i className="ri-mail-line text-lg"></i>
          </a>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#334155]">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs text-purple-200">
                <UserIcon className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-medium max-w-[100px] truncate">{user.username}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="text-gray-400 hover:text-red-400 hover:bg-red-950/20 text-xs h-8 px-2.5"
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
                className="bg-gradient-to-r from-[#7E22CE] to-[#EC4899] hover:opacity-90 text-white text-xs h-8 px-3.5 shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 mr-1.5" />
                Sign In
              </Button>
            </Link>
          )}

          <button 
            className="lg:hidden text-[#F1F5F9] p-1 ml-1" 
            aria-label="Menu" 
            onClick={toggleMenu}
          >
            <i className="ri-menu-line text-xl"></i>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#0F172A] bg-opacity-95 z-50 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#7E22CE] flex items-center justify-center">
                  <i className="ri-planet-line text-base text-[#F8FAFC]"></i>
                </div>
                <span className="font-space font-bold text-white">Cosmic Channeling</span>
              </div>
              <button aria-label="Close menu" onClick={closeMenu} className="text-gray-400 hover:text-white">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            
            <nav className="flex flex-col space-y-5 text-lg">
              <Link href="/" onClick={closeMenu} className={isActive('/') ? 'text-[#EC4899] font-medium' : 'text-gray-300'}>
                Home
              </Link>
              <Link href="/meditate" onClick={closeMenu} className={isActive('/meditate') ? 'text-[#EC4899] font-medium' : 'text-gray-300'}>
                Meditate
              </Link>
              <Link href="/explore" onClick={closeMenu} className={isActive('/explore') ? 'text-[#EC4899] font-medium' : 'text-gray-300'}>
                Explore
              </Link>
              <Link href="/journal" onClick={closeMenu} className={isActive('/journal') ? 'text-[#EC4899] font-medium' : 'text-gray-300'}>
                Journal
              </Link>
              <Link href="/tools" onClick={closeMenu} className={isActive('/tools') ? 'text-[#EC4899] font-medium' : 'text-gray-300'}>
                Tools
              </Link>
              <Link href="/blog" onClick={closeMenu} className={isActive('/blog') ? 'text-[#EC4899] font-medium' : 'text-gray-300'}>
                Blog
              </Link>
              <Link href="/religions" onClick={closeMenu} className={isActive('/religions') ? 'text-[#EC4899] font-medium' : 'text-gray-300'}>
                Religions
              </Link>
            </nav>
          </div>

          <div className="pt-6 border-t border-white/10">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center text-purple-200 font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-white">{user.username}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { logoutMutation.mutate(); closeMenu(); }}
                  className="text-xs border-red-500/30 text-red-400 hover:bg-red-950/20"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/auth" onClick={closeMenu}>
                <Button className="w-full bg-gradient-to-r from-[#7E22CE] to-[#EC4899] text-white">
                  Sign In / Register
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
