import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Camera, FileText, Shield, Eye, AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const ScanningDecisions = () => {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Scanning & Decisions
          </h1>
          <p className="text-muted-foreground">Allow / Deny / Manual Check — What each result means</p>
        </div>

        {/* Scan Outcomes */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Scan Outcomes</h2>
          
          {/* Allow */}
          <Card className="mb-4 border-emerald-500/30 bg-emerald-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-500">
                <CheckCircle className="w-6 h-6" />
                ALLOW (Green)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Entry is approved.</li>
                <li>• <strong className="text-foreground">Let the guest in.</strong></li>
              </ul>
            </CardContent>
          </Card>

          {/* Deny */}
          <Card className="mb-4 border-destructive/30 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <XCircle className="w-6 h-6" />
                DENY (Red)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Entry is not approved.</li>
                <li>• <strong className="text-foreground">Do not allow entry.</strong></li>
                <li>• The reason will be shown (expired, revoked, wrong venue, age policy, etc.).</li>
                <li>• If the guest disputes it, escalate to manager.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Manual Check */}
          <Card className="mb-4 border-yellow-500/30 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-500">
                <AlertTriangle className="w-6 h-6" />
                MANUAL CHECK (Yellow)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">Manual Check is required when:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• The system can't confirm entry automatically, OR</li>
                <li>• Something looks suspicious, OR</li>
                <li>• A manager requests documentation.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Manual Check Requirements */}
        <Card className="mb-6 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-primary" />
              Manual Check Requirements (Mandatory)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you choose Manual Check, you <strong className="text-foreground">must</strong>:
            </p>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Camera className="w-4 h-4 text-primary" />
                  <span>Capture a <strong className="text-foreground">photo</strong> (evidence) inside the app</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>Add a <strong className="text-foreground">note</strong></span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Tap <strong className="text-foreground">Confirm: Evidence Added</strong> (required)</span>
                </div>
              </li>
            </ol>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mt-4">
              <p className="text-sm text-destructive font-medium">
                If you cannot provide evidence, escalate to the manager.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Common Suspicious Cases */}
        <Card className="mb-6 border-yellow-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-yellow-500" />
              Common Suspicious Cases (Use Manual Check)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
                <span className="text-muted-foreground">Guest shows a <strong className="text-foreground">screenshot QR</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
                <span className="text-muted-foreground">Guest is <strong className="text-foreground">arguing / unclear situation</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
                <span className="text-muted-foreground">Scan result is <strong className="text-foreground">inconsistent</strong> with the person presenting it</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
                <span className="text-muted-foreground"><strong className="text-foreground">Offline mode</strong> is active (internet is down)</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Privacy Note */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Privacy Note
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Only collect evidence the app requests and follow venue policy. <strong className="text-foreground">Do not store extra photos outside the app.</strong>
            </p>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground mt-8">
          <p>Questions? Contact your venue manager.</p>
        </div>
      </div>
    </div>
  );
};

export default ScanningDecisions;
