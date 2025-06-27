
import { Button } from '@/components/ui/button';
import { XCircle, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DonationCancelled = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleTryAgain = () => {
    navigate('/#donate');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
          {/* Cancelled Icon */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-full p-6">
              <XCircle className="w-16 h-16 text-gray-600" />
            </div>
          </div>

          {/* Message */}
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-800">
            Donation Cancelled
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Your donation was cancelled. No charges were made to your account.
          </p>

          {/* Encouragement Message */}
          <div className="bg-orange-50 rounded-2xl p-6 mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              We Understand
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Sometimes things don't go as planned. If you'd like to try again or need assistance 
              with your donation, we're here to help. Every contribution, no matter the size, 
              makes a meaningful difference in our community.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={handleTryAgain}
              className="bg-ngo-orange hover:bg-orange-600 text-white px-8 py-4 text-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Try Again
            </Button>
            
            <Button 
              size="lg"
              onClick={handleGoHome}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Home
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-gray-600">
            <p className="text-sm">
              Need help? Contact our support team at support@weareone.co.ke
            </p>
          </div>
        </div>

        {/* Additional Message */}
        <div className="mt-8 text-gray-600">
          <p className="text-lg">
            Thank you for considering a donation to support our mission.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationCancelled;