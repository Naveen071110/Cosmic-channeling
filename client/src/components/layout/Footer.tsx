
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-black/40 backdrop-blur-sm border-t border-space-800/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cosmic-purple">Cosmic Channeling</h3>
            <p className="text-space-100/70 text-sm">
              Connect with the universe through meditation, exploration, and spiritual growth.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-space-100">Explore</h4>
            <div className="space-y-2 text-sm">
              <Link href="/meditate" className="block text-space-100/70 hover:text-cosmic-pink transition-colors">
                Meditate
              </Link>
              <Link href="/explore" className="block text-space-100/70 hover:text-cosmic-pink transition-colors">
                Universe
              </Link>
              <Link href="/journal" className="block text-space-100/70 hover:text-cosmic-pink transition-colors">
                Journal
              </Link>
              <Link href="/tools" className="block text-space-100/70 hover:text-cosmic-pink transition-colors">
                Tools
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-space-100">Learn</h4>
            <div className="space-y-2 text-sm">
              <Link href="/blog" className="block text-space-100/70 hover:text-cosmic-pink transition-colors">
                Blog
              </Link>
              <Link href="/religions" className="block text-space-100/70 hover:text-cosmic-pink transition-colors">
                Religions
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-space-100">Legal</h4>
            <div className="space-y-2 text-sm">
              <Link href="/terms" className="block text-space-100/70 hover:text-cosmic-pink transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="block text-space-100/70 hover:text-cosmic-pink transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-space-800/50 mt-8 pt-8 text-center">
          <p className="text-space-100/50 text-sm">
            © 2024 Cosmic Channeling. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
