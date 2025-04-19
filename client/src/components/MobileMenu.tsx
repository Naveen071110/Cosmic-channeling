import { Link } from "wouter";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-space-950 bg-opacity-95 z-50 p-6">
      <div className="flex justify-end mb-6">
        <button aria-label="Close menu" onClick={onClose}>
          <i className="ri-close-line text-2xl text-space-100"></i>
        </button>
      </div>
      <nav className="flex flex-col space-y-6 items-center text-xl">
        <Link href="/" onClick={onClose} className="text-space-100 hover:text-cosmic-blue transition-colors">Home</Link>
        <Link href="/#meditate" onClick={onClose} className="text-space-600 hover:text-cosmic-blue transition-colors">Meditate</Link>
        <Link href="/#explore" onClick={onClose} className="text-space-600 hover:text-cosmic-blue transition-colors">Explore</Link>
        <Link href="/#journal" onClick={onClose} className="text-space-600 hover:text-cosmic-blue transition-colors">Journal</Link>
      </nav>
    </div>
  );
}
