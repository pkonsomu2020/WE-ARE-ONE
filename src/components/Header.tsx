
import { useState } from 'react';
import { Menu, X, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthDialog from './AuthDialog';
import UserProfile from './UserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (id: string) => {
    // Prevent multiple rapid clicks
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    // Check if we're on the homepage
    const isHomePage = location.pathname === '/';
    
    if (id === 'home') {
      if (isHomePage) {
        // Scroll to top of page if already on homepage
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Navigate to homepage if on another page
        navigate('/');
      }
      setIsMenuOpen(false);
      setTimeout(() => setIsNavigating(false), 500);
      return;
    }
    
    if (isHomePage) {
      // If on homepage, try to scroll to section
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
      }
      setTimeout(() => setIsNavigating(false), 500);
    } else {
      // If not on homepage, navigate to homepage with section hash
      navigate(`/#${id}`);
      setIsMenuOpen(false);
      setTimeout(() => setIsNavigating(false), 500);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <img 
              src="/wao_favicon.jpg" 
              alt="WE ARE ONE Logo" 
              className="h-12 w-12 rounded-full object-cover border border-gray-300 shadow-sm"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              disabled={isNavigating}
              className={`text-gray-600 hover:text-ngo-orange transition-colors bg-transparent border-none cursor-pointer ${
                isNavigating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isNavigating ? 'Loading...' : 'Home'}
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              disabled={isNavigating}
              className={`text-gray-600 hover:text-ngo-orange transition-colors bg-transparent border-none cursor-pointer ${
                isNavigating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isNavigating ? 'Loading...' : 'About'}
            </button>
            <button 
              onClick={() => scrollToSection('mission')}
              disabled={isNavigating}
              className={`text-gray-600 hover:text-ngo-orange transition-colors bg-transparent border-none cursor-pointer ${
                isNavigating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isNavigating ? 'Loading...' : 'Our Mission'}
            </button>
            <button 
              onClick={() => scrollToSection('impact')}
              disabled={isNavigating}
              className={`text-gray-600 hover:text-ngo-orange transition-colors bg-transparent border-none cursor-pointer ${
                isNavigating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isNavigating ? 'Loading...' : 'Impact'}
            </button>
            <button 
              onClick={() => scrollToSection('community')}
              disabled={isNavigating}
              className={`text-gray-600 hover:text-ngo-orange transition-colors bg-transparent border-none cursor-pointer ${
                isNavigating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isNavigating ? 'Loading...' : 'Community'}
            </button>
            <Link
              to="/events"
              className="text-gray-600 hover:text-ngo-orange transition-colors"
            >
              Events
            </Link>
            
            {isAuthenticated ? (
              <UserProfile />
            ) : (
              <AuthDialog
                trigger={
                  <Button 
                    variant="outline"
                    className="border-ngo-orange text-ngo-orange hover:bg-ngo-orange hover:text-white transition-all duration-300"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                }
              />
            )}
            
            <button 
              onClick={() => scrollToSection('donate')}
              disabled={isNavigating}
              className={`bg-ngo-orange hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors border-none cursor-pointer ${
                isNavigating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isNavigating ? 'Loading...' : 'Donate Now'}
            </button>
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
                disabled={isNavigating}
                className={`text-gray-600 hover:text-ngo-orange transition-colors text-left bg-transparent border-none cursor-pointer text-left ${
                  isNavigating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isNavigating ? 'Loading...' : 'Home'}
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                disabled={isNavigating}
                className={`text-gray-600 hover:text-ngo-orange transition-colors text-left bg-transparent border-none cursor-pointer text-left ${
                  isNavigating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isNavigating ? 'Loading...' : 'About'}
              </button>
              <button 
                onClick={() => scrollToSection('mission')}
                disabled={isNavigating}
                className={`text-gray-600 hover:text-ngo-orange transition-colors text-left bg-transparent border-none cursor-pointer text-left ${
                  isNavigating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isNavigating ? 'Loading...' : 'Our Mission'}
              </button>
              <button 
                onClick={() => scrollToSection('impact')}
                disabled={isNavigating}
                className={`text-gray-600 hover:text-ngo-orange transition-colors text-left bg-transparent border-none cursor-pointer text-left ${
                  isNavigating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isNavigating ? 'Loading...' : 'Impact'}
              </button>
              <button 
                onClick={() => scrollToSection('community')}
                disabled={isNavigating}
                className={`text-gray-600 hover:text-ngo-orange transition-colors text-left bg-transparent border-none cursor-pointer text-left ${
                  isNavigating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isNavigating ? 'Loading...' : 'Community'}
              </button>
              <Link
                to="/events"
                className="text-gray-600 hover:text-ngo-orange transition-colors text-left"
              >
                Events
              </Link>
              
              {isAuthenticated ? (
                <div className="flex items-center justify-start">
                  <UserProfile />
                </div>
              ) : (
                <AuthDialog
                  trigger={
                    <Button 
                      variant="outline"
                      className="border-ngo-orange text-ngo-orange hover:bg-orange-600 hover:text-white w-full"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  }
                />
              )}
              
              <button 
                onClick={() => scrollToSection('donate')}
                disabled={isNavigating}
                className={`bg-ngo-orange hover:bg-orange-600 text-white w-full text-center py-2 rounded transition-colors border-none cursor-pointer ${
                  isNavigating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isNavigating ? 'Loading...' : 'Donate Now'}
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;