import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, MapPin, Settings, UserPlus, Key, Smartphone, ScanLine, Rocket, Wifi, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const VenueOnboarding = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen overflow-y-auto bg-background text-foreground p-4 md:p-8"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Onboard a New Venue</h1>
          <p className="text-muted-foreground text-lg">Runbook — 10 minutes</p>
        </div>

        {/* What You Need */}
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-primary">
              <CheckCircle2 className="w-6 h-6" />
              What You Need (Before You Start)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Venue's <strong>Google Maps link</strong> OR <strong>website URL</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Manager email + phone
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Decide <strong>Age Policy</strong> (18+ or 21+)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                At least one staff device (Door) to run a test scan
              </li>
            </ul>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Step 1 */}
        <Card className="mb-6 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">1</div>
              <Building2 className="w-5 h-5 text-primary" />
              Create the Venue Profile
              <span className="text-sm text-muted-foreground font-normal ml-auto">2 min</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-3 ml-4 list-decimal list-inside text-muted-foreground">
              <li>In the Manager/Admin unit, tap <strong>Add Venue</strong></li>
              <li>Paste either:
                <ul className="ml-6 mt-2 space-y-1">
                  <li>• <strong>Google Maps link</strong> (fastest), OR</li>
                  <li>• the venue's <strong>website URL</strong></li>
                </ul>
              </li>
              <li>Tap <strong>Auto-Fill Venue</strong></li>
            </ol>
            <div className="bg-muted/30 rounded-lg p-4 mt-4">
              <p className="font-semibold mb-2">Confirm the match:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Verify <strong>venue name + address</strong></li>
                <li>• If multiple matches appear, select the correct one</li>
                <li>• If no match is found, use <strong>Manual Entry</strong> and continue</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card className="mb-6 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">2</div>
              <Settings className="w-5 h-5 text-primary" />
              Set the Venue Policy
              <span className="text-sm text-muted-foreground font-normal ml-auto">1 min</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 ml-4 list-decimal list-inside text-muted-foreground">
              <li>Open <strong>Venue Settings</strong></li>
              <li>Set <strong>Age Policy</strong>
                <ul className="ml-6 mt-2 space-y-1">
                  <li>• 18+ or 21+ (configurable per venue)</li>
                </ul>
              </li>
              <li>Save</li>
            </ol>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card className="mb-6 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">3</div>
              <UserPlus className="w-5 h-5 text-primary" />
              Add the Manager
              <span className="text-sm text-muted-foreground font-normal ml-auto">1 min</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 ml-4 list-decimal list-inside text-muted-foreground">
              <li>Add the venue's <strong>Manager/Admin</strong></li>
              <li>Send invite (email or SMS)</li>
              <li>Confirm they can log in</li>
            </ol>
          </CardContent>
        </Card>

        {/* Step 4 */}
        <Card className="mb-6 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">4</div>
              <Key className="w-5 h-5 text-primary" />
              Generate a Pairing Code
              <span className="text-sm text-muted-foreground font-normal ml-auto">1 min</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 ml-4 list-decimal list-inside text-muted-foreground">
              <li>Go to <strong>Devices</strong></li>
              <li>Tap <strong>Generate Pairing Code</strong></li>
              <li>Keep this code available (staff will enter it on their phones)</li>
            </ol>
          </CardContent>
        </Card>

        {/* Step 5 */}
        <Card className="mb-6 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">5</div>
              <Smartphone className="w-5 h-5 text-primary" />
              Pair Staff Devices
              <span className="text-sm text-muted-foreground font-normal ml-auto">3 min</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">On each staff device:</p>
            <ol className="space-y-3 ml-4 list-decimal list-inside text-muted-foreground">
              <li>Open <strong>GHOST™ Pass Scan</strong></li>
              <li>Tap <strong>Pair Device</strong></li>
              <li>Enter the <strong>Pairing Code</strong></li>
              <li>Choose the <strong>Role</strong>
                <ul className="ml-6 mt-1">
                  <li>• Door / Security / Host / Promoter</li>
                </ul>
              </li>
              <li>Enter <strong>Station Name</strong>
                <ul className="ml-6 mt-1">
                  <li>• Examples: Front, VIP, Patio</li>
                </ul>
              </li>
              <li>Confirm pairing</li>
            </ol>
            <div className="bg-muted/30 rounded-lg p-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Manager/Admin should verify devices appear as: <strong>Door — Front</strong>, <strong>Security — Patio</strong>, etc.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Step 6 */}
        <Card className="mb-6 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">6</div>
              <ScanLine className="w-5 h-5 text-primary" />
              Run a Test Scan
              <span className="text-sm text-muted-foreground font-normal ml-auto">2 min</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-3 ml-4 list-decimal list-inside text-muted-foreground">
              <li>Create or locate a test pass (test member/guest)</li>
              <li>On a Door device, scan the QR</li>
            </ol>
            <p className="font-semibold mt-4">Confirm:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✅</span> Allow works
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">⛔</span> Deny works (try an expired/revoked test token if available)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">🟨</span>
                <span>Manual Check flow works:
                  <ul className="ml-4 mt-1 text-sm">
                    <li>• photo required</li>
                    <li>• note required</li>
                    <li>• "Evidence Added" confirmation required</li>
                  </ul>
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Step 7 */}
        <Card className="mb-6 border-emerald-500/30 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-emerald-400">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">7</div>
              <Rocket className="w-5 h-5" />
              Go Live
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-3 ml-4 list-decimal list-inside text-muted-foreground">
              <li>Set venue status to <strong>Live</strong></li>
              <li>Confirm staff knows the 3 outcomes:
                <ul className="ml-6 mt-2 space-y-1">
                  <li>• <span className="text-green-500">Allow</span> / <span className="text-red-500">Deny</span> / <span className="text-amber-500">Manual Check</span> (with evidence)</li>
                </ul>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Offline Policy */}
        <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-amber-400">
              <Wifi className="w-6 h-6" />
              Offline Policy (Important)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">GHOST™ Pass is <strong>online-first</strong>.</p>
            <p className="text-muted-foreground">If internet is down:</p>
            <ul className="space-y-2 ml-4 text-muted-foreground">
              <li>• scanning may continue,</li>
              <li>• but <strong>Manual Check requires photo + note + Evidence Added</strong></li>
              <li>• escalate uncertain entries to manager.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Done Criteria */}
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-primary">
              <CheckCircle2 className="w-6 h-6" />
              Done Criteria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Venue is fully onboarded when:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Venue profile verified (name/address correct)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Age policy saved
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Manager invited + can log in
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                At least one Door device paired with Role + Station name
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Test scan completed successfully
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VenueOnboarding;
