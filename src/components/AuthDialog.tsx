
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthDialogProps {
  trigger: React.ReactNode;
}

const AuthDialog = ({ trigger }: AuthDialogProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { login } = useAuth();

  const supportOptions = [
    'Mental Health',
    'Substance Abuse / Addiction Recovery',
    'Domestic Violence',
    'Sexual Abuse',
    'Grief or Loss Support',
    'Financial Assistance',
    'Youth Empowerment',
    'LGBTQ+ Support',
    'Disability Support',
    'Relationship/Family Counseling',
    'Other'
  ];

  const kenyanCounties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
    'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
    'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
    'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
    'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
    'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia',
    'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
  ];

  const [selectedSupport, setSelectedSupport] = useState<string[]>([]);
  const [otherSupportText, setOtherSupportText] = useState('');
  const [personalStatement, setPersonalStatement] = useState('');
  const [liveLocation, setLiveLocation] = useState('');
  const [locationError, setLocationError] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationTouched, setLocationTouched] = useState(false);

  // API URL configuration - Try same origin first to avoid CORS
  // const getApiUrl = () => {
  //   const hostname = window.location.hostname;
  //   const protocol = window.location.protocol;
  //   const origin = window.location.origin;
    
  //   console.log('Current location:', { hostname, protocol, origin });
    
  //   if (hostname === 'localhost' || hostname === '127.0.0.1') {
  //     return 'http://localhost:3000/api';
  //     return 'https://weareone.co.ke/api';
  //   }

  //   if (hostname === 'weareone.co.ke' || hostname === 'www.weareone.co.ke') {
  //     return `${origin}/api`;
  //   }
    
  //   return 'https://www.weareone.co.ke/api';
  // };

  const getApiUrl = () => {
  const hostname = window.location.hostname;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3000/api';
  }

  // Default to live production
  return 'https://weareone.co.ke/api';
};

  const handleSupportChange = (option: string, checked: boolean) => {
    if (checked) {
      setSelectedSupport([...selectedSupport, option]);
    } else {
      setSelectedSupport(selectedSupport.filter(item => item !== option));
      if (option === 'Other') {
        setOtherSupportText('');
      }
    }
  };

  const handleGetLocation = () => {
  setLoadingLocation(true);
  setLocationError('');
  setLocationTouched(true); // ensure this exists

  if (!navigator.geolocation) {
    setLocationError('Geolocation is not supported by this browser');
    setLoadingLocation(false);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch address');
        }

        const data = await response.json();
        const address = data.display_name;

        setLiveLocation(address || `${latitude}, ${longitude}`);
      } catch (error) {
        console.error('Error during reverse geocoding:', error);
        setLiveLocation(`${latitude}, ${longitude}`);
        setLocationError('Unable to get readable location');
      } finally {
        setLoadingLocation(false);
      }
    },
    (error) => {
      setLocationError('Unable to retrieve location');
      setLoadingLocation(false);
    }
  );
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    const apiBaseUrl = getApiUrl();
    
    console.log('API Base URL:', apiBaseUrl);
    console.log('Current origin:', window.location.origin);
    
    try {
      if (isLogin) {
        // Login request
        const loginData = {
          email: formData.get('email'),
          password: formData.get('password')
        };

        const loginUrl = `${apiBaseUrl}/auth/login`;
        console.log('Attempting login to:', loginUrl);

        const response = await fetch(loginUrl, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(loginData)
        });

        console.log('Login response status:', response.status);
        console.log('Login response headers:', Object.fromEntries(response.headers.entries()));

        // Check if response is actually JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const responseText = await response.text();
          console.error('Non-JSON response received:', responseText);
          
          if (responseText.includes('It works!') || responseText.includes('Apache')) {
            setMessage('Backend configuration error: API requests are not being routed to the Node.js server. Please check your server configuration.');
          } else {
            setMessage('Server configuration error: Expected JSON response but got HTML/text. Please check backend setup.');
          }
          return;
        }

        const result = await response.json();

        if (response.ok) {
          setMessage('Login successful!');
          login(result.data.user, result.data.token);
          setTimeout(() => {
            setIsOpen(false);
            window.location.href = '/'; // Redirect to homepage
          }, 1000);
        } else {
          setMessage(result.message || 'Login failed');
        }
      } else {
        // Registration request
        const registrationData = {
          fullName: formData.get('fullName'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          gender: formData.get('gender'),
          age: formData.get('age'),
          location: formData.get('location'),
          password: formData.get('password'),
          emergencyContactName: formData.get('emergencyContactName'),
          emergencyContactPhone: formData.get('emergencyContactPhone'),
          emergencyContactRelationship: formData.get('emergencyContactRelationship'),
          liveLocation: liveLocation,
          personalStatement: personalStatement,
          supportCategories: selectedSupport,
          otherSupportDetails: selectedSupport.includes('Other') ? otherSupportText : null
        };

        const registerUrl = `${apiBaseUrl}/auth/register`;
        console.log('Attempting registration to:', registerUrl);

        const response = await fetch(registerUrl, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(registrationData)
        });

        // Check if response is actually JSON for registration too
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const responseText = await response.text();
          console.error('Non-JSON response received:', responseText);
          
          if (responseText.includes('It works!') || responseText.includes('Apache')) {
            setMessage('Backend configuration error: API requests are not being routed to the Node.js server. Please check your server configuration.');
          } else {
            setMessage('Server configuration error: Expected JSON response but got HTML/text. Please check backend setup.');
          }
          return;
        }

        const result = await response.json();

        if (response.ok) {
          setMessage('Registration successful! Please sign in.');
          // Switch to login mode after successful registration
          setTimeout(() => {
            setIsLogin(true);
            setMessage('');
          }, 2000);
        } else {
          setMessage(result.message || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Auth error details:', error);
      
      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        setMessage('Server configuration error: The API endpoint is not configured correctly. Please check that your Node.js backend is properly set up and accessible.');
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setMessage('Network error: Unable to connect to server. Please check if the backend is running and accessible.');
      } else {
        setMessage('Network error. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-ngo-orange">
            {isLogin ? 'Welcome Back' : 'Join Our Community'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isLogin 
              ? 'Sign in to access your account and connect with our support community.' 
              : 'Create an account to join our mental health support community and access resources.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-ngo-orange">Basic Information</h3>
                
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ngo-orange focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ngo-orange focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ngo-orange focus:border-transparent outline-none transition-all"
                  />
                </div>

                <Select name="gender" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>

                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  required
                  min="1"
                  max="120"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ngo-orange focus:border-transparent outline-none transition-all"
                />

                <Select name="location" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select County (Kenya)" />
                  </SelectTrigger>
                  <SelectContent>
                    {kenyanCounties.map((county) => (
                      <SelectItem key={county} value={county}>{county}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Support Category */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-ngo-orange">Support Category</h3>
                <p className="text-sm text-gray-600">What type of support are you looking for? (Select all that apply)</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {supportOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option}
                        checked={selectedSupport.includes(option)}
                        onCheckedChange={(checked) => handleSupportChange(option, checked as boolean)}
                      />
                      <label htmlFor={option} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>

                {selectedSupport.includes('Other') && (
                  <Textarea
                    placeholder="Please specify other support needed (e.g., educational support, career guidance) - max 100 characters"
                    value={otherSupportText}
                    onChange={(e) => setOtherSupportText(e.target.value.slice(0, 100))}
                    maxLength={100}
                    className="focus:ring-2 focus:ring-ngo-orange focus:border-transparent"
                  />
                )}
              </div>

              {/* Personal Statement */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-ngo-orange">Personal Statement (Optional)</h3>
                <Textarea
                  placeholder="Tell us more about your situation or what kind of support you're seeking (e.g., struggling with anxiety and need peer support) - max 200 characters"
                  value={personalStatement}
                  onChange={(e) => setPersonalStatement(e.target.value.slice(0, 200))}
                  maxLength={200}
                  className="focus:ring-2 focus:ring-ngo-orange focus:border-transparent"
                />
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-ngo-orange">Emergency Contact</h3>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="emergencyContactName"
                    placeholder="Contact Name"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ngo-orange focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    placeholder="Contact Phone Number"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ngo-orange focus:border-transparent outline-none transition-all"
                  />
                </div>
                <input
                  type="text"
                  name="emergencyContactRelationship"
                  placeholder="Relationship (e.g. Parent, Sibling)"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ngo-orange focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Live Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Live Location <span className="text-red-500">*</span></label>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="px-4 py-2 bg-ngo-orange text-white rounded hover:bg-ngo-orange/90 transition-colors"
                >
                  {loadingLocation ? 'Detecting...' : 'Use Live Location'}
                </button>

                {liveLocation && (
                  <p className="text-sm text-gray-600">Detected: {liveLocation}</p>
                )}
                {locationError && (
                  <p className="text-sm text-red-600">{locationError}</p>
                )}
              </div>
            </>
          )}

          {/* Login fields */}
          {isLogin && (
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ngo-orange focus:border-transparent outline-none transition-all"
              />
            </div>
          )}

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              required
              className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ngo-orange focus:border-transparent outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {message && (
            <div className={`text-sm text-center p-2 rounded ${
              message.includes('successful') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
            }`}>
              {message}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-ngo-orange hover:bg-orange-600 text-white py-2 rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            {isSubmitting ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-ngo-orange hover:text-orange-600 text-sm transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;