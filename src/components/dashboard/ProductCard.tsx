import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface ProductCardProps {
  type: 'toxicology' | 'sexual_health';
  title: string;
  price: string;
  icon: LucideIcon;
  onOrderClick: () => void;
}

export const ProductCard = ({ type, title, price, icon: Icon, onOrderClick }: ProductCardProps) => {
  const isToxicology = type === 'toxicology';
  
  const accentColor = isToxicology 
    ? 'from-blue-600 to-cyan-600' 
    : 'from-amber-600 via-yellow-600 to-amber-600';
  
  const borderColor = isToxicology
    ? 'border-blue-500/40'
    : 'border-amber-500/40';
    
  const bgGradient = isToxicology
    ? 'from-blue-50/80 to-cyan-50/80 dark:from-blue-950/40 dark:to-cyan-950/40'
    : 'from-amber-50/80 via-yellow-50/80 to-amber-50/80 dark:from-amber-950/40 dark:via-yellow-950/40 dark:to-amber-950/40';
    
  const shadowColor = isToxicology
    ? 'shadow-[0_0_40px_rgba(37,99,235,0.3)]'
    : 'shadow-[0_0_40px_rgba(217,119,6,0.3)]';
    
  const buttonGradient = isToxicology
    ? 'from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
    : 'from-amber-600 via-yellow-600 to-amber-600 hover:from-amber-700 hover:via-yellow-700 hover:to-amber-700';
    
  const buttonShadow = isToxicology
    ? 'shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:shadow-[0_0_40px_rgba(37,99,235,0.7)]'
    : 'shadow-[0_0_30px_rgba(217,119,6,0.5)] hover:shadow-[0_0_40px_rgba(217,119,6,0.7)]';

  return (
    <Card className={`border-2 ${borderColor} bg-gradient-to-br ${bgGradient} ${shadowColor}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-4">
          <CardTitle className={`text-2xl md:text-3xl bg-gradient-to-r ${accentColor} bg-clip-text text-transparent flex items-center gap-2`}>
            <Icon className={`h-7 w-7 ${isToxicology ? 'text-blue-600' : 'text-amber-600'}`} />
            {title}
          </CardTitle>
          <Badge variant="outline" className={`${isToxicology ? 'border-blue-500 text-blue-700 dark:text-blue-400' : 'border-amber-500 text-amber-700 dark:text-amber-400'} font-semibold`}>
            Lab-Certified
          </Badge>
        </div>
        <div className="text-center py-4">
          <p className={`text-4xl font-bold ${isToxicology ? 'text-blue-700 dark:text-blue-400' : 'text-amber-700 dark:text-amber-400'}`}>
            {price}
          </p>
          <p className="text-sm text-muted-foreground mt-1">One-Time Payment</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Marketing Explainer */}
        <div className="marketing-explainer space-y-4">
          {isToxicology ? (
            <>
              <p className="highlight-text text-base font-semibold text-foreground">
                <strong>Forensic Accuracy:</strong> Don't rely on cheap instant cups. This is a court-grade GC/MS lab screen.
              </p>
              
              <ul className="process-steps space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-base">📦</span>
                  <span><strong className="text-foreground">Discrete Ship:</strong> Arrives in a plain box. No markings.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-base">🧪</span>
                  <span><strong className="text-foreground">Simple Collection:</strong> 5-minute urine/saliva sample.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-base">🚀</span>
                  <span><strong className="text-foreground">Overnight Return:</strong> Pre-paid priority label included.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-base">✅</span>
                  <span><strong className="text-foreground">24-Hour Result:</strong> Certified status within 1 day of lab receipt.</span>
                </li>
              </ul>
              
              <p className="perfect-for text-sm bg-blue-600/10 dark:bg-blue-600/20 border border-blue-500/30 rounded-lg p-3">
                <strong className="text-blue-700 dark:text-blue-400">Best For:</strong> Staff Liability, Sober Verification, Personal Accountability.
              </p>
            </>
          ) : (
            <>
              <p className="highlight-text text-base font-semibold text-foreground">
                <strong>The "Hidden 3" Advantage:</strong> Standard clinics miss 30% of infections. We catch Trichomoniasis, Mycoplasma, and Ureaplasma.
              </p>
              
              <ul className="process-steps space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-base">🔒</span>
                  <span><strong className="text-foreground">Total Privacy:</strong> No insurance records. No doctor visits.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-base">🩸</span>
                  <span><strong className="text-foreground">Painless:</strong> Easy home collection (Urine + Finger Prick).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-base">✈️</span>
                  <span><strong className="text-foreground">Priority Lab:</strong> Skip the line. Fast-tracked processing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-base">🟢</span>
                  <span><strong className="text-foreground">90-Day Pass:</strong> Negative results activate to your QR Green Code, and posts the Lab Certified Badge instantly to your profile.</span>
                </li>
              </ul>
              
              <p className="perfect-for text-sm bg-amber-600/10 dark:bg-amber-600/20 border border-amber-500/30 rounded-lg p-3">
                <strong className="text-amber-700 dark:text-amber-400">Best For:</strong> Lifestyle Couples, High-Frequency Dating, Total Peace of Mind.
              </p>
            </>
          )}
        </div>

        {/* CTA Button */}
        <Button
          onClick={onOrderClick}
          size="lg"
          className={`w-full bg-gradient-to-r ${buttonGradient} text-white ${buttonShadow} text-lg px-8 py-6 min-h-[56px] touch-manipulation`}
        >
          <Icon className="mr-2 h-5 w-5" />
          Order Now - {price}
        </Button>
      </CardContent>
    </Card>
  );
};
