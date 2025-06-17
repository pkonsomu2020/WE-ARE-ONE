
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleJoinWhatsApp = () => {
    const whatsappLink = "https://httpsweareone.kreativestores.shop/communities/we-are-one2";
    window.open(whatsappLink, '_blank');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Organization Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-ngo-orange">WE ARE ONE</h3>
            <p className="text-gray-400 leading-relaxed">
              Building stronger, more resilient communities through mental health support, 
              advocacy, and compassionate care.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-ngo-orange transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-ngo-orange transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-ngo-orange transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-ngo-orange transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-ngo-orange transition-colors">
                <Youtube size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="space-y-2">
              <button 
                onClick={() => scrollToSection('home')}
                className="block text-gray-400 hover:text-ngo-orange transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="block text-gray-400 hover:text-ngo-orange transition-colors"
              >
                About Us
              </button>
              <button 
                onClick={() => scrollToSection('mission')}
                className="block text-gray-400 hover:text-ngo-orange transition-colors"
              >
                Our Mission
              </button>
              <button 
                onClick={() => scrollToSection('impact')}
                className="block text-gray-400 hover:text-ngo-orange transition-colors"
              >
                Our Impact
              </button>
              <button 
                onClick={handleJoinWhatsApp}
                className="block text-gray-400 hover:text-ngo-orange transition-colors"
              >
                Join WhatsApp
              </button>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Our Services</h4>
            <div className="space-y-2 text-gray-400">
              <div>Mental Health Counseling</div>
              <div>Addiction Recovery Support</div>
              <div>Peer Support Groups</div>
              <div>Crisis Intervention</div>
              <div>Family Therapy</div>
              <div>Community Workshops</div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-2 text-gray-400">
              <div>📞 Crisis Hotline: +254 7118 53928</div>
              <div>📞 Therapist: +254 79567 65298</div>
              <div>📧 weareone0624@gmail.com</div>
              <div>📍 Online Community</div>
              <div>🕒 24/7 Crisis Support Available</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © {currentYear} WE ARE ONE. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-ngo-orange transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-ngo-orange transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-ngo-orange transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
