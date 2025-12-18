import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Settings, Wifi, CheckCircle, XCircle, AlertTriangle, 
  Camera, FileText, WifiOff, Moon, ArrowLeft 
} from "lucide-react";

const ManagerQuickstart = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>GHOST™ Pass — Manager Quickstart | VALID™</title>
        <meta name="description" content="2-minute manager guide for venue setup and oversight with GHOST™ Pass" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.4)] animate-pulse">GHOST™ Pass — Manager Quickstart</h1>
              <Badge variant="outline" className="border-primary/50 text-primary">2 minutes</Badge>
            </div>
            <p className="text-muted-foreground">
              This guide is for the manager or desk unit running the venue setup and oversight.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {/* Step 1 */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
                  <CardTitle className="text-xl">Set the venue age policy</CardTitle>
                  <Badge variant="secondary">30 seconds</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Open the Manager unit / Admin view</li>
                  <li>Select your venue</li>
                  <li>Set <strong className="text-foreground">Age Policy</strong>: 18+ or 21+ (configurable per venue)</li>
                  <li>Save</li>
                </ol>
                <Button onClick={() => navigate("/manager-admin")} className="mt-4">
                  <Settings className="w-4 h-4 mr-2" />
                  Open Manager Admin
                </Button>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
                  <CardTitle className="text-xl">Confirm devices are connected</CardTitle>
                  <Badge variant="secondary">30 seconds</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">You should see your active units:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Door / Security / Host devices (scanners)</li>
                  <li>Manager unit (you)</li>
                </ul>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">If a unit is missing:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Verify it's logged in and assigned to the correct venue</li>
                    <li>If needed, re-pair the device (using the pairing flow)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</div>
                  <CardTitle className="text-xl">What scan outcomes mean</CardTitle>
                  <Badge variant="secondary">30 seconds</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Staff devices will show:</p>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <div>
                      <span className="font-bold text-green-500">Allow</span>
                      <span className="text-muted-foreground ml-2">— approved entry</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <XCircle className="w-6 h-6 text-red-500" />
                    <div>
                      <span className="font-bold text-red-500">Deny</span>
                      <span className="text-muted-foreground ml-2">— do not enter (expired/revoked/wrong venue/age policy)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-yellow-500" />
                    <div>
                      <span className="font-bold text-yellow-500">Manual Check</span>
                      <span className="text-muted-foreground ml-2">— requires manager-grade accountability</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="border-border/50 border-yellow-500/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold">4</div>
                  <CardTitle className="text-xl">Manual Check policy (must-have)</CardTitle>
                  <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">Required</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Manual Check is only valid if it includes <strong className="text-foreground">Evidence</strong>.
                </p>
                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <p className="font-medium">Required evidence:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <Camera className="w-4 h-4 text-primary" />
                      A <strong className="text-foreground">photo</strong> captured in-app (or attached)
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="w-4 h-4 text-primary" />
                      A <strong className="text-foreground">note</strong> explaining why the guest was allowed/denied
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      A mandatory confirmation action: <strong className="text-foreground">"Evidence Added"</strong>
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-red-400">If evidence is missing:</strong> Treat it as non-compliant and follow your venue policy (typically deny or re-check properly).
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Step 5 */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">5</div>
                  <CardTitle className="text-xl">When the internet is down (Offline procedure)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Offline is allowed, but accountability stays the same.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Staff can continue scanning</li>
                  <li>Manual Checks must still include <strong className="text-foreground">photo + note</strong></li>
                  <li>If uploads are delayed:
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>The system should mark the event <Badge variant="outline" className="ml-1">Pending Upload</Badge></li>
                      <li>Once connection returns, it syncs automatically</li>
                    </ul>
                  </li>
                </ul>
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <WifiOff className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Offline events sync when connectivity is restored</span>
                </div>
              </CardContent>
            </Card>

            {/* Step 6 */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">6</div>
                  <CardTitle className="text-xl">End of night</CardTitle>
                  <Badge variant="secondary">30 seconds</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Moon className="w-5 h-5 text-primary" />
                  <span className="font-medium">Review:</span>
                </div>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Manual Checks</li>
                  <li>Denies</li>
                  <li>Offline/Pending uploads</li>
                </ul>
                <p className="text-muted-foreground mt-4">Follow up on any incident notes.</p>
                <Button variant="outline" onClick={() => navigate("/manager-admin")} className="mt-4">
                  View Tonight's Scan Logs
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Footer CTA */}
          <div className="mt-8 p-6 bg-primary/10 border border-primary/30 rounded-xl text-center">
            <h3 className="text-xl font-bold mb-2">Ready to go?</h3>
            <p className="text-muted-foreground mb-4">Open the Manager Admin to configure your venue and start scanning.</p>
            <Button onClick={() => navigate("/manager-admin")} size="lg">
              Launch Manager Admin
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagerQuickstart;
