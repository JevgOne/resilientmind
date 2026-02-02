import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Download,
  Heart,
  Shield,
  Compass,
  CheckCircle2,
  Mail,
  Loader2
} from 'lucide-react';
import Logo from '@/components/Logo';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const nameSchema = z.string().min(2, 'Name must be at least 2 characters');

interface FormData {
  name: string;
  email: string;
  agreeToEmails: boolean;
}

const FreeGuide = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    agreeToEmails: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form data
    try {
      nameSchema.parse(formData.name);
      emailSchema.parse(formData.email);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
        setIsLoading(false);
        return;
      }
    }

    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('user_id, email')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingUser) {
        // User exists, send magic link to login
        const { error } = await supabase.auth.signInWithOtp({
          email: formData.email,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard?free_guide=true`,
          },
        });

        if (error) throw error;

        toast.success('Check your email for login link!');
        setIsSuccess(true);
      } else {
        // New user, create account with magic link (passwordless)
        const { error } = await supabase.auth.signInWithOtp({
          email: formData.email,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard?free_guide=true`,
            data: {
              full_name: formData.name,
              source: 'free_guide',
            },
          },
        });

        if (error) throw error;

        toast.success('Welcome! Check your email to access your free guide.');
        setIsSuccess(true);
      }

      // Lead captured successfully

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Success state UI
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-background flex flex-col">
        {/* Header */}
        <header className="p-6">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </header>

        {/* Success Message */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-8">
              <Link to="/">
                <Logo className="h-16 w-auto" />
              </Link>
            </div>

            <Card className="border-gold/20 shadow-elegant text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-gold/10 p-4">
                    <Mail className="h-12 w-12 text-gold" />
                  </div>
                </div>
                <CardTitle className="font-serif text-2xl">Check Your Email!</CardTitle>
                <CardDescription className="text-base mt-4">
                  We've sent you a magic link to access your free guide
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-cream/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-left">
                      Click the link in your email to get started
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-left">
                      Email should arrive within 2 minutes
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-left">
                      Check your spam folder if you don't see it
                    </p>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  Sent to: <span className="font-medium text-foreground">{formData.email}</span>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="w-full border-gold/30 hover:bg-gold/5"
                >
                  <Link to="/">Return to homepage</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Main form UI
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-background flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link to="/">
              <Logo className="h-16 w-auto" />
            </Link>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-gold/10 p-6">
                <Download className="h-12 w-12 text-gold" />
              </div>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
              Immediate Techniques to Find Calm in Cultural Chaos
            </h1>
            <p className="text-xl text-muted-foreground">
              3 Proven Resilience Techniques You Can Use Right Now
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* What You'll Get */}
            <Card className="border-gold/20 shadow-elegant">
              <CardHeader>
                <CardTitle className="font-serif text-xl">What You'll Get</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Free Access to Intro Videos</p>
                    <p className="text-sm text-muted-foreground">
                      Instant access after entering email
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">No Credit Card Required</p>
                    <p className="text-sm text-muted-foreground">
                      100% free, no strings attached
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Immediate Relief</p>
                    <p className="text-sm text-muted-foreground">
                      Start using techniques right away
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="border-gold/20 shadow-elegant">
              <CardHeader>
                <CardTitle className="font-serif text-xl">You'll Learn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Quick Stress Relief</p>
                    <p className="text-sm text-muted-foreground">
                      Techniques for culture shock moments
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Grounding Exercises</p>
                    <p className="text-sm text-muted-foreground">
                      You can do anywhere, anytime
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Compass className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Rebuild Confidence</p>
                    <p className="text-sm text-muted-foreground">
                      Simple practices for unfamiliar environments
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Email Capture Form */}
          <Card className="border-gold/20 shadow-elegant">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-center">
                  Get Your Free Guide
                </CardTitle>
                <CardDescription className="text-center">
                  Join 500+ expats building resilience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="border-gold/30 focus:border-gold"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="border-gold/30 focus:border-gold"
                  />
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <Checkbox
                    id="agree"
                    checked={formData.agreeToEmails}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, agreeToEmails: checked as boolean })
                    }
                    className="border-gold/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold mt-1"
                  />
                  <Label htmlFor="agree" className="text-sm text-muted-foreground font-normal cursor-pointer">
                    I agree to receive helpful resilience tips (optional)
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gold hover:bg-gold-dark text-white text-lg py-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Get My Free Guide'
                  )}
                </Button>

                {/* Trust Indicators */}
                <div className="pt-4 space-y-2 text-center text-sm text-muted-foreground">
                  <p>No spam, unsubscribe anytime</p>
                  <p>
                    By signing up, you agree to our{' '}
                    <Link to="/terms" className="text-gold hover:underline">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-gold hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default FreeGuide;
