
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showConfirmEmailNotice, setShowConfirmEmailNotice] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) navigate("/queries");
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = loginData;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Welcome back! ✨",
      description: "Login successful - redirecting to query editor...",
    });
    setTimeout(() => {
      navigate('/queries');
    }, 1000);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    const redirectUrl = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
      options: { emailRedirectTo: redirectUrl }
    });
    if (error) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    // Show persistent message instead of immediate toast
    setShowConfirmEmailNotice(true);
  };

  return (
    <div className="min-h-screen bg-query-gradient">
      <ParticleBackground />
      <Navbar />
      
      <div className="pt-20 pb-12 px-4 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md crystal-effect animate-slide-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold font-poppins">
              <span className="glow-text">Join the Magic</span>
            </CardTitle>
            <p className="text-gray-400 mt-2">
              Access your personal query wizard
            </p>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 glass-effect border-white/20 mb-6">
                <TabsTrigger 
                  value="login"
                  className="data-[state=active]:bg-neon-violet/20 data-[state=active]:text-neon-violet"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-neon-violet/20 data-[state=active]:text-neon-violet"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="glass-effect pl-10 text-white placeholder-gray-400 border-white/20 focus:border-neon-violet focus:ring-2 focus:ring-neon-violet/50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="glass-effect pl-10 pr-10 text-white placeholder-gray-400 border-white/20 focus:border-neon-violet focus:ring-2 focus:ring-neon-violet/50"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-neon-violet to-soft-blue hover:from-soft-blue hover:to-neon-violet text-white font-semibold py-3 rounded-lg shadow-glow hover:shadow-glow-lg transition-all duration-300"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                {!showConfirmEmailNotice ? (
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          type="text"
                          placeholder="Full Name"
                          value={signupData.name}
                          onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                          className="glass-effect pl-10 text-white placeholder-gray-400 border-white/20 focus:border-neon-violet focus:ring-2 focus:ring-neon-violet/50"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          type="email"
                          placeholder="Email"
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                          className="glass-effect pl-10 text-white placeholder-gray-400 border-white/20 focus:border-neon-violet focus:ring-2 focus:ring-neon-violet/50"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          className="glass-effect pl-10 pr-10 text-white placeholder-gray-400 border-white/20 focus:border-neon-violet focus:ring-2 focus:ring-neon-violet/50"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          type="password"
                          placeholder="Confirm Password"
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                          className="glass-effect pl-10 text-white placeholder-gray-400 border-white/20 focus:border-neon-violet focus:ring-2 focus:ring-neon-violet/50"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-neon-violet to-soft-blue hover:from-soft-blue hover:to-neon-violet text-white font-semibold py-3 rounded-lg shadow-glow hover:shadow-glow-lg transition-all duration-300"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Create Account
                    </Button>
                  </form>
                ) : (
                  <div className="text-center p-4">
                    <h3 className="text-lg font-semibold text-neon-violet mb-2">
                      Please check your email!
                    </h3>
                    <p className="text-gray-300">
                      We've sent a confirmation link to <span className="font-semibold">{signupData.email}</span>.<br />
                      After confirming, log in to your account.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                By continuing, you agree to our magical terms of service
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;

