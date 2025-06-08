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

interface AuthDialogProps {
  trigger: React.ReactNode;
}

const AuthDialog = ({ trigger }: AuthDialogProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedSupport, setSelectedSupport] = useState<string[]>([]);
  const [otherSupportText, setOtherSupportText] = useState('');
  const [personalStatement, setPersonalStatement] = useState('');

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
    'Other',
  ];

  const kenyanCounties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
    'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
    'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
    'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
    'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
    'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia',
    'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot',
  ];

  const handleSupportChange = (option: string, checked: boolean) => {
    if (checked) {
      setSelectedSupport([...selectedSupport, option]);
    } else {
      setSelectedSupport(selectedSupport.filter(item => item !== option));
      if (option === 'Other') setOtherSupportText('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);

    formData.append('support_categories', selectedSupport.join(', '));
    if (selectedSupport.includes('Other') && otherSupportText) {
      formData.append('other_support_details', otherSupportText);
    }

    if (personalStatement) {
      formData.append('personal_statement', personalStatement);
    }

    try {
      const response = await fetch('https://getform.io/f/bnlxngnb', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setMessage(
          isLogin
            ? 'Login successful!'
            : 'Registration successful! You can now join our WhatsApp community.'
        );
        if (!isLogin) localStorage.setItem('hasSignedUp', 'true');

        (e.target as HTMLFormElement).reset();
        setSelectedSupport([]);
        setOtherSupportText('');
        setPersonalStatement('');
      } else {
        setMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [liveLocation, setLiveLocation] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  const handleGetLocation = () => {
  setLoadingLocation(true);
  setLocationError('');
  navigator.geolocation.getCurrentPosition(
    async position => {
      const { latitude, longitude } = position.coords;

      try {
        // Nominatim reverse geocoding
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await response.json();
        const address = data.display_name || 'Unknown location';
      
        setLiveLocation(address);
      } catch (error) {
        setLocationError('Failed to get address from coordinates.');
      } finally {
        setLoadingLocation(false);
      }
    },
    error => {
      setLoadingLocation(false);
      setLocationError('Location access denied or unavailable.');
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
};

  

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-ngo-orange">
            {isLogin ? 'Welcome Back' : 'Join Our Community'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isLogin
              ? 'Sign in to access your account and connect with our support community.'
              : 'Create an account to join our mental health support community and access resources.'}
          </DialogDescription>
        </DialogHeader>

        <form
          action="https://formsubmit.co/weareone0624@gmail.com"
          method="POST"
          className="space-y-4"
>
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ngo-orange"
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ngo-orange"
          />
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            required
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ngo-orange"
          />
        </div>

        <Select name="gender" required>
          <SelectTrigger>
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
            <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>

        <input
          type="number"
          name="age"
          placeholder="Age"
          min={1}
          max={120}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ngo-orange"
        />

        <Select name="location" required>
          <SelectTrigger>
            <SelectValue placeholder="Select County (Kenya)" />
          </SelectTrigger>
          <SelectContent>
            {kenyanCounties.map(county => (
              <SelectItem key={county} value={county}>
                {county}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Support Categories */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-ngo-orange">Support Category</h3>
        <p className="text-sm text-gray-600">What type of support are you looking for? (Select all that apply)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {supportOptions.map(option => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={selectedSupport.includes(option)}
                onCheckedChange={checked => handleSupportChange(option, checked as boolean)}
              />
              <label htmlFor={option} className="text-sm font-medium">
                {option}
              </label>
            </div>
          ))}
        </div>
        {selectedSupport.includes('Other') && (
          <Textarea
            placeholder="Please specify other support needed (max 100 characters)"
            value={otherSupportText}
            onChange={e => setOtherSupportText(e.target.value.slice(0, 100))}
            maxLength={100}
            className="focus:ring-2 focus:ring-ngo-orange"
          />
        )}
      </div>

      {/* Personal Statement */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-ngo-orange">Personal Statement (Optional)</h3>
        <Textarea
          name="personalStatement"
          placeholder="Tell us more (max 200 characters)"
          value={personalStatement}
          onChange={e => setPersonalStatement(e.target.value.slice(0, 200))}
          maxLength={200}
          className="focus:ring-2 focus:ring-ngo-orange"
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
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ngo-orange"
    />
  </div>
  <div className="relative">
    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
    <input
      type="tel"
      name="emergencyContactPhone"
      placeholder="Contact Phone Number"
      required
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ngo-orange"
    />
  </div>
  <input
    type="text"
    name="emergencyContactRelationship"
    placeholder="Relationship (e.g. Parent, Sibling)"
    required
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ngo-orange"
  />
</div>

<div className="space-y-2">
  <label className="text-sm font-medium text-gray-700">Live Location</label>
  <button
    type="button"
    onClick={handleGetLocation}
    className="px-4 py-2 bg-ngo-orange text-white rounded hover:bg-ngo-orange/90"
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

<input type="hidden" name="live_location" value={liveLocation} />

    </>
  )}

  {isLogin && (
    <div className="relative">
      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        required
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ngo-orange"
      />
    </div>
  )}

  {/* Password field (common for both) */}
  <div className="relative">
    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
    <input
      type={showPassword ? 'text' : 'password'}
      name="password"
      placeholder="Password"
      required
      className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ngo-orange"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? <EyeOff /> : <Eye />}
    </button>
  </div>

  {/* Hidden fields for FormSubmit */}
  <input type="hidden" name="_captcha" value="false" />
  <input type="hidden" name="_next" value="https://httpsweareone.kreativestores.shop/communities/we-are-one2" />
  <input type="hidden" name="support_categories" value={selectedSupport.join(', ')} />
  {selectedSupport.includes('Other') && (
    <input type="hidden" name="other_support_details" value={otherSupportText} />
  )}
  <input type="hidden" name="personal_statement" value={personalStatement} />

  {/* Submit Button */}
  <Button
    type="submit"
    className="w-full bg-ngo-orange hover:bg-ngo-orange/90 text-white font-bold py-2 rounded-lg"
  >
    {isSubmitting ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')}
  </Button>

  {/* Switch Auth Mode */}
  <div className="text-center text-sm text-gray-600">
    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
    <button
      type="button"
      onClick={() => setIsLogin(!isLogin)}
      className="text-ngo-orange hover:underline font-medium"
    >
      {isLogin ? 'Sign up here' : 'Login here'}
    </button>
  </div>

  {/* Feedback message */}
  {message && (
    <p className="text-center text-sm font-medium text-ngo-orange">{message}</p>
  )}
</form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
