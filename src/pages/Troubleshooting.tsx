import { useNavigate } from "react-router-dom";
import { ArrowLeft, Wifi, WifiOff, Camera, Key, HelpCircle, Upload, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Troubleshooting = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Troubleshooting</h1>
          <p className="text-muted-foreground text-lg">Fast Fixes for Common Issues</p>
        </div>

        {/* Offline Mode */}
        <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-amber-400">
              <WifiOff className="w-6 h-6" />
              "Offline mode" / Internet Down
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">You can continue scanning, but:</p>
            <ul className="space-y-3 ml-4">
              <li className="flex items-start gap-3">
                <Camera className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <span><strong>Manual Check requires photo + note</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <Upload className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <span>If uploads are delayed, scans should show <strong>"Pending Upload"</strong> until service returns</span>
              </li>
            </ul>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mt-4">
              <p className="text-amber-300 text-sm">
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                Escalate uncertain situations to the manager.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Camera Won't Scan */}
        <Card className="mb-6 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Camera className="w-6 h-6 text-primary" />
              Camera Won't Scan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">1</span>
                <span>Wipe camera lens</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">2</span>
                <span>Increase screen brightness on the guest's phone</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">3</span>
                <span>Move closer/farther until the QR locks in</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">4</span>
                <span>Close and reopen the app</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Pairing Code Not Working */}
        <Card className="mb-6 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Key className="w-6 h-6 text-primary" />
              Pairing Code Not Working
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">1</span>
                <span>Re-enter carefully (no spaces)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">2</span>
                <span>Confirm you are online</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">3</span>
                <span>Ask manager for a fresh pairing code</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Guest Says It Worked Last Time */}
        <Card className="mb-6 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-primary" />
              Guest Says "It Worked Last Time"
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">1</span>
                <span>Follow the scan result shown <strong>today</strong></span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">2</span>
                <span>If needed, do a <strong>Manual Check</strong> with evidence and escalate</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Quick Reference */}
        <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
          <p className="text-sm text-muted-foreground text-center">
            <Wifi className="w-4 h-4 inline mr-2" />
            When in doubt, escalate to your manager
          </p>
        </div>
      </div>
    </div>
  );
};

export default Troubleshooting;
