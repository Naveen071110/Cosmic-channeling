import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-space-900 border-t border-space-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-full bg-cosmic-purple flex items-center justify-center">
              <i className="ri-planet-line text-sm text-space-50"></i>
            </div>
            <span className="font-space font-bold">Cosmic Channeling</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-space-100 hover:text-cosmic-pink transition-colors" aria-label="YouTube">
              <i className="ri-youtube-line text-xl"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-space-100 hover:text-cosmic-pink transition-colors" aria-label="Twitter">
              <i className="ri-twitter-x-line text-xl"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-space-100 hover:text-cosmic-pink transition-colors" aria-label="Instagram">
              <i className="ri-instagram-line text-xl"></i>
            </a>
          </div>
        </div>
        
        <div className="border-t border-space-800 pt-6 text-center">
          <p className="text-space-600 text-sm">&copy; {new Date().getFullYear()} Cosmic Channeling. All cosmic rights reserved.</p>
          <p className="text-space-600 text-xs mt-2">
            <Link href="/privacy" className="hover:text-space-100 transition-colors">Privacy Policy</Link> • 
            <Link href="/terms" className="hover:text-space-100 transition-colors">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
