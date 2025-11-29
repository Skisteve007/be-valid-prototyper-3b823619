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
  
  const [termsAccepted, setTermsAccepted] = useState({
    age18: false,
    peerToPeer: false,
    notMedical: false,
    liability: false,
    nonRefundable: false,
    accurateInfo: false,
    legalConsequences: false,
  });
  
  const [finalAgreement, setFinalAgreement] = useState(false);

  const allTermsAccepted = Object.values(termsAccepted).every(Boolean) && finalAgreement;

  const handleExit = () => {
    window.location.href = 'https://www.google.com';
  };

  const handleEnter = () => {
    if (allTermsAccepted) {
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
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Checkbox 
                  id="age18" 
                  checked={termsAccepted.age18}
                  onCheckedChange={(checked) => 
                    setTermsAccepted(prev => ({ ...prev, age18: checked === true }))
                  }
                />
                <label htmlFor="age18" className="text-sm leading-tight cursor-pointer">
                  I confirm that I am 18 years of age or older
                </label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox 
                  id="peerToPeer" 
                  checked={termsAccepted.peerToPeer}
                  onCheckedChange={(checked) => 
                    setTermsAccepted(prev => ({ ...prev, peerToPeer: checked === true }))
                  }
                />
                <label htmlFor="peerToPeer" className="text-sm leading-tight cursor-pointer">
                  I understand this is a peer-to-peer health information sharing platform
                </label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox 
                  id="notMedical" 
                  checked={termsAccepted.notMedical}
                  onCheckedChange={(checked) => 
                    setTermsAccepted(prev => ({ ...prev, notMedical: checked === true }))
                  }
                />
                <label htmlFor="notMedical" className="text-sm leading-tight cursor-pointer">
                  Clean Check is not a medical or financial service provider
                </label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox 
                  id="liability" 
                  checked={termsAccepted.liability}
                  onCheckedChange={(checked) => 
                    setTermsAccepted(prev => ({ ...prev, liability: checked === true }))
                  }
                />
                <label htmlFor="liability" className="text-sm leading-tight cursor-pointer">
                  I release Clean Check from all liability for health, financial, or informational consequences
                </label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox 
                  id="nonRefundable" 
                  checked={termsAccepted.nonRefundable}
                  onCheckedChange={(checked) => 
                    setTermsAccepted(prev => ({ ...prev, nonRefundable: checked === true }))
                  }
                />
                <label htmlFor="nonRefundable" className="text-sm leading-tight cursor-pointer">
                  All membership contributions are non-refundable and final
                </label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox 
                  id="accurateInfo" 
                  checked={termsAccepted.accurateInfo}
                  onCheckedChange={(checked) => 
                    setTermsAccepted(prev => ({ ...prev, accurateInfo: checked === true }))
                  }
                />
                <label htmlFor="accurateInfo" className="text-sm leading-tight cursor-pointer">
                  I agree to provide accurate and truthful health information
                </label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox 
                  id="legalConsequences" 
                  checked={termsAccepted.legalConsequences}
                  onCheckedChange={(checked) => 
                    setTermsAccepted(prev => ({ ...prev, legalConsequences: checked === true }))
                  }
                />
                <label htmlFor="legalConsequences" className="text-sm leading-tight cursor-pointer">
                  I understand that sharing false information may have legal consequences
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-start gap-3">
              <Checkbox 
                id="finalAgreement" 
                checked={finalAgreement}
                onCheckedChange={(checked) => setFinalAgreement(checked === true)}
              />
              <label htmlFor="finalAgreement" className="text-sm font-semibold leading-tight cursor-pointer">
                I am 18 years of age or older and I agree to the Terms of Service and Privacy Policy
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
              disabled={!allTermsAccepted}
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
