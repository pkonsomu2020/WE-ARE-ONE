
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DonationSuccess = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="bg-green-100 rounded-full p-6">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>

          {/* Thank You Message */}
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-800">
            Thank You!
          </h1>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <Heart className="w-6 h-6 text-red-500" />
            <p className="text-xl text-gray-600">
              Your generous donation has been successfully processed
            </p>
            <Heart className="w-6 h-6 text-red-500" />
          </div>

          {/* Impact Message */}
          <div className="bg-orange-50 rounded-2xl p-6 mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Your Impact
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Your contribution will directly support our mental health services, 
              crisis intervention programs, and community outreach initiatives. 
              Together, we're making a real difference in people's lives.
            </p>
          </div>

          {/* Receipt Info */}
          <div className="text-sm text-gray-500 mb-8">
            <p>A receipt has been sent to your email address.</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button 
              size="lg"
              onClick={handleGoHome}
              className="bg-ngo-orange hover:bg-orange-600 text-white px-8 py-4 text-lg w-full sm:w-auto"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Home
            </Button>
            
            <p className="text-gray-600">
              Continue exploring our mission and impact
            </p>
          </div>
        </div>

        {/* Additional Message */}
        <div className="mt-8 text-gray-600">
          <p className="text-lg">
            Your kindness and support mean the world to us and the communities we serve.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationSuccess;