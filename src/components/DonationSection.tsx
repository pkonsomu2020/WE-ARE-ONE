import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Users, Lightbulb, Shield, CreditCard, DollarSign, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// Donor info collection removed to avoid prompts; backend handles minimal fields

const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3000/api';
  }
  // Always use Render backend for production
  return 'https://we-are-one-api.onrender.com/api';
};

const DonationSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'mpesa' | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // No client-side prompts; we only send amount and reason to backend for PayPal.

  const handleDonate = async (amount?: number) => {
    if (!amount) amount = selectedAmount || 0;
    if (!paymentMethod) {
      toast({ title: 'Select Payment Method', description: 'Please choose M-Pesa or PayPal.', variant: 'default' });
      return;
    }

    if (amount < 1) {
      toast({
        title: 'Invalid Amount',
        description: 'Minimum donation amount is $1 USD',
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

      if (paymentMethod === 'mpesa') {
        // Redirect to Lipia Online payment link for MPesa
        window.open('https://lipia-online.vercel.app/link/weareone', '_blank');
        setIsLoading(false);
        return;
      } else {
        apiUrl = `${apiBaseUrl}/paypal/create-payment`;
        body = {
          amount: amount,
          currency: 'USD',
          reason: 'Donation',
        };
        redirectField = 'approval_url';
      }

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
                    className={`border border-gray-200 rounded-2xl p-6 text-center hover:border-ngo-orange hover:shadow-lg transition-all duration-300 cursor-pointer ${selectedAmount === tier.amount ? 'ring-2 ring-ngo-orange' : ''}`}
                    onClick={() => setSelectedAmount(tier.amount)}
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
                  variant={paymentMethod === 'mpesa' ? 'default' : 'outline'}
                  className={paymentMethod === 'mpesa' ? 'bg-green-600 text-white' : ''}
                  onClick={() => setPaymentMethod('mpesa')}
                >
                  <Smartphone className="w-5 h-5 mr-2" /> M-Pesa
                </Button>
                <Button
                  variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
                  className={paymentMethod === 'paypal' ? 'bg-blue-600 text-white' : ''}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <DollarSign className="w-5 h-5 mr-2" /> PayPal
                </Button>
              </div>

              <div className="text-center mt-8">
                <Button
                  size="lg"
                  onClick={() => {
                    if (!selectedAmount) {
                      const customAmount = prompt('Enter donation amount (USD):');
                      if (customAmount && !isNaN(Number(customAmount))) {
                        setSelectedAmount(Number(customAmount));
                      }
                      return;
                    }
                    // If payment method not chosen yet, don't show an error; let user pick first
                    if (!paymentMethod) {
                      return;
                    }
                    handleDonate(selectedAmount);
                  }}
                  disabled={isLoading}
                  variant="outline"
                  className="border-ngo-orange text-ngo-orange hover:bg-ngo-orange hover:text-white px-8 py-4 text-lg"
                >
                  {selectedAmount ? `Donate $${selectedAmount}` : 'Custom Amount'}
                </Button>
                <p className="text-gray-600 mt-4">
                  Select a tier, choose a payment method above, then click Donate.
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
