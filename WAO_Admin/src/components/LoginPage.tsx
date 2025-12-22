import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroBackground from "@/assets/hero-background.jpg";

interface LoginPageProps {
  onLogin: (credentials: { username: string; password: string }) => Promise<void> | void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onLogin({ username, password });
    } catch (e: any) {
      toast({ title: 'Login failed', description: e?.message || 'Unable to login', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Background */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 relative overflow-hidden"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-purple-800/40" />
        <div className="relative z-10 flex items-center justify-center w-full">
          <div className="text-center text-white">
            <div className="w-28 h-28 rounded-2xl mx-auto mb-6 shadow-elegant flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #ff844f 100%)' }}>
              <img src="/wao_favicon.jpg" alt="WAO" className="w-16 h-16 object-cover rounded-md" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Payment Admin</h1>
            <p className="text-lg opacity-90">Secure payment verification system</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <Card className="w-full max-w-md shadow-soft">
          <CardHeader className="text-center space-y-2">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
                 style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #ff844f 100%)' }}>
              <img src="/wao_favicon.jpg" alt="WAO" className="w-10 h-10 object-cover rounded-md" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">WE ARE ONE (WAO) Admin</CardTitle>
            <CardDescription className="text-base">
              Welcome to the WE ARE ONE Admin Portal<br />
              Manage your store and orders efficiently.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;