import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Users, Lightbulb, Shield, CreditCard, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface DonorInfo {
  email: string;
  first_name: string;
  last_name: string;
  location: string;
  phone: string;
  username: string;
  reason: string;
}

const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3000/api';
  }
  return 'https://weareone.co.ke/api';
};

const DonationSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod] = useState<'paypal'>('paypal');
  const { toast } = useToast();
  const { user } = useAuth();

  // Helper to collect donor info
  const collectDonorInfo = async (): Promise<DonorInfo | null> => {
    let email = user?.email;
    let first_name = user?.fullName?.split(' ')[0];
    let last_name = user?.fullName?.split(' ').slice(1).join(' ');
    const location = 'Nairobi'; // Default location, or set as needed
    let phone = user?.phone;
    let username = email ? email.split('@')[0] : '';
    const reason = 'Donation';

    if (!email) {
      email = prompt('Enter your email:') || '';
      if (!email) return null;
    }
    if (!first_name) {
      first_name = prompt('Enter your first name:') || '';
      if (!first_name) return null;
    }
    if (!last_name) {
      last_name = prompt('Enter your last name:') || '';
      if (!last_name) return null;
    }
    if (!phone) {
      phone = prompt('Enter your phone number:') || '';
      if (!phone) return null;
    }
    if (!username) {
      username = prompt('Enter your username:') || '';
      if (!username) return null;
    }
    // Reason is always 'Donation', but you could prompt if you want
    return { email, first_name, last_name, location, phone, username, reason };
  };

  const handleDonate = async (amount?: number) => {
    if (!amount) {
      const customAmount = prompt('Enter donation amount (USD):');
      if (!customAmount || isNaN(Number(customAmount))) {
        toast({
          title: 'Invalid Amount',
          description: 'Please enter a valid amount',
          variant: 'destructive',
        });
        return;
      }
      amount = Number(customAmount);
    }

    if (amount < 1) {
      toast({
        title: 'Invalid Amount',
        description: 'Minimum donation amount is $1 USD',
        variant: 'destructive',
      });
      return;
    }

    // Collect donor info
    const donorInfo = await collectDonorInfo();
    if (!donorInfo) {
      toast({
        title: 'Missing Information',
        description: 'All donor information is required.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const apiBaseUrl = getApiBaseUrl();
      let apiUrl = '';
      let body: Record<string, unknown> = {};
      let redirectField = '';

      apiUrl = `${apiBaseUrl}/paypal/create-payment`;
      body = {
        amount: amount,
        currency: 'USD',
        reason: donorInfo.reason,
      };
      redirectField = 'approval_url';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok && data.success && data[redirectField]) {
        window.location.href = data[redirectField];
      } else {
        throw new Error(data.message || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description:
          error instanceof Error
            ? error.message
            : `Failed to initiate PayPal payment`,
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const donationTiers = [
    {
      amount: 25,
      title: 'Supporter',
      description: 'Helps provide resources for one counseling session',
      icon: Heart,
    },
    {
      amount: 50,
      title: 'Advocate',
      description: 'Supports one week of group therapy sessions',
      icon: Users,
    },
    {
      amount: 100,
      title: 'Champion',
      description: 'Funds educational workshops and training materials',
      icon: Lightbulb,
    },
    {
      amount: 250,
      title: 'Guardian',
      description: 'Provides crisis intervention support for a month',
      icon: Shield,
    },
  ];

  return (
    <section id="donate" className="py-20 bg-gradient-to-br from-orange-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Support Our <span className="text-ngo-orange">Mission</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Your donation directly impacts lives by providing essential mental health
              services, crisis support, and community programs to those who need them most.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8 lg:p-12">
              <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">
                Choose Your Impact Level
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {donationTiers.map((tier, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-2xl p-6 text-center hover:border-ngo-orange hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => handleDonate(tier.amount)}
                  >
                    <div className="bg-ngo-orange rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <tier.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-ngo-orange mb-2">
                      ${tier.amount}
                    </div>
                    <div className="font-semibold text-gray-800 mb-2">{tier.title}</div>
                    <p className="text-sm text-gray-600">{tier.description}</p>
                  </div>
                ))}
              </div>

              {/* Only PayPal is available for now */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Button
                  variant="default"
                  className="bg-blue-600 text-white"
                  disabled
                >
                  <CreditCard className="w-5 h-5 mr-2" /> Payd (Temporarily Unavailable)
                </Button>
                <Button
                  variant="default"
                  className="bg-blue-600 text-white"
                  disabled={isLoading}
                >
                  <DollarSign className="w-5 h-5 mr-2" /> PayPal
                </Button>
              </div>

              <div className="text-center mt-8">
                <Button
                  size="lg"
                  onClick={() => {
                    const customAmount = prompt('Enter donation amount (USD):');
                    if (customAmount && !isNaN(Number(customAmount))) {
                      handleDonate(Number(customAmount));
                    }
                  }}
                  disabled={isLoading}
                  variant="outline"
                  className="border-ngo-orange text-ngo-orange hover:bg-ngo-orange hover:text-white px-8 py-4 text-lg"
                >
                  Custom Amount
                </Button>
                <p className="text-gray-600 mt-4">
                  Click a donation tier or "Custom Amount" to be redirected to PayPal and complete your donation securely.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-8">
              <h4 className="text-2xl font-bold text-center mb-6 text-gray-800">
                How Your Donation Helps
              </h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-ngo-orange mb-2">85%</div>
                  <p className="text-gray-700">Directly funds programs and services</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-ngo-orange mb-2">10%</div>
                  <p className="text-gray-700">Administrative and operational costs</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-ngo-orange mb-2">5%</div>
                  <p className="text-gray-700">Fundraising and awareness campaigns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;
