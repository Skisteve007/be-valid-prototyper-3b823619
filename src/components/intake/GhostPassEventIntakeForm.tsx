import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Ghost,
  Calendar,
  MapPin,
  Users,
  Ticket,
  Wallet,
  Building2,
  UserPlus,
  Store,
  Shield,
  Settings,
  FileText,
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
} from 'lucide-react';

const passTypeSchema = z.object({
  name: z.string().min(1, 'Pass name required'),
  duration: z.string(),
  price: z.number().min(0),
  appliesTo: z.string(),
  refundable: z.boolean(),
});

const promoterSchema = z.object({
  name: z.string().min(1, 'Name required'),
  role: z.string(),
  splitPercent: z.number().min(0).max(100),
  splitAppliesTo: z.string(),
  paidRealTime: z.boolean(),
  stripeConnectExists: z.boolean(),
});

const vendorSchema = z.object({
  name: z.string().min(1, 'Vendor name required'),
  type: z.string(),
  placement: z.string(),
  numStations: z.number().min(1),
  participatesInPool: z.boolean(),
  requiresId: z.boolean(),
});

const formSchema = z.object({
  // Section 1: Event Basics
  eventName: z.string().min(1, 'Event name is required'),
  eventStartDate: z.string().min(1, 'Start date is required'),
  eventEndDate: z.string().optional(),
  venueName: z.string().optional(),
  venueAddress: z.string().optional(),
  estimatedAttendance: z.string(),
  
  // Section 2: Entry Structure
  entryTypes: z.array(z.string()),
  numExteriorGaPoints: z.number().min(0),
  numExteriorVipPoints: z.number().min(0),
  numInteriorReentryPoints: z.number().min(0),
  reentryAllowed: z.boolean(),
  
  // Section 3: Pass Types
  passTypes: z.array(passTypeSchema),
  
  // Section 4: Wallet & Payment
  acceptedWalletMethods: z.array(z.string()),
  platformFeeEnabled: z.boolean(),
  platformFeeAmount: z.number().optional(),
  
  // Section 5: Payout & Settlement
  legalBusinessName: z.string().optional(),
  entityType: z.string(),
  bankAccountCountry: z.string(),
  settlementCurrency: z.string(),
  stripeConnectExists: z.boolean(),
  payoutTiming: z.string(),
  
  // Section 6: Promoter Splits
  hasPromoter: z.boolean(),
  promoterSplits: z.array(promoterSchema),
  
  // Section 7: Vendors
  vendors: z.array(vendorSchema),
  
  // Section 8: ID Requirements
  idRequiredFor: z.array(z.string()),
  idMandatoryAtEntry: z.boolean(),
  additionalAttributes: z.array(z.string()),
  
  // Section 9: Operations
  interactionMethod: z.string(),
  enableRealtimeDashboard: z.boolean(),
  estimatedStaffAtPeak: z.number().optional(),
  
  // Section 10: Compliance
  jurisdictionNotes: z.string().optional(),
  specialInstructions: z.string().optional(),
  
  // Submitter info
  submitterEmail: z.string().email('Valid email required'),
});

type FormData = z.infer<typeof formSchema>;

interface GhostPassEventIntakeFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GhostPassEventIntakeForm = ({ isOpen, onClose }: GhostPassEventIntakeFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: '',
      eventStartDate: '',
      eventEndDate: '',
      venueName: '',
      venueAddress: '',
      estimatedAttendance: '0-250',
      entryTypes: [],
      numExteriorGaPoints: 1,
      numExteriorVipPoints: 0,
      numInteriorReentryPoints: 0,
      reentryAllowed: false,
      passTypes: [{ name: 'General Admission', duration: '1 Day', price: 25, appliesTo: 'GA', refundable: false }],
      acceptedWalletMethods: ['apple_pay', 'google_pay', 'card'],
      platformFeeEnabled: true,
      platformFeeAmount: 2.50,
      legalBusinessName: '',
      entityType: 'LLC',
      bankAccountCountry: 'US',
      settlementCurrency: 'USD',
      stripeConnectExists: false,
      payoutTiming: 'daily',
      hasPromoter: false,
      promoterSplits: [],
      vendors: [],
      idRequiredFor: ['alcohol'],
      idMandatoryAtEntry: false,
      additionalAttributes: [],
      interactionMethod: 'both',
      enableRealtimeDashboard: true,
      estimatedStaffAtPeak: 10,
      jurisdictionNotes: '',
      specialInstructions: '',
      submitterEmail: '',
    },
  });

  const { fields: passTypeFields, append: appendPassType, remove: removePassType } = useFieldArray({
    control: form.control,
    name: 'passTypes',
  });

  const { fields: promoterFields, append: appendPromoter, remove: removePromoter } = useFieldArray({
    control: form.control,
    name: 'promoterSplits',
  });

  const { fields: vendorFields, append: appendVendor, remove: removeVendor } = useFieldArray({
    control: form.control,
    name: 'vendors',
  });

  const sections = [
    { title: 'Event Basics', icon: Calendar },
    { title: 'Entry Structure', icon: Ticket },
    { title: 'Pass Types & Pricing', icon: Ticket },
    { title: 'Wallet & Payment', icon: Wallet },
    { title: 'Payout & Settlement', icon: Building2 },
    { title: 'Promoter Splits', icon: UserPlus },
    { title: 'Vendors', icon: Store },
    { title: 'ID Requirements', icon: Shield },
    { title: 'Operations', icon: Settings },
    { title: 'Compliance & Submit', icon: FileText },
  ];

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('ghost_pass_event_intakes')
        .insert({
          submitter_email: data.submitterEmail,
          event_name: data.eventName,
          event_start_date: data.eventStartDate,
          event_end_date: data.eventEndDate || null,
          venue_name: data.venueName || null,
          venue_address: data.venueAddress || null,
          estimated_attendance: data.estimatedAttendance,
          entry_types: data.entryTypes,
          num_exterior_ga_entry_points: data.numExteriorGaPoints,
          num_exterior_vip_entry_points: data.numExteriorVipPoints,
          num_interior_reentry_points: data.numInteriorReentryPoints,
          reentry_allowed: data.reentryAllowed,
          pass_types: data.passTypes,
          accepted_wallet_methods: data.acceptedWalletMethods,
          platform_fee_enabled: data.platformFeeEnabled,
          platform_fee_amount: data.platformFeeAmount || null,
          legal_business_name: data.legalBusinessName || null,
          entity_type: data.entityType,
          bank_account_country: data.bankAccountCountry,
          settlement_currency: data.settlementCurrency,
          stripe_connect_exists: data.stripeConnectExists,
          payout_timing: data.payoutTiming,
          has_promoter: data.hasPromoter,
          promoter_splits: data.promoterSplits,
          vendors: data.vendors,
          id_required_for: data.idRequiredFor,
          id_mandatory_at_entry: data.idMandatoryAtEntry,
          additional_attributes: data.additionalAttributes,
          interaction_method: data.interactionMethod,
          enable_realtime_dashboard: data.enableRealtimeDashboard,
          estimated_staff_at_peak: data.estimatedStaffAtPeak || null,
          jurisdiction_notes: data.jurisdictionNotes || null,
          special_instructions: data.specialInstructions || null,
        });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: 'Event Intake Submitted',
        description: 'Your Ghost Pass event configuration has been submitted for review.',
      });
    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: 'Submission Failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setCurrentSection(0);
    form.reset();
    onClose();
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center text-center py-8">
            <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Submission Complete!</h2>
            <p className="text-muted-foreground mb-6">
              Your Ghost Pass event intake has been submitted. Our team will review your configuration and reach out within 24-48 hours.
            </p>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              <Ghost className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Ghost Pass Event Intake Survey</DialogTitle>
              <DialogDescription>
                Configure your wallet-based access, identity, and payout system
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Intro Text */}
        <div className="px-6 py-3 bg-cyan-500/10 border-y border-cyan-500/20">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Important:</strong> Ghost Pass is not just ticketing or payments. 
            It is a wallet-based access, identity, and payout system. The information collected here determines 
            who gets paid, how access works, and how liability is handled.
          </p>
        </div>

        {/* Section Navigation */}
        <div className="px-6 py-3 border-b">
          <div className="flex gap-1 overflow-x-auto pb-2">
            {sections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentSection(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    currentSection === idx
                      ? 'bg-cyan-500 text-white'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {section.title}
                </button>
              );
            })}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[50vh] px-6">
              <div className="py-4 space-y-6">
                {/* SECTION 0: Event Basics */}
                {currentSection === 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="text-cyan-500 border-cyan-500">Section 1</Badge>
                      <h3 className="font-semibold">Event Basics</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="eventName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter event name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="eventStartDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Start Date *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="eventEndDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="venueName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Venue Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter venue name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="venueAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Venue Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter full address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estimatedAttendance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Attendance</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0-250">0–250</SelectItem>
                              <SelectItem value="250-500">250–500</SelectItem>
                              <SelectItem value="500-1000">500–1,000</SelectItem>
                              <SelectItem value="1000-2000">1,000–2,000</SelectItem>
                              <SelectItem value="2000-5000">2,000–5,000</SelectItem>
                              <SelectItem value="5000+">5,000+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="submitterEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@company.com" {...field} />
                          </FormControl>
                          <FormDescription>We'll use this to follow up on your submission</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* SECTION 1: Entry Structure */}
                {currentSection === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="text-cyan-500 border-cyan-500">Section 2</Badge>
                      <h3 className="font-semibold">Entry Structure</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="entryTypes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Entry Types Offered</FormLabel>
                          <div className="space-y-2">
                            {['General Admission', 'VIP', 'Staff / Crew'].map((type) => (
                              <div key={type} className="flex items-center gap-2">
                                <Checkbox
                                  checked={field.value?.includes(type)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, type]);
                                    } else {
                                      field.onChange(field.value.filter((v) => v !== type));
                                    }
                                  }}
                                />
                                <Label>{type}</Label>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="numExteriorGaPoints"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Exterior GA Entry Points</FormLabel>
                            <FormControl>
                              <Input type="number" min={0} {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="numExteriorVipPoints"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Exterior VIP Entry Points</FormLabel>
                            <FormControl>
                              <Input type="number" min={0} {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="numInteriorReentryPoints"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Interior / Re-Entry Points</FormLabel>
                            <FormControl>
                              <Input type="number" min={0} {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="reentryAllowed"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <FormLabel>Re-Entry Allowed?</FormLabel>
                            <FormDescription>Allow guests to leave and return</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* SECTION 2: Pass Types & Pricing */}
                {currentSection === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="text-cyan-500 border-cyan-500">Section 3</Badge>
                      <h3 className="font-semibold">Pass Types & Pricing</h3>
                    </div>

                    <FormDescription>
                      Pricing and duration are configurable and can be adjusted later by admin.
                    </FormDescription>

                    {passTypeFields.map((field, index) => (
                      <div key={field.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Pass {index + 1}</span>
                          {index > 0 && (
                            <Button type="button" variant="ghost" size="sm" onClick={() => removePassType(index)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`passTypes.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pass Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Weekend Pass" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`passTypes.${index}.duration`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Duration</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="1 Day">1 Day</SelectItem>
                                    <SelectItem value="3 Days">3 Days</SelectItem>
                                    <SelectItem value="7 Days">7 Days</SelectItem>
                                    <SelectItem value="Custom">Custom</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`passTypes.${index}.price`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" min={0} step={0.01} {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`passTypes.${index}.appliesTo`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Applies To</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="GA">GA</SelectItem>
                                    <SelectItem value="VIP">VIP</SelectItem>
                                    <SelectItem value="All">All</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name={`passTypes.${index}.refundable`}
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <FormLabel className="!mt-0">Refundable</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendPassType({ name: '', duration: '1 Day', price: 0, appliesTo: 'GA', refundable: false })}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Pass Type
                    </Button>
                  </div>
                )}

                {/* SECTION 3: Wallet & Payment */}
                {currentSection === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="text-cyan-500 border-cyan-500">Section 4</Badge>
                      <h3 className="font-semibold">Wallet & Payment Rules</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="acceptedWalletMethods"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Accepted Wallet Funding Methods</FormLabel>
                          <div className="space-y-2">
                            {[
                              { value: 'apple_pay', label: 'Apple Pay' },
                              { value: 'google_pay', label: 'Google Pay' },
                              { value: 'card', label: 'Credit / Debit' },
                            ].map((method) => (
                              <div key={method.value} className="flex items-center gap-2">
                                <Checkbox
                                  checked={field.value?.includes(method.value)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, method.value]);
                                    } else {
                                      field.onChange(field.value.filter((v) => v !== method.value));
                                    }
                                  }}
                                />
                                <Label>{method.label}</Label>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="platformFeeEnabled"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <FormLabel>Enable Ghost Pass Platform Usage Fee?</FormLabel>
                            <FormDescription>Platform fees are deducted automatically from the user wallet before payouts</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch('platformFeeEnabled') && (
                      <FormField
                        control={form.control}
                        name="platformFeeAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Platform Fee Amount ($)</FormLabel>
                            <FormControl>
                              <Input type="number" min={0} step={0.01} {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                )}

                {/* SECTION 4: Payout & Settlement */}
                {currentSection === 4 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="text-red-500 border-red-500">Section 5 — REQUIRED</Badge>
                      <h3 className="font-semibold">Payout & Settlement Details</h3>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-red-400">Why this must be collected:</strong> Ghost Pass does not hold funds. 
                        All payouts are automated and routed through connected accounts. 
                        Without this information, the system cannot settle transactions.
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="legalBusinessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Legal Business Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your registered business name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="entityType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Entity Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Individual">Individual</SelectItem>
                                <SelectItem value="LLC">LLC</SelectItem>
                                <SelectItem value="Corporation">Corporation</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bankAccountCountry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bank Account Country</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="US">United States</SelectItem>
                                <SelectItem value="CA">Canada</SelectItem>
                                <SelectItem value="GB">United Kingdom</SelectItem>
                                <SelectItem value="AU">Australia</SelectItem>
                                <SelectItem value="EU">European Union</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="settlementCurrency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Settlement Currency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="CAD">CAD</SelectItem>
                                <SelectItem value="GBP">GBP</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                                <SelectItem value="AUD">AUD</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="payoutTiming"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payout Timing Preference</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="realtime">Real-Time</SelectItem>
                                <SelectItem value="daily">Daily Batch</SelectItem>
                                <SelectItem value="weekly">Weekly Batch</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="stripeConnectExists"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <FormLabel>Stripe Connect Account Exists?</FormLabel>
                            <FormDescription>If no, onboarding will be required</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* SECTION 5: Promoter Splits */}
                {currentSection === 5 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="text-cyan-500 border-cyan-500">Section 6</Badge>
                      <h3 className="font-semibold">Promoter / Account Manager Splits</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="hasPromoter"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <FormLabel>Is a Promoter or Account Manager involved?</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch('hasPromoter') && (
                      <>
                        <FormDescription>
                          Promoter splits are applied automatically before venue settlement.
                        </FormDescription>

                        {promoterFields.map((field, index) => (
                          <div key={field.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Promoter {index + 1}</span>
                              <Button type="button" variant="ghost" size="sm" onClick={() => removePromoter(index)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <FormField
                                control={form.control}
                                name={`promoterSplits.${index}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Full Name / Entity Name</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`promoterSplits.${index}.role`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="Promoter">Promoter</SelectItem>
                                        <SelectItem value="Account Manager">Account Manager</SelectItem>
                                        <SelectItem value="Affiliate">Affiliate</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`promoterSplits.${index}.splitPercent`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Revenue Split %</FormLabel>
                                    <FormControl>
                                      <Input type="number" min={0} max={100} {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`promoterSplits.${index}.splitAppliesTo`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Split Applies To</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="Pass Sales Only">Pass Sales Only</SelectItem>
                                        <SelectItem value="Vendor Pool Only">Vendor Pool Only</SelectItem>
                                        <SelectItem value="Both">Both</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="flex gap-4">
                              <FormField
                                control={form.control}
                                name={`promoterSplits.${index}.paidRealTime`}
                                render={({ field }) => (
                                  <FormItem className="flex items-center gap-2">
                                    <FormControl>
                                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="!mt-0">Paid in Real Time</FormLabel>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`promoterSplits.${index}.stripeConnectExists`}
                                render={({ field }) => (
                                  <FormItem className="flex items-center gap-2">
                                    <FormControl>
                                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="!mt-0">Has Stripe Connect</FormLabel>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => appendPromoter({ name: '', role: 'Promoter', splitPercent: 10, splitAppliesTo: 'Both', paidRealTime: false, stripeConnectExists: false })}
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Promoter
                        </Button>
                      </>
                    )}
                  </div>
                )}

                {/* SECTION 6: Vendors */}
                {currentSection === 6 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="text-cyan-500 border-cyan-500">Section 7</Badge>
                      <h3 className="font-semibold">Vendors & Concessions</h3>
                    </div>

                    <FormDescription>
                      Vendors inherit event wallet permissions automatically.
                    </FormDescription>

                    {vendorFields.map((field, index) => (
                      <div key={field.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Vendor {index + 1}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeVendor(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`vendors.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Vendor Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`vendors.${index}.type`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Vendor Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Bar">Bar</SelectItem>
                                    <SelectItem value="Food">Food</SelectItem>
                                    <SelectItem value="Merchandise">Merchandise</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`vendors.${index}.placement`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Vendor Placement</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Exterior">Exterior</SelectItem>
                                    <SelectItem value="Interior">Interior</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`vendors.${index}.numStations`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Number of Stations</FormLabel>
                                <FormControl>
                                  <Input type="number" min={1} {...field} onChange={e => field.onChange(parseInt(e.target.value) || 1)} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex gap-4">
                          <FormField
                            control={form.control}
                            name={`vendors.${index}.participatesInPool`}
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-2">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel className="!mt-0">Participates in Vendor Pool</FormLabel>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`vendors.${index}.requiresId`}
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-2">
                                <FormControl>
                                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel className="!mt-0">Requires ID</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendVendor({ name: '', type: 'Bar', placement: 'Interior', numStations: 1, participatesInPool: true, requiresId: false })}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Vendor
                    </Button>
                  </div>
                )}

                {/* SECTION 7: ID Requirements */}
                {currentSection === 7 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="text-cyan-500 border-cyan-500">Section 8</Badge>
                      <h3 className="font-semibold">ID & Sensory Requirements</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="idRequiredFor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID Required For</FormLabel>
                          <div className="space-y-2">
                            {['Entry', 'Alcohol', 'VIP Areas'].map((item) => (
                              <div key={item} className="flex items-center gap-2">
                                <Checkbox
                                  checked={field.value?.includes(item.toLowerCase())}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, item.toLowerCase()]);
                                    } else {
                                      field.onChange(field.value.filter((v) => v !== item.toLowerCase()));
                                    }
                                  }}
                                />
                                <Label>{item}</Label>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="idMandatoryAtEntry"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <FormLabel>Is ID mandatory at entry?</FormLabel>
                            <FormDescription>Recommended: No (ID requested after purchase unless explicitly required)</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="additionalAttributes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Attributes Required</FormLabel>
                          <div className="space-y-2">
                            {['Medical Card', 'Age Verification', 'None'].map((item) => (
                              <div key={item} className="flex items-center gap-2">
                                <Checkbox
                                  checked={field.value?.includes(item.toLowerCase().replace(' ', '_'))}
                                  onCheckedChange={(checked) => {
                                    const val = item.toLowerCase().replace(' ', '_');
                                    if (checked) {
                                      field.onChange([...field.value, val]);
                                    } else {
                                      field.onChange(field.value.filter((v) => v !== val));
                                    }
                                  }}
                                />
                                <Label>{item}</Label>
                              </div>
                            ))}
                          </div>
                          <FormDescription>ID and attributes are requested after purchase unless explicitly required</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* SECTION 8: Operations */}
                {currentSection === 8 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="text-cyan-500 border-cyan-500">Section 9</Badge>
                      <h3 className="font-semibold">Operations & Experience</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="interactionMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Interaction Method</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="qr">QR Only</SelectItem>
                              <SelectItem value="nfc">NFC Tap Only</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="enableRealtimeDashboard"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <FormLabel>Enable Real-Time Dashboard?</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estimatedStaffAtPeak"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Staff at Peak Entry</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* SECTION 9: Compliance & Submit */}
                {currentSection === 9 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="text-cyan-500 border-cyan-500">Section 10</Badge>
                      <h3 className="font-semibold">Compliance & Notes</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="jurisdictionNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jurisdiction / Local Rules (optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Any local regulations or rules we should know about..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="specialInstructions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Instructions or Notes</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Any special requirements or notes for your event..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="my-6" />

                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-cyan-400">Upon Submission:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Event configuration is saved</li>
                        <li>• Entry QR codes are generated</li>
                        <li>• Vendor inheritance rules are applied</li>
                        <li>• Payout and split logic is locked in</li>
                        <li>• Configuration remains editable by admin</li>
                      </ul>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                      <p className="text-sm font-semibold text-amber-400">
                        Final Operator Principle: If it's not captured in the intake, it must not surprise us at the door or in payouts.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Footer Navigation */}
            <div className="p-4 border-t flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevSection}
                disabled={currentSection === 0}
              >
                Previous
              </Button>

              <div className="flex gap-2">
                {currentSection < sections.length - 1 ? (
                  <Button type="button" onClick={nextSection}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting} className="bg-cyan-500 hover:bg-cyan-600">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Event Intake'
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
