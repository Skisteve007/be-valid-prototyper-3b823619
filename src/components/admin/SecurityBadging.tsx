import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, Database, Lock, CheckCircle2 } from "lucide-react";
import { LabPartnersManager } from "./LabPartnersManager";

export const SecurityBadging = () => {
  return (
    <div className="space-y-6">
      {/* FHIR Standards Badge */}
      <Card className="border-2 border-green-500/20 bg-green-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            FHIR-Compatible Data Schema
          </CardTitle>
          <CardDescription>
            Our API follows Fast Healthcare Interoperability Resources (FHIR) standards for seamless integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/10">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                FHIR R4
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/10">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                HL7 Compliant
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/10">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                REST API
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/10">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                JSON Format
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Features
          </CardTitle>
          <CardDescription>
            Enterprise-grade security protocols protecting health data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <Key className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-semibold">API Key Authentication</p>
                <p className="text-sm text-muted-foreground">
                  Bearer token authentication with partner-specific API keys
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <Database className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-semibold">End-to-End Encryption</p>
                <p className="text-sm text-muted-foreground">
                  TLS 1.3 encryption for all data in transit
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <Lock className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-semibold">Row-Level Security</p>
                <p className="text-sm text-muted-foreground">
                  Database-level access controls ensuring data isolation
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <Shield className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-semibold">HIPAA-Ready Infrastructure</p>
                <p className="text-sm text-muted-foreground">
                  Architecture designed for healthcare data compliance
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Key Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Key Management
          </CardTitle>
          <CardDescription>
            Generate and manage API keys for lab partner integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LabPartnersManager />
        </CardContent>
      </Card>
    </div>
  );
};