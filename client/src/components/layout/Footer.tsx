import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-[#1E293B] border-t border-[#334155] py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-full bg-[#7E22CE] flex items-center justify-center">
              <i className="ri-planet-line text-sm text-[#F8FAFC]"></i>
            </div>
            <span className="font-space font-bold">Cosmic Channeling</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <a 
              href="https://www.youtube.com/@CosmicChanneling001" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#F1F5F9] hover:text-[#EC4899] transition-colors" 
              aria-label="YouTube"
            >
              <i className="ri-youtube-line text-xl"></i>
            </a>
            <a 
              href="https://x.com/cosmichanneling" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#F1F5F9] hover:text-[#EC4899] transition-colors" 
              aria-label="X"
            >
              <i className="ri-twitter-x-line text-xl"></i>
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#F1F5F9] hover:text-[#EC4899] transition-colors" 
              aria-label="Instagram"
            >
              <i className="ri-instagram-line text-xl"></i>
            </a>
          </div>
        </div>
        
        <div className="border-t border-[#334155] pt-6 text-center">
          <p className="text-[#64748B] text-sm">&copy; {new Date().getFullYear()} Cosmic Channeling. All cosmic rights reserved.</p>
          <p className="text-[#64748B] text-xs mt-2">
            <Link href="/privacy" className="hover:text-[#F1F5F9] transition-colors">Privacy Policy</Link> • 
            <Link href="/terms" className="hover:text-[#F1F5F9] transition-colors ml-2">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
