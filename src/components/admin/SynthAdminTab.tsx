import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Bot, ScrollText, Settings2 } from "lucide-react";

export function SynthAdminTab() {
  const navigate = useNavigate();

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            SYNTH™ Senate Console
          </CardTitle>
          <CardDescription>
            4-Agent Senate: Skeptic, Optimist, Fact-Checker, and Realist (Grok).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">🔴 Skeptic</Badge>
            <Badge variant="outline">🟢 Optimist</Badge>
            <Badge variant="outline">🔵 Fact-Checker</Badge>
            <Badge variant="outline">⚡ Realist (Grok)</Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={() => navigate("/synth/admin")} className="justify-between">
              Open SYNTH Admin
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button variant="outline" onClick={() => navigate("/synth/logs")} className="justify-between">
              View Logs
              <ScrollText className="h-4 w-4" />
            </Button>

            <Button variant="outline" onClick={() => navigate("/synth/policies")} className="justify-between">
              Policies
              <Settings2 className="h-4 w-4" />
            </Button>

            <Button variant="outline" onClick={() => navigate("/synth/docs")} className="justify-between">
              Docs
              <BookOpen className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Use this console for high-stakes prompts where safety, accuracy, and bias resistance are mandatory.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
