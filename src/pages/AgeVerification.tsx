import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useAgeVerification } from '@/hooks/useAgeVerification';

const AgeVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setVerified } = useAgeVerification();
  
  const [agreement, setAgreement] = useState(false);

  const handleExit = () => {
    window.location.href = 'https://www.google.com';
  };

  const handleEnter = () => {
    if (agreement) {
      setVerified(true);
      const from = (location.state as any)?.from || '/';
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-4xl font-bold">Clean Check</CardTitle>
          <CardDescription className="text-xl font-semibold">Age Verification Required</CardDescription>
          
          <div className="flex items-center justify-center gap-2 p-4 bg-destructive/10 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <span className="text-lg font-bold text-destructive">18+ Only</span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            This application contains sensitive health information and is intended for adults only. 
            You must be 18 years of age or older to use Clean Check.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Terms of Service & Consent</h3>
            
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Checkbox 
                id="agreement" 
                checked={agreement}
                onCheckedChange={(checked) => setAgreement(checked === true)}
              />
              <label htmlFor="agreement" className="text-sm font-semibold leading-tight cursor-pointer">
                I am 18 years of age or older, and I agree to the Terms of Service and Privacy Policy and Consent.
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              variant="destructive" 
              className="flex-1"
              onClick={handleExit}
            >
              ❌ I'm Under 18 / Exit
            </Button>
            <Button 
              variant="default"
              className="flex-1"
              onClick={handleEnter}
              disabled={!agreement}
            >
              ✅ Enter Clean Check
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground pt-2">
            By clicking "Enter Clean Check", you acknowledge that you have read and agreed to our terms.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgeVerification;
