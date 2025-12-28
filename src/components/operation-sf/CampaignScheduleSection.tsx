import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { 
  Calendar, ChevronDown, Copy, Target, Users, User, 
  MapPin, Clock, Crosshair, Building2
} from "lucide-react";

interface ScheduleEntry {
  time: string;
  location: string;
  target: string;
  move: string;
}

interface Phase {
  id: string;
  name: string;
  dates: string;
  objective: string;
  team: string;
  focus: string[];
  days: {
    label: string;
    title: string;
    entries: ScheduleEntry[];
  }[];
}

const phases: Phase[] = [
  {
    id: "infiltration",
    name: "PHASE 1: INFILTRATION",
    dates: "Jan 9–11",
    objective: "Intel, Setup, and Soft Targets.",
    team: "Solo",
    focus: ["Recon", "Relationships", "War Room"],
    days: [
      {
        label: "FRI",
        title: "FRIDAY, JAN 9: LANDFALL",
        entries: [
          { time: "12:00 PM", location: "Hotel", target: "Check-in", move: "Establish the 'War Room.'" },
          { time: "03:00 PM", location: "St. Regis / Four Seasons", target: "Recon Mission", move: "Walk the lobbies. Observe early arrivals." },
          { time: "07:00 PM", location: "Kokkari Estiatorio", target: "Dinner", move: "If you see a badge, buy them a drink." },
        ],
      },
      {
        label: "SAT",
        title: "SATURDAY, JAN 10: THE PERIMETER",
        entries: [
          { time: "10:00 AM", location: "The Grove (Yerba Buena)", target: "Coffee", move: "Watch for early VC arrivals." },
          { time: "02:00 PM", location: "War Room", target: "Target Prep", move: "Review Lovable links. Ensure 'Sovereign Seal' demo is flawless on mobile." },
          { time: "08:00 PM", location: "The View Lounge (Marriott Marquis)", target: "Drinks", move: "Biotech Showcase attendees land today." },
        ],
      },
      {
        label: "SUN",
        title: "SUNDAY, JAN 11: THE WHISPER PARTIES",
        entries: [
          { time: "04:00 PM", location: "The Clift", target: "Reception", move: "Early mixer. Be seen, gather intel." },
          { time: "06:00 PM", location: "St. Regis Lobby", target: "Night Before the War", move: "Be visible. Final positioning." },
        ],
      },
    ],
  },
  {
    id: "assault",
    name: "PHASE 2: THE ASSAULT",
    dates: "Jan 12–14",
    objective: "Hunt 'Big Dogs' + 'Young Guns' at maximum intensity.",
    team: "You, Chris, John",
    focus: ["Targets", "Divide & Conquer", "Close"],
    days: [
      {
        label: "MON",
        title: "MONDAY, JAN 12: SHOCK & AWE (Young Guns)",
        entries: [
          { time: "09:00 AM", location: "Westin St. Francis (Main Hall)", target: "AMBIENCE HEALTHCARE ($243M raised)", move: "\"You're moving at light speed. We are your brakes.\"" },
          { time: "12:00 PM", location: "J.P. Morgan Main Lunch", target: "Network Blitz", move: "Divide and conquer. Chris left, John right, you float." },
          { time: "03:00 PM", location: "St. Regis Suites", target: "HIPPOCRATIC AI ($126M raised) — CRITICAL", move: "\"You claim safety. SYNTH proves it. Let's run a $250k audit.\"" },
        ],
      },
      {
        label: "TUE",
        title: "TUESDAY, JAN 13: THE DATA WHALES (Big Dogs)",
        entries: [
          { time: "09:00 AM", location: "Four Seasons Lobby", target: "OPENEVIDENCE (Target $12B valuation) — THE BIG DOG", move: "\"You have zero insurance against hallucination liability. We are that insurance.\"" },
          { time: "01:00 PM", location: "Westin Mezzanine", target: "TENNR ($101M raised)", move: "\"We clean your data before it hits the model.\"" },
        ],
      },
      {
        label: "WED",
        title: "WEDNESDAY, JAN 14: THE EXIT (Chris & John depart)",
        entries: [
          { time: "09:00 AM", location: "Suites near Moscone/InterContinental", target: "ABRIDGE ($316M raised; $5.3B val)", move: "\"We provide the Sovereign Seal of privacy for every transcript.\"" },
          { time: "02:00 PM", location: "Pharma Suite", target: "FORMATION BIO ($372M raised)", move: "\"FDA trials require 100% accuracy. We guarantee it.\"" },
          { time: "05:00 PM", location: "War Room", target: "TEAM DEBRIEF", move: "Handover all contacts/notes before flights." },
        ],
      },
    ],
  },
  {
    id: "closer",
    name: "PHASE 3: THE CLOSER",
    dates: "Jan 15–16",
    objective: "Quiet days, decision makers only.",
    team: "You (Solo)",
    focus: ["Kingmakers", "Check Writers", "Lock Commits"],
    days: [
      {
        label: "THU",
        title: "THURSDAY, JAN 15: THE KINGMAKERS",
        entries: [
          { time: "10:00 AM", location: "St. Regis", target: "ANDREESSEN HOROWITZ (A16Z BIO)", move: "Text partners met earlier: \"I'm still here. Let's talk about protecting your portfolio.\"" },
          { time: "01:00 PM", location: "Khosla Ventures", target: "Alex Morgan (Partner)", move: "\"Vinod likes the impossible. We are the impossible.\"" },
          { time: "07:00 PM", location: "Hotel Zetta bar (The Cavalier)", target: "THE SURVIVORS DRINK", move: "Connect with those who stayed." },
        ],
      },
      {
        label: "FRI",
        title: "FRIDAY, JAN 16: DEBRIEF & DEPARTURE",
        entries: [
          { time: "09:00 AM", location: "Various", target: "Final coffee meetings", move: "Anyone who said 'maybe.'" },
          { time: "11:00 AM", location: "War Room", target: "Review 'Soft Commits'", move: "Tally results. Prep follow-ups." },
          { time: "02:00 PM", location: "SFO", target: "Wheels up", move: "Mission complete." },
        ],
      },
    ],
  },
];

const hitList = [
  { name: "OpenEvidence", valuation: "$12B target", hook: "The Whale" },
  { name: "Abridge", valuation: "$5.3B", hook: "The Shield" },
  { name: "Hippocratic AI", valuation: "$3.5B", hook: "The Safety Play" },
  { name: "Formation Bio", valuation: "$372M", hook: "The Pharma Play" },
  { name: "Ambience", valuation: "$1B", hook: "The OS Play" },
  { name: "Tennr", valuation: "$101M", hook: "The Automation Play" },
];

const CampaignScheduleSection = () => {
  const [openPhases, setOpenPhases] = useState<string[]>([]);

  const togglePhase = (id: string) => {
    setOpenPhases((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const copySchedule = () => {
    const text = `FULL CAMPAIGN SCHEDULE — JANUARY 9–16, 2026

Strategy:
• Jan 9–11 (The Setup): Establish the "Embassy," tip concierges, gather intel.
• Jan 12–14 (The Assault - With Team): Hunt "Big Dogs" + "Young Guns."
• Jan 15–16 (The Closer - You Only): Quiet days, decision makers only.

${phases.map(phase => `
${phase.name} (${phase.dates})
Objective: ${phase.objective}
Team: ${phase.team}

${phase.days.map(day => `
${day.title}
${day.entries.map(e => `• ${e.time} — ${e.location} — ${e.target}
  Move: ${e.move}`).join('\n')}`).join('\n')}`).join('\n')}

HIT LIST SUMMARY
${hitList.map(h => `• ${h.name} (${h.valuation}) — ${h.hook}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    toast.success("Full schedule copied to clipboard");
  };

  return (
    <section className="py-20 border-t border-border/30">
      <div className="container mx-auto px-4">
        {/* Header Strip */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
            <Calendar className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">Campaign Schedule</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Full Campaign Schedule</h2>
          <p className="text-xl md:text-2xl text-primary font-mono mb-2">JANUARY 9–16, 2026</p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto italic">
            "Arrive early to secure terrain; stay late to close when the noise clears."
          </p>
        </div>

        {/* Strategy Summary */}
        <Card className="max-w-4xl mx-auto mb-8 border-border/50 bg-muted/30">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-foreground mb-3">Strategy Overview</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="shrink-0 text-cyan-400 border-cyan-400/50">Jan 9–11</Badge>
                <span className="text-muted-foreground"><span className="text-foreground font-medium">The Setup:</span> Establish the "Embassy," tip concierges, gather intel.</span>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="shrink-0 text-orange-400 border-orange-400/50">Jan 12–14</Badge>
                <span className="text-muted-foreground"><span className="text-foreground font-medium">The Assault (With Team):</span> Hunt "Big Dogs" + "Young Guns."</span>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="shrink-0 text-emerald-400 border-emerald-400/50">Jan 15–16</Badge>
                <span className="text-muted-foreground"><span className="text-foreground font-medium">The Closer (Solo):</span> Quiet days, decision makers only.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase Accordions */}
        <div className="max-w-4xl mx-auto space-y-4 mb-8">
          {phases.map((phase) => (
            <Collapsible
              key={phase.id}
              open={openPhases.includes(phase.id)}
              onOpenChange={() => togglePhase(phase.id)}
            >
              <Card className={`border-border/50 transition-colors ${
                phase.id === "infiltration" ? "hover:border-cyan-500/50" :
                phase.id === "assault" ? "hover:border-orange-500/50" :
                "hover:border-emerald-500/50"
              }`}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          phase.id === "infiltration" ? "bg-cyan-500/20" :
                          phase.id === "assault" ? "bg-orange-500/20" :
                          "bg-emerald-500/20"
                        }`}>
                          <Target className={`h-5 w-5 ${
                            phase.id === "infiltration" ? "text-cyan-400" :
                            phase.id === "assault" ? "text-orange-400" :
                            "text-emerald-400"
                          }`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{phase.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{phase.dates}</p>
                        </div>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${
                        openPhases.includes(phase.id) ? "rotate-180" : ""
                      }`} />
                    </div>
                    {/* Collapsed summary */}
                    <div className="mt-3 pt-3 border-t border-border/30 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Objective:</span>
                        <p className="text-foreground font-medium">{phase.objective}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {phase.team === "Solo" || phase.team === "You (Solo)" ? (
                          <User className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Users className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-foreground">{phase.team}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {phase.focus.map((f) => (
                          <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-6">
                    {phase.days.map((day, dayIndex) => (
                      <div key={dayIndex} className="border-t border-border/30 pt-4">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className={`${
                            phase.id === "infiltration" ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" :
                            phase.id === "assault" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                            "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          }`}>
                            {day.label}
                          </Badge>
                          <h4 className="font-semibold text-foreground">{day.title}</h4>
                        </div>
                        <div className="space-y-3 pl-4 border-l-2 border-border/30 ml-3">
                          {day.entries.map((entry, entryIndex) => (
                            <div key={entryIndex} className="relative pl-4">
                              <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-primary/50 -translate-x-[5px]" />
                              <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-2">
                                <div className="flex items-center gap-1 text-sm text-primary font-mono">
                                  <Clock className="h-3 w-3" />
                                  {entry.time}
                                </div>
                                <div>
                                  <div className="flex items-start gap-2 flex-wrap">
                                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <MapPin className="h-3 w-3" />
                                      {entry.location}
                                    </span>
                                    <span className="text-sm text-muted-foreground">•</span>
                                    <span className="text-sm font-medium text-foreground flex items-center gap-1">
                                      <Crosshair className="h-3 w-3" />
                                      {entry.target}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1 italic">{entry.move}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>

        {/* Hit List Summary */}
        <Card className="max-w-4xl mx-auto border-red-500/30 bg-red-500/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/30">
                <Crosshair className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-red-400">Hit List Summary</CardTitle>
                <p className="text-sm text-muted-foreground">Primary targets for Operation SF</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {hitList.map((target, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-400 font-bold text-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-foreground">{target.name}</span>
                      <span className="text-xs text-muted-foreground">({target.valuation})</span>
                    </div>
                    <p className="text-sm text-primary font-medium">{target.hook}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Copy Button */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            onClick={copySchedule}
            className="border-primary/50 text-primary hover:bg-primary/10"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Full Schedule to Notes
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CampaignScheduleSection;
