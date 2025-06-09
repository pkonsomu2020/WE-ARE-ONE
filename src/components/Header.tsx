
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
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-ngo-orange">
            WE ARE ONE
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-gray-600 hover:text-ngo-orange transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-600 hover:text-ngo-orange transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('mission')}
              className="text-gray-600 hover:text-ngo-orange transition-colors"
            >
              Our Mission
            </button>
            <button 
              onClick={() => scrollToSection('impact')}
              className="text-gray-600 hover:text-ngo-orange transition-colors"
            >
              Impact
            </button>
            <button 
              onClick={() => scrollToSection('community')}
              className="text-gray-600 hover:text-ngo-orange transition-colors"
            >
              Community
            </button>
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
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-600 hover:text-ngo-orange"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-gray-600 hover:text-ngo-orange transition-colors text-left"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-gray-600 hover:text-ngo-orange transition-colors text-left"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('mission')}
                className="text-gray-600 hover:text-ngo-orange transition-colors text-left"
              >
                Our Mission
              </button>
              <button 
                onClick={() => scrollToSection('impact')}
                className="text-gray-600 hover:text-ngo-orange transition-colors text-left"
              >
                Impact
              </button>
              <button 
                onClick={() => scrollToSection('community')}
                className="text-gray-600 hover:text-ngo-orange transition-colors text-left"
              >
                Community
              </button>
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
