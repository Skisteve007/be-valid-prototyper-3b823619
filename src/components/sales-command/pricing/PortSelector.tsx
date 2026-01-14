import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Building2, 
  Scale, 
  HeartPulse, 
  GraduationCap, 
  Ticket, 
  ShieldCheck,
  Truck,
  Users,
  CreditCard,
  FileText,
  Database,
  Cloud,
  MessageSquare,
  Mail,
  Phone,
  Briefcase,
  BarChart3,
  Lock,
  Building,
  Car,
  Plane,
  Hotel,
  UtensilsCrossed,
  Music,
  Theater,
  Gamepad2,
  Warehouse,
  Factory,
  Landmark,
  Stethoscope,
  Pill,
  FlaskConical,
  BookOpen,
  ShoppingCart,
  Store,
  Banknote,
  Receipt,
  ClipboardList,
  CalendarDays,
  MapPin,
  Fingerprint,
  Camera,
  Wifi,
  Server
} from "lucide-react";

export interface Port {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  description: string;
}

interface PortCategory {
  name: string;
  ports: Port[];
}

// Comprehensive list of all possible integration ports
export const PORT_CATEGORIES: PortCategory[] = [
  {
    name: "CRM & Sales",
    ports: [
      { id: "salesforce", name: "Salesforce", category: "CRM & Sales", icon: <Cloud className="h-4 w-4" />, description: "CRM & Sales Cloud" },
      { id: "hubspot", name: "HubSpot", category: "CRM & Sales", icon: <Building2 className="h-4 w-4" />, description: "Inbound CRM" },
      { id: "dynamics365", name: "Dynamics 365", category: "CRM & Sales", icon: <Building className="h-4 w-4" />, description: "Microsoft CRM" },
      { id: "zoho", name: "Zoho CRM", category: "CRM & Sales", icon: <Users className="h-4 w-4" />, description: "SMB CRM" },
      { id: "pipedrive", name: "Pipedrive", category: "CRM & Sales", icon: <BarChart3 className="h-4 w-4" />, description: "Sales Pipeline" },
      { id: "freshsales", name: "Freshsales", category: "CRM & Sales", icon: <MessageSquare className="h-4 w-4" />, description: "Freshworks CRM" }
    ]
  },
  {
    name: "Legal & Compliance",
    ports: [
      { id: "clio", name: "Clio", category: "Legal & Compliance", icon: <Scale className="h-4 w-4" />, description: "Legal Practice Management" },
      { id: "westlaw", name: "Westlaw", category: "Legal & Compliance", icon: <BookOpen className="h-4 w-4" />, description: "Legal Research" },
      { id: "lexisnexis", name: "LexisNexis", category: "Legal & Compliance", icon: <FileText className="h-4 w-4" />, description: "Legal Analytics" },
      { id: "practicepanther", name: "PracticePanther", category: "Legal & Compliance", icon: <Briefcase className="h-4 w-4" />, description: "Law Firm Software" },
      { id: "lawpay", name: "LawPay", category: "Legal & Compliance", icon: <CreditCard className="h-4 w-4" />, description: "Legal Payments" },
      { id: "myclients", name: "MyCase", category: "Legal & Compliance", icon: <ClipboardList className="h-4 w-4" />, description: "Case Management" }
    ]
  },
  {
    name: "Healthcare & Life Sciences",
    ports: [
      { id: "epic", name: "Epic Systems", category: "Healthcare & Life Sciences", icon: <HeartPulse className="h-4 w-4" />, description: "EHR/EMR" },
      { id: "cerner", name: "Cerner (Oracle)", category: "Healthcare & Life Sciences", icon: <Stethoscope className="h-4 w-4" />, description: "Health IT" },
      { id: "meditech", name: "MEDITECH", category: "Healthcare & Life Sciences", icon: <Database className="h-4 w-4" />, description: "Hospital IS" },
      { id: "athenahealth", name: "athenahealth", category: "Healthcare & Life Sciences", icon: <Cloud className="h-4 w-4" />, description: "Cloud HIT" },
      { id: "allscripts", name: "Allscripts", category: "Healthcare & Life Sciences", icon: <Pill className="h-4 w-4" />, description: "Clinical Software" },
      { id: "labcorp", name: "LabCorp", category: "Healthcare & Life Sciences", icon: <FlaskConical className="h-4 w-4" />, description: "Diagnostics" },
      { id: "quest", name: "Quest Diagnostics", category: "Healthcare & Life Sciences", icon: <FlaskConical className="h-4 w-4" />, description: "Lab Testing" }
    ]
  },
  {
    name: "Finance & Banking",
    ports: [
      { id: "plaid", name: "Plaid", category: "Finance & Banking", icon: <Banknote className="h-4 w-4" />, description: "Banking API" },
      { id: "stripe", name: "Stripe", category: "Finance & Banking", icon: <CreditCard className="h-4 w-4" />, description: "Payments" },
      { id: "quickbooks", name: "QuickBooks", category: "Finance & Banking", icon: <Receipt className="h-4 w-4" />, description: "Accounting" },
      { id: "netsuite", name: "NetSuite", category: "Finance & Banking", icon: <Building2 className="h-4 w-4" />, description: "ERP/Financial" },
      { id: "sap", name: "SAP", category: "Finance & Banking", icon: <Factory className="h-4 w-4" />, description: "Enterprise ERP" },
      { id: "xero", name: "Xero", category: "Finance & Banking", icon: <BarChart3 className="h-4 w-4" />, description: "Cloud Accounting" },
      { id: "bloomberg", name: "Bloomberg Terminal", category: "Finance & Banking", icon: <Landmark className="h-4 w-4" />, description: "Financial Data" }
    ]
  },
  {
    name: "Education",
    ports: [
      { id: "canvas", name: "Canvas LMS", category: "Education", icon: <GraduationCap className="h-4 w-4" />, description: "Learning Management" },
      { id: "blackboard", name: "Blackboard", category: "Education", icon: <BookOpen className="h-4 w-4" />, description: "Education Platform" },
      { id: "powerschool", name: "PowerSchool", category: "Education", icon: <Users className="h-4 w-4" />, description: "K-12 SIS" },
      { id: "ellucian", name: "Ellucian Banner", category: "Education", icon: <Database className="h-4 w-4" />, description: "Higher Ed ERP" },
      { id: "workday_student", name: "Workday Student", category: "Education", icon: <Cloud className="h-4 w-4" />, description: "Student Information" },
      { id: "moodle", name: "Moodle", category: "Education", icon: <BookOpen className="h-4 w-4" />, description: "Open-source LMS" }
    ]
  },
  {
    name: "Events & Ticketing",
    ports: [
      { id: "ticketmaster", name: "Ticketmaster", category: "Events & Ticketing", icon: <Ticket className="h-4 w-4" />, description: "Live Events" },
      { id: "eventbrite", name: "Eventbrite", category: "Events & Ticketing", icon: <CalendarDays className="h-4 w-4" />, description: "Event Management" },
      { id: "axs", name: "AXS", category: "Events & Ticketing", icon: <Ticket className="h-4 w-4" />, description: "Venue Ticketing" },
      { id: "stubhub", name: "StubHub", category: "Events & Ticketing", icon: <ShoppingCart className="h-4 w-4" />, description: "Ticket Marketplace" },
      { id: "seatgeek", name: "SeatGeek", category: "Events & Ticketing", icon: <MapPin className="h-4 w-4" />, description: "Ticket Platform" },
      { id: "universe", name: "Universe", category: "Events & Ticketing", icon: <Theater className="h-4 w-4" />, description: "Event Ticketing" }
    ]
  },
  {
    name: "Access Control & Security",
    ports: [
      { id: "lenel", name: "LenelS2", category: "Access Control & Security", icon: <Lock className="h-4 w-4" />, description: "Physical Security" },
      { id: "ccure", name: "C•CURE 9000", category: "Access Control & Security", icon: <ShieldCheck className="h-4 w-4" />, description: "Access Control" },
      { id: "genetec", name: "Genetec", category: "Access Control & Security", icon: <Camera className="h-4 w-4" />, description: "Security Center" },
      { id: "brivo", name: "Brivo", category: "Access Control & Security", icon: <Wifi className="h-4 w-4" />, description: "Cloud Access" },
      { id: "openpath", name: "Openpath", category: "Access Control & Security", icon: <Fingerprint className="h-4 w-4" />, description: "Mobile Access" },
      { id: "kisi", name: "Kisi", category: "Access Control & Security", icon: <Lock className="h-4 w-4" />, description: "Smart Access" }
    ]
  },
  {
    name: "Transportation & Fleet",
    ports: [
      { id: "samsara", name: "Samsara", category: "Transportation & Fleet", icon: <Truck className="h-4 w-4" />, description: "Fleet Management" },
      { id: "motive", name: "Motive (KeepTruckin)", category: "Transportation & Fleet", icon: <Truck className="h-4 w-4" />, description: "Fleet Tracking" },
      { id: "geotab", name: "Geotab", category: "Transportation & Fleet", icon: <MapPin className="h-4 w-4" />, description: "Telematics" },
      { id: "fleetcomplete", name: "Fleet Complete", category: "Transportation & Fleet", icon: <Car className="h-4 w-4" />, description: "Fleet Solutions" },
      { id: "turo", name: "Turo", category: "Transportation & Fleet", icon: <Car className="h-4 w-4" />, description: "Car Sharing" },
      { id: "uber_fleet", name: "Uber for Business", category: "Transportation & Fleet", icon: <Car className="h-4 w-4" />, description: "Corporate Rides" }
    ]
  },
  {
    name: "Hospitality & Travel",
    ports: [
      { id: "opera", name: "Oracle OPERA", category: "Hospitality & Travel", icon: <Hotel className="h-4 w-4" />, description: "Hotel PMS" },
      { id: "mews", name: "Mews", category: "Hospitality & Travel", icon: <Building className="h-4 w-4" />, description: "Hospitality Cloud" },
      { id: "cloudbeds", name: "Cloudbeds", category: "Hospitality & Travel", icon: <Cloud className="h-4 w-4" />, description: "Hospitality Suite" },
      { id: "amadeus", name: "Amadeus", category: "Hospitality & Travel", icon: <Plane className="h-4 w-4" />, description: "Travel Tech" },
      { id: "sabre", name: "Sabre", category: "Hospitality & Travel", icon: <Plane className="h-4 w-4" />, description: "Travel Solutions" },
      { id: "toast", name: "Toast", category: "Hospitality & Travel", icon: <UtensilsCrossed className="h-4 w-4" />, description: "Restaurant POS" }
    ]
  },
  {
    name: "Nightlife & Entertainment",
    ports: [
      { id: "nowait", name: "Nowait (Yelp)", category: "Nightlife & Entertainment", icon: <UtensilsCrossed className="h-4 w-4" />, description: "Waitlist" },
      { id: "resy", name: "Resy", category: "Nightlife & Entertainment", icon: <CalendarDays className="h-4 w-4" />, description: "Reservations" },
      { id: "opentable", name: "OpenTable", category: "Nightlife & Entertainment", icon: <UtensilsCrossed className="h-4 w-4" />, description: "Dining Reservations" },
      { id: "tablelist", name: "Tablelist", category: "Nightlife & Entertainment", icon: <Music className="h-4 w-4" />, description: "Nightlife Booking" },
      { id: "discotech", name: "Discotech", category: "Nightlife & Entertainment", icon: <Music className="h-4 w-4" />, description: "Club Reservations" },
      { id: "venuepilot", name: "VenuePilot", category: "Nightlife & Entertainment", icon: <Theater className="h-4 w-4" />, description: "Venue Management" }
    ]
  },
  {
    name: "POS & Commerce",
    ports: [
      { id: "square", name: "Square", category: "POS & Commerce", icon: <CreditCard className="h-4 w-4" />, description: "Payments & POS" },
      { id: "clover", name: "Clover", category: "POS & Commerce", icon: <Store className="h-4 w-4" />, description: "Business POS" },
      { id: "lightspeed", name: "Lightspeed", category: "POS & Commerce", icon: <ShoppingCart className="h-4 w-4" />, description: "Retail/Restaurant" },
      { id: "shopify_pos", name: "Shopify POS", category: "POS & Commerce", icon: <Store className="h-4 w-4" />, description: "Retail POS" },
      { id: "revel", name: "Revel Systems", category: "POS & Commerce", icon: <Receipt className="h-4 w-4" />, description: "iPad POS" },
      { id: "ncr", name: "NCR", category: "POS & Commerce", icon: <Server className="h-4 w-4" />, description: "Enterprise POS" }
    ]
  },
  {
    name: "Identity & Verification",
    ports: [
      { id: "footprint", name: "Footprint", category: "Identity & Verification", icon: <Fingerprint className="h-4 w-4" />, description: "IDV/KYC" },
      { id: "persona", name: "Persona", category: "Identity & Verification", icon: <ShieldCheck className="h-4 w-4" />, description: "Identity Verification" },
      { id: "jumio", name: "Jumio", category: "Identity & Verification", icon: <Camera className="h-4 w-4" />, description: "AI Identity" },
      { id: "onfido", name: "Onfido", category: "Identity & Verification", icon: <Fingerprint className="h-4 w-4" />, description: "Document Verification" },
      { id: "socure", name: "Socure", category: "Identity & Verification", icon: <Lock className="h-4 w-4" />, description: "Identity Graph" },
      { id: "clear", name: "CLEAR", category: "Identity & Verification", icon: <ShieldCheck className="h-4 w-4" />, description: "Identity Network" }
    ]
  },
  {
    name: "HR & Workforce",
    ports: [
      { id: "workday", name: "Workday", category: "HR & Workforce", icon: <Users className="h-4 w-4" />, description: "HCM Suite" },
      { id: "adp", name: "ADP", category: "HR & Workforce", icon: <Briefcase className="h-4 w-4" />, description: "Payroll/HR" },
      { id: "bamboohr", name: "BambooHR", category: "HR & Workforce", icon: <Users className="h-4 w-4" />, description: "HR Software" },
      { id: "gusto", name: "Gusto", category: "HR & Workforce", icon: <Receipt className="h-4 w-4" />, description: "Payroll" },
      { id: "rippling", name: "Rippling", category: "HR & Workforce", icon: <Cloud className="h-4 w-4" />, description: "Employee Platform" },
      { id: "namely", name: "Namely", category: "HR & Workforce", icon: <Users className="h-4 w-4" />, description: "HR Platform" }
    ]
  },
  {
    name: "Communication",
    ports: [
      { id: "slack", name: "Slack", category: "Communication", icon: <MessageSquare className="h-4 w-4" />, description: "Team Messaging" },
      { id: "teams", name: "Microsoft Teams", category: "Communication", icon: <Users className="h-4 w-4" />, description: "Collaboration" },
      { id: "zoom", name: "Zoom", category: "Communication", icon: <Camera className="h-4 w-4" />, description: "Video Conferencing" },
      { id: "twilio", name: "Twilio", category: "Communication", icon: <Phone className="h-4 w-4" />, description: "Communications API" },
      { id: "sendgrid", name: "SendGrid", category: "Communication", icon: <Mail className="h-4 w-4" />, description: "Email Delivery" },
      { id: "intercom", name: "Intercom", category: "Communication", icon: <MessageSquare className="h-4 w-4" />, description: "Customer Messaging" }
    ]
  },
  {
    name: "Gaming & Casinos",
    ports: [
      { id: "igt", name: "IGT", category: "Gaming & Casinos", icon: <Gamepad2 className="h-4 w-4" />, description: "Gaming Systems" },
      { id: "aristocrat", name: "Aristocrat", category: "Gaming & Casinos", icon: <Gamepad2 className="h-4 w-4" />, description: "Gaming Tech" },
      { id: "konami", name: "Konami Gaming", category: "Gaming & Casinos", icon: <Gamepad2 className="h-4 w-4" />, description: "Casino Systems" },
      { id: "everi", name: "Everi", category: "Gaming & Casinos", icon: <CreditCard className="h-4 w-4" />, description: "FinTech Gaming" },
      { id: "lightandwonder", name: "Light & Wonder", category: "Gaming & Casinos", icon: <Gamepad2 className="h-4 w-4" />, description: "Game Content" }
    ]
  },
  {
    name: "Warehouse & Logistics",
    ports: [
      { id: "manhattan", name: "Manhattan Associates", category: "Warehouse & Logistics", icon: <Warehouse className="h-4 w-4" />, description: "Supply Chain" },
      { id: "highjump", name: "HighJump (Körber)", category: "Warehouse & Logistics", icon: <Warehouse className="h-4 w-4" />, description: "WMS" },
      { id: "shipstation", name: "ShipStation", category: "Warehouse & Logistics", icon: <Truck className="h-4 w-4" />, description: "Shipping" },
      { id: "easypost", name: "EasyPost", category: "Warehouse & Logistics", icon: <Truck className="h-4 w-4" />, description: "Shipping API" },
      { id: "flexport", name: "Flexport", category: "Warehouse & Logistics", icon: <Plane className="h-4 w-4" />, description: "Freight" }
    ]
  }
];

// Get all ports flattened
export const ALL_PORTS: Port[] = PORT_CATEGORIES.flatMap(cat => cat.ports);

interface PortSelectorProps {
  selectedPorts: string[];
  onPortsChange: (ports: string[]) => void;
  maxPorts?: number;
}

export function PortSelector({ selectedPorts, onPortsChange, maxPorts }: PortSelectorProps) {
  const togglePort = (portId: string) => {
    if (selectedPorts.includes(portId)) {
      onPortsChange(selectedPorts.filter(p => p !== portId));
    } else {
      onPortsChange([...selectedPorts, portId]);
    }
  };

  const selectedCount = selectedPorts.length;

  return (
    <div className="space-y-4">
      {/* Selected Count */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium">Ports Connected</span>
        <Badge 
          variant="outline" 
          className={`font-mono text-lg px-4 py-1 ${
            maxPorts && selectedCount > maxPorts 
              ? 'border-amber-500/50 text-amber-400' 
              : 'border-primary/50 text-primary'
          }`}
        >
          {selectedCount} selected
          {maxPorts && maxPorts !== -1 && (
            <span className="text-muted-foreground ml-1">/ {maxPorts} included</span>
          )}
        </Badge>
      </div>

      {/* Selected Ports Display */}
      {selectedPorts.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
          {selectedPorts.map(portId => {
            const port = ALL_PORTS.find(p => p.id === portId);
            if (!port) return null;
            return (
              <Badge 
                key={portId}
                variant="secondary"
                className="flex items-center gap-1.5 px-2 py-1 cursor-pointer hover:bg-destructive/20 transition-colors"
                onClick={() => togglePort(portId)}
              >
                {port.icon}
                {port.name}
                <span className="text-xs opacity-50">×</span>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Port Categories */}
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {PORT_CATEGORIES.map(category => (
            <div key={category.name} className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {category.name}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {category.ports.map(port => {
                  const isSelected = selectedPorts.includes(port.id);
                  return (
                    <button
                      key={port.id}
                      type="button"
                      onClick={() => togglePort(port.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-lg text-left text-sm transition-all ${
                        isSelected
                          ? 'bg-primary/20 border border-primary/50 text-foreground'
                          : 'bg-black/20 border border-border/30 text-muted-foreground hover:border-border/50 hover:bg-black/30'
                      }`}
                    >
                      <div className={`p-1.5 rounded ${isSelected ? 'bg-primary/30' : 'bg-muted/20'}`}>
                        {port.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`block font-medium truncate ${isSelected ? 'text-foreground' : ''}`}>
                          {port.name}
                        </span>
                        <span className="block text-xs text-muted-foreground truncate">
                          {port.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
