import { Button } from '@/components/ui/button';
import AuthDialog from './AuthDialog';
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const CommunitySection = () => {
  const { isAuthenticated } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleJoinWhatsApp = () => {
    if (isAuthenticated) {
      // User is logged in, redirect to WhatsApp
      const whatsappLink = "https://httpsweareone.kreativestores.shop/communities/we-are-one2";
      window.open(whatsappLink, '_blank');
    } else {
      // User is not logged in, show sign-in dialog
      setShowAuthDialog(true);
    }
  };

  return (
    <section id="community" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            Join our <span className="text-ngo-orange">Community</span>
          </h2>
          
          <div className="bg-gradient-to-br from-orange-50 to-white rounded-3xl p-8 lg:p-12 shadow-lg">
            <div className="mb-8">
              <img
                src="./community_img.jpg"
                alt="Community members supporting each other"
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
            </div>
            
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-800">
                Be Part of Something Bigger
              </h3>
              
              <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                Our WhatsApp community is a safe, supportive space where members can connect, 
                share experiences, access resources, and support each other through their journey. 
                Join hundreds of others who have found strength in community.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 my-8">
                <div className="text-center">
                  <div className="bg-ngo-orange rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">24/7</span>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Always Available</h4>
                  <p className="text-gray-600">Round-the-clock support when you need it most</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-ngo-orange rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">❤️</span>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Safe Space</h4>
                  <p className="text-gray-600">Judgment-free environment for sharing and healing</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-ngo-orange rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">🤝</span>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Peer Support</h4>
                  <p className="text-gray-600">Connect with others who understand your journey</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">
                  <strong>What you'll find in our community:</strong>
                </p>
                <ul className="text-left max-w-2xl mx-auto space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-ngo-orange mr-2">✓</span>
                    Daily encouragement and motivation
                  </li>
                  <li className="flex items-center">
                    <span className="text-ngo-orange mr-2">✓</span>
                    Resource sharing and mental health tips
                  </li>
                  <li className="flex items-center">
                    <span className="text-ngo-orange mr-2">✓</span>
                    Event announcements and workshop invitations
                  </li>
                  <li className="flex items-center">
                    <span className="text-ngo-orange mr-2">✓</span>
                    Crisis support and immediate assistance
                  </li>
                  <li className="flex items-center">
                    <span className="text-ngo-orange mr-2">✓</span>
                    Celebration of recovery milestones
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <Button 
                  size="lg"
                  onClick={handleJoinWhatsApp}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg rounded-full"
                >
                  📱 Join WhatsApp Group
                </Button>
                
                {!isAuthenticated && (
                  <p className="text-sm text-gray-600">
                    Signin first to join the community. 
                    <AuthDialog
                      trigger={
                        <button className="text-ngo-orange hover:text-orange-600 ml-1 underline">
                          Create your account here
                        </button>
                      }
                    />
                  </p>
                )}
              </div>
              
              <p className="text-sm text-gray-500">
                By joining, you agree to our community guidelines and respect the privacy of all members.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AuthDialog for non-authenticated users */}
      {showAuthDialog && (
        <AuthDialog
          trigger={<div />}
        />
      )}
    </section>
  );
};

export default CommunitySection;