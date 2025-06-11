import { useState } from 'react';
import { Menu, X, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthDialog from './AuthDialog';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between relative">

        {/* Logo - Left */}
        <div className="flex-shrink-0">
        <img 
          src="/wao_favicon.jpg" 
          alt="WE ARE ONE Logo" 
          className="h-12 w-12 rounded-full object-cover border border-gray-300 shadow-sm"
        />
      </div>

      {/* Navigation Menu - Center */}
      <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-8">
        <button onClick={() => scrollToSection('home')} className="text-gray-600 hover:text-ngo-orange transition-colors">Home</button>
        <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-ngo-orange transition-colors">About</button>
        <button onClick={() => scrollToSection('mission')} className="text-gray-600 hover:text-ngo-orange transition-colors">Our Mission</button>
        <button onClick={() => scrollToSection('impact')} className="text-gray-600 hover:text-ngo-orange transition-colors">Impact</button>
        <button onClick={() => scrollToSection('community')} className="text-gray-600 hover:text-ngo-orange transition-colors">Community</button>
      </nav>

      {/* Buttons - Right */}
      <div className="hidden md:flex space-x-4">
        <AuthDialog
          trigger={
            <Button 
              variant="outline"
              className="border-ngo-orange text-ngo-orange hover:bg-ngo-orange hover:text-white transition-all duration-300"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Sign up
            </Button>
          }
        />
        <Button 
          onClick={() => scrollToSection('donate')}
          className="bg-ngo-orange hover:bg-orange-600 text-white"
        >
          Donate Now
        </Button>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 text-gray-600 absolute right-4"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>

    {/* Mobile Navigation */}
    {isMenuOpen && (
      <nav className="md:hidden mt-4 pb-4 border-t border-gray-200">
        <div className="flex flex-col space-y-4 pt-4">
          <button onClick={() => scrollToSection('home')} className="text-gray-600 hover:text-ngo-orange text-left">Home</button>
          <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-ngo-orange text-left">About</button>
          <button onClick={() => scrollToSection('mission')} className="text-gray-600 hover:text-ngo-orange text-left">Our Mission</button>
          <button onClick={() => scrollToSection('impact')} className="text-gray-600 hover:text-ngo-orange text-left">Impact</button>
          <button onClick={() => scrollToSection('community')} className="text-gray-600 hover:text-ngo-orange text-left">Community</button>
          <AuthDialog
            trigger={
              <Button 
                variant="outline"
                className="border-ngo-orange text-ngo-orange hover:bg-ngo-orange hover:text-white w-full"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Sign up
              </Button>
            }
          />
          <Button 
            onClick={() => scrollToSection('donate')}
            className="bg-ngo-orange hover:bg-orange-600 text-white w-full"
          >
            Donate Now
          </Button>
        </div>
      </nav>
    )}
  </div>
  </header>
);
};

export default Header;
