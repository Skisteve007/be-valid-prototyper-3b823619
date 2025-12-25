import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Patents = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3 text-2xl">
              <Shield className="h-6 w-6 text-cyan-400" />
              Patents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Patent Pending Status */}
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <p className="text-cyan-400 font-bold text-lg">Patent Pending (Provisional)</p>
            </div>

            {/* Main Content */}
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Giant Ventures, LLC (Texas) has filed one or more provisional patent applications relating to the Valid / SYNTH / Ghost Protocol systems, including certain governance, validation, auditability, security/privacy, and deployment mechanisms, and related variants and embodiments.
              </p>
              
              <p className="text-sm text-gray-400 border-t border-white/10 pt-4">
                This notice is provided for informational purposes only and does not constitute a license, waiver, or limitation of any rights. Features, names, and implementations may change without notice.
              </p>
            </div>

            {/* Company Attribution */}
            <div className="mt-8 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-500">
                © 2025 Giant Ventures, LLC (Texas). All rights reserved.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Patents;
