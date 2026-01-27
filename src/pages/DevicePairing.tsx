import { ArrowLeft, Smartphone, Key, MapPin, UserCheck, Tag, CheckCircle, XCircle, RefreshCw, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const DevicePairing = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen overflow-y-auto bg-background text-foreground p-4 md:p-8"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
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
            Device Pairing (Staff Units)
          </h1>
          <p className="text-muted-foreground">GHOST™ Pass Scan — Pairing Guide</p>
        </div>

        {/* What you need */}
        <Card className="mb-6 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-primary" />
              What You Need
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Key className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  The venue's <strong className="text-foreground">Pairing Code</strong> (provided by the manager)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  The staff device with <strong className="text-foreground">GHOST™ Pass Scan</strong> installed
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Wifi className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  The device must have an <strong className="text-foreground">internet connection</strong> (pairing is online)
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Pair a device */}
        <Card className="mb-6 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
              Pair a Device (1 minute)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <span className="text-muted-foreground">Open <strong className="text-foreground">GHOST™ Pass Scan</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <span className="text-muted-foreground">Tap <strong className="text-foreground">Pair Device</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <span className="text-muted-foreground">Enter the <strong className="text-foreground">Pairing Code</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">4</span>
                <span className="text-muted-foreground">Select the <strong className="text-foreground">Venue</strong> (if prompted)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">5</span>
                <div className="text-muted-foreground">
                  <span>Choose the <strong className="text-foreground">Role</strong></span>
                  <ul className="mt-2 ml-4 text-sm space-y-1">
                    <li>• Door / Security / Host / Promoter</li>
                  </ul>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">6</span>
                <div className="text-muted-foreground">
                  <span>Enter the <strong className="text-foreground">Station Name</strong></span>
                  <ul className="mt-2 ml-4 text-sm space-y-1">
                    <li>Examples: <code className="bg-muted px-1.5 py-0.5 rounded">Front</code>, <code className="bg-muted px-1.5 py-0.5 rounded">VIP</code>, <code className="bg-muted px-1.5 py-0.5 rounded">Patio</code>, <code className="bg-muted px-1.5 py-0.5 rounded">Bar Entrance</code></li>
                  </ul>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">7</span>
                <span className="text-muted-foreground"><strong className="text-foreground">Confirm</strong></span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Naming rules */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary" />
              Naming Rules (Important)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your device name in logs will appear as:
            </p>
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="font-mono text-lg text-center">
                <strong className="text-foreground">Role — Station Name</strong>
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Examples:</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-muted px-3 py-1.5 rounded-full text-sm font-medium">Door — Front</span>
                <span className="bg-muted px-3 py-1.5 rounded-full text-sm font-medium">Security — Patio</span>
                <span className="bg-muted px-3 py-1.5 rounded-full text-sm font-medium">Host — VIP</span>
              </div>
            </div>
            <p className="text-sm text-primary font-medium mt-4">
              Use short station names so logs stay readable.
            </p>
          </CardContent>
        </Card>

        {/* If pairing fails */}
        <Card className="mb-6 border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-destructive" />
              If Pairing Fails
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  Confirm the pairing code is correct (no extra spaces)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Wifi className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  Confirm the device is online
                </span>
              </li>
              <li className="flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  Close and reopen the app, then try again
                </span>
              </li>
              <li className="flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  If it still fails, ask the manager to generate a <strong className="text-foreground">new pairing code</strong>
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

export default DevicePairing;
