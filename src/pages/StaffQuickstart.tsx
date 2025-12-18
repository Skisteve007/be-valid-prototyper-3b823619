import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Camera, FileText, Wifi, WifiOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const StaffQuickstart = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.4)] animate-pulse">
            GHOST™ Pass Scan — Staff Quickstart
          </h1>
          <p className="text-muted-foreground">2-minute guide for Door, Security, and Host staff</p>
        </div>

        {/* Step 1 */}
        <Card className="mb-6 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
              Start of Shift (30 seconds)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Open <strong className="text-foreground">GHOST™ Pass Scan</strong></li>
              <li>Confirm you are on the correct <strong className="text-foreground">Venue</strong></li>
              <li>Confirm the <strong className="text-foreground">Age Policy</strong> shown on screen (18+ or 21+)</li>
              <li>Tap <strong className="text-foreground">Start Scanning</strong></li>
            </ol>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mt-4">
              <p className="text-sm flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-destructive" />
                <span>If the app says <strong>Offline</strong>, tell the manager immediately (you can still scan, but manual checks require evidence).</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card className="mb-6 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
              Scan a Guest (10 seconds each)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Ask the guest to open their <strong className="text-foreground">GHOST™ Wallet</strong> (or show their QR pass)</li>
              <li>Scan the QR code</li>
            </ol>

            <p className="text-sm text-muted-foreground mt-4">You will see one of three results:</p>

            {/* Allow */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="font-bold text-emerald-500">A) ALLOW (Green)</span>
              </div>
              <p className="text-sm text-muted-foreground">Let them in.</p>
            </div>

            {/* Deny */}
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-destructive" />
                <span className="font-bold text-destructive">B) DENY (Red)</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Do not allow entry.</li>
                <li>The screen will show a reason (expired, revoked, wrong venue, age policy, etc.).</li>
                <li>If they disagree, send them to the manager.</li>
              </ul>
            </div>

            {/* Manual Check */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-yellow-500">C) MANUAL CHECK (Yellow)</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Manual Check means: <strong className="text-foreground">entry is not automatically approved</strong>.
              </p>
              <div className="bg-background/50 rounded-lg p-3">
                <p className="font-semibold text-sm mb-2">Required steps (no exceptions):</p>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li className="flex items-start gap-2">
                    <span>1.</span>
                    <span>Tap <strong className="text-foreground">Manual Check</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Camera className="w-4 h-4 mt-0.5 text-primary" />
                    <span>Take a <strong className="text-foreground">photo</strong> (evidence) using the app — e.g., wristband, government ID (only if venue policy allows), or other venue-approved proof</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="w-4 h-4 mt-0.5 text-primary" />
                    <span>Add a <strong className="text-foreground">note</strong> (why you allowed/denied)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>4.</span>
                    <span>Tap <strong className="text-foreground">Confirm: Evidence Added</strong> (mandatory)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>5.</span>
                    <span>Then follow the on-screen decision: Allow or Deny</span>
                  </li>
                </ol>
              </div>
              <p className="text-sm text-destructive mt-3 font-medium">
                If you cannot add evidence, you must escalate to the manager.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card className="mb-6 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</span>
              If the Internet is Down (Offline Mode)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <WifiOff className="w-5 h-5" />
              <span>You can still scan, but:</span>
            </div>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-7">
              <li><strong className="text-foreground">Manual Check MUST include photo + note</strong></li>
              <li>If you can't upload immediately, the app should mark it <strong className="text-foreground">Pending Upload</strong> and sync later</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">When in doubt, call the manager.</p>
          </CardContent>
        </Card>

        {/* Step 4 */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</span>
              <Shield className="w-5 h-5 text-primary" />
              Golden Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Never</strong> accept a "verbal" manual approval with no evidence.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  If something feels off (screenshot QR, guest arguing, staff unsure), choose <strong className="text-foreground">Manual Check</strong> and document it.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Protect privacy:</strong> only capture what the app asks for and follow venue policy.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground mt-8">
          <p>Questions? Contact your venue manager.</p>
        </div>
      </div>
    </div>
  );
};

export default StaffQuickstart;
