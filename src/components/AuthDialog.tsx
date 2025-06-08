
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);

    // Add selected support options to form data
    formData.append('support_categories', selectedSupport.join(', '));
    if (selectedSupport.includes('Other') && otherSupportText) {
      formData.append('other_support_details', otherSupportText);
    }
    // Append personal statement
    if (personalStatement) {
      formData.append('personal_statement', personalStatement);
    }

    try {
      const response = await fetch('https://getform.io/f/bnlxngnb', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setMessage(isLogin
          ? 'Login successful!'
          : 'Registration successful! You can now join our WhatsApp community.');
        if (!isLogin) {
          localStorage.setItem('hasSignedUp', 'true');
        }
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

  return (
    <Dialog>
      <DialogTrigger asChild>
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
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>

                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  required
                  min={1}
                  max={120}
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
                  name="personalStatement"
                  placeholder="Tell us more about your situation or what kind of support you're seeking (e.g., struggling with anxiety and need peer support) - max 200 characters"
                  value={personalStatement}
                  onChange={(e) => setPersonalStatement(e.target.value.slice(0, 200))}
                  maxLength={200}
                  className="focus:ring-2 focus:ring-ngo-orange focus:border-transparent"
                />
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
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-ngo-orange hover:bg-ngo-orange/90 text-white font-bold py-2 rounded-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')}
          </Button>

          <p className="text-center text-sm text-gray-600">
            {isLogin ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-ngo-orange font-semibold hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-ngo-orange font-semibold hover:underline"
                >
                  Log in
                </button>
              </>
            )}
          </p>

          {message && (
            <p className={`text-center text-sm mt-2 ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;

