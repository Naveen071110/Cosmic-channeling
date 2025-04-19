import { Link } from "wouter";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="py-4 px-6 flex justify-between items-center border-b border-space-800">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full bg-cosmic-purple flex items-center justify-center">
          <i className="ri-planet-line text-xl text-space-50"></i>
        </div>
        <h1 className="text-xl font-space font-bold bg-gradient-to-r from-cosmic-pink to-cosmic-blue bg-clip-text text-transparent">
          Cosmic Channeling
        </h1>
      </div>
      
      <nav className="hidden md:flex space-x-6">
        <Link href="/" className="text-space-100 hover:text-cosmic-blue transition-colors">Home</Link>
        <Link href="/#meditate" className="text-space-600 hover:text-cosmic-blue transition-colors">Meditate</Link>
        <Link href="/#explore" className="text-space-600 hover:text-cosmic-blue transition-colors">Explore</Link>
        <Link href="/#journal" className="text-space-600 hover:text-cosmic-blue transition-colors">Journal</Link>
      </nav>
      
      <div className="flex items-center space-x-4">
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-space-100 hover:text-cosmic-pink transition-colors" aria-label="YouTube Channel">
          <i className="ri-youtube-line text-xl"></i>
        </a>
        <a href="#newsletter" className="text-space-100 hover:text-cosmic-pink transition-colors" aria-label="Newsletter">
          <i className="ri-mail-line text-xl"></i>
        </a>
        <button 
          className="md:hidden text-space-100" 
          aria-label="Menu" 
          onClick={onMenuToggle}
        >
          <i className="ri-menu-line text-xl"></i>
        </button>
      </div>
    </header>
  );
}
