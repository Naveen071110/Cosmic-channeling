import { useState } from 'react';
import { Link, useLocation } from 'wouter';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  
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
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-[#7E22CE] flex items-center justify-center">
            <i className="ri-planet-line text-xl text-[#F8FAFC]"></i>
          </div>
          <h1 className="text-xl font-space font-bold bg-gradient-to-r from-[#EC4899] to-[#0EA5E9] bg-clip-text text-transparent">
            Cosmic Channeling
          </h1>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className={`transition-colors ${isActive('/') ? 'text-[#F1F5F9]' : 'text-[#64748B] hover:text-[#0EA5E9]'}`}>
            Home
          </Link>
          <Link href="/meditate" className={`transition-colors ${isActive('/meditate') ? 'text-[#F1F5F9]' : 'text-[#64748B] hover:text-[#0EA5E9]'}`}>
            Meditate
          </Link>
          <Link href="/explore" className={`transition-colors ${isActive('/explore') ? 'text-[#F1F5F9]' : 'text-[#64748B] hover:text-[#0EA5E9]'}`}>
            Explore
          </Link>
          <Link href="/journal" className={`transition-colors ${isActive('/journal') ? 'text-[#F1F5F9]' : 'text-[#64748B] hover:text-[#0EA5E9]'}`}>
            Journal
          </Link>
          <Link href="/tools" className={`transition-colors ${isActive('/tools') ? 'text-[#F1F5F9]' : 'text-[#64748B] hover:text-[#0EA5E9]'}`}>
            Tools
          </Link>
          <Link href="/pricing" className={`transition-colors ${isActive('/pricing') ? 'text-[#F1F5F9]' : 'text-[#64748B] hover:text-[#0EA5E9]'}`}>
            Pricing
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <a href="https://www.youtube.com/@CosmicChanneling001" target="_blank" rel="noopener noreferrer" className="text-[#F1F5F9] hover:text-[#EC4899] transition-colors" aria-label="YouTube Channel">
            <i className="ri-youtube-line text-xl"></i>
          </a>
          <a href="#newsletter" className="text-[#F1F5F9] hover:text-[#EC4899] transition-colors" aria-label="Newsletter">
            <i className="ri-mail-line text-xl"></i>
          </a>
          <button 
            className="md:hidden text-[#F1F5F9]" 
            aria-label="Menu" 
            onClick={toggleMenu}
          >
            <i className="ri-menu-line text-xl"></i>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#0F172A] bg-opacity-95 z-50 p-6">
          <div className="flex justify-end mb-6">
            <button aria-label="Close menu" onClick={closeMenu}>
              <i className="ri-close-line text-2xl text-[#F1F5F9]"></i>
            </button>
          </div>
          <nav className="flex flex-col space-y-6 items-center text-xl">
            <Link href="/" onClick={closeMenu} className={isActive('/') ? 'text-[#F1F5F9]' : 'text-[#64748B] hover:text-[#0EA5E9] transition-colors'}>
              Home
            </Link>
            <Link href="/meditate" onClick={closeMenu} className={isActive('/meditate') ? 'text-[#F1F5F9]' : 'text-[#64748B] hover:text-[#0EA5E9] transition-colors'}>
              Meditate
            </Link>
            <Link href="/explore" onClick={closeMenu} className={isActive('/explore') ? 'text-[#F1F5F9]' : 'text-[#64748B] hover:text-[#0EA5E9] transition-colors'}>
              Explore
            </Link>
            <Link href="/journal" onClick={closeMenu} className={isActive('/journal') ? 'text-[#F1F5F9]' : 'text-[#64748B] hover:text-[#0EA5E9] transition-colors'}>
              Journal
            </Link>
            <Link href="/tools" onClick={closeMenu} className={isActive('/tools') ? 'text-[#F1F5F9]' : 'text-[#64748B] hover:text-[#0EA5E9] transition-colors'}>
              Tools
            </Link>
            <Link href="/pricing" onClick={closeMenu} className={isActive('/pricing') ? 'text-[#F1F5F9]' : 'text-[#64748B] hover:text-[#0EA5E9] transition-colors'}>
              Pricing
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
