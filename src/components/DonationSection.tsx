
import { Button } from '@/components/ui/button';
import { Heart, Users, Lightbulb, Shield } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const DonationSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDonate = async (amount?: number) => {
    if (!amount) {
      const customAmount = prompt('Enter donation amount (USD):');
      if (!customAmount || isNaN(Number(customAmount))) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid amount",
          variant: "destructive"
        });
        return;
      }
      amount = Number(customAmount);
    }

    if (amount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Minimum donation amount is $1 USD",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Replace with your actual backend URL
      const response = await fetch('http://localhost:3000/api/paypal/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'USD',
          description: `Donation of $${amount} USD`,
          return_url: `${window.location.origin}/donation-success`,
          cancel_url: `${window.location.origin}/donation-cancelled`
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to PayPal checkout
        window.location.href = data.approval_url;
      } else {
        throw new Error(data.message || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Failed to initiate PayPal payment",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const donationTiers = [
    {
      amount: 25,
      title: "Supporter",
      description: "Helps provide resources for one counseling session",
      icon: Heart
    },
    {
      amount: 50,
      title: "Advocate",
      description: "Supports one week of group therapy sessions",
      icon: Users
    },
    {
      amount: 100,
      title: "Champion",
      description: "Funds educational workshops and training materials",
      icon: Lightbulb
    },
    {
      amount: 250,
      title: "Guardian",
      description: "Provides crisis intervention support for a month",
      icon: Shield
    }
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
              Your donation directly impacts lives by providing essential mental health services, 
              crisis support, and community programs to those who need them most.
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

              <div className="text-center space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    onClick={() => handleDonate(50)}
                    disabled={isLoading}
                    className="bg-ngo-orange hover:bg-orange-600 text-white px-8 py-4 text-lg"
                  >
                    {isLoading ? 'Processing...' : 'Donate $50'}
                  </Button>
                  <Button 
                    size="lg"
                    onClick={() => handleDonate()}
                    disabled={isLoading}
                    variant="outline"
                    className="border-ngo-orange text-ngo-orange hover:bg-ngo-orange hover:text-white px-8 py-4 text-lg"
                  >
                    Custom Amount
                  </Button>
                </div>
                
                <p className="text-gray-600">
                  Secure PayPal payments. You'll be redirected to PayPal to complete your donation.
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