import { supabase } from '@/integrations/supabase/client';

interface PassType {
  name: string;
  duration: string;
  price: number;
  appliesTo: string;
  refundable: boolean;
}

interface EventIntakeData {
  // Event basics
  eventName: string;
  eventStartDate: string;
  eventEndDate?: string;
  venueName?: string;
  venueAddress?: string;
  estimatedAttendance: string;
  submitterEmail: string;
  
  // Entry structure
  entryTypes: string[];
  numExteriorGaPoints: number;
  numExteriorVipPoints: number;
  numInteriorReentryPoints: number;
  reentryAllowed: boolean;
  interiorLocations: string[];
  numBarLocations: number;
  numServerStations: number;
  numTableServiceAreas: number;
  numFoodConcessions: number;
  numMerchLocations: number;
  numVipLounges?: number;
  
  // Hardware
  numCountertopUnits: number;
  countertopLocations?: string;
  numHandheldUnits: number;
  handheldLocations?: string;
  
  // Pass types
  passTypes: PassType[];
  
  // Payment & Fees
  acceptedWalletMethods: string[];
  platformFeeEnabled: boolean;
  platformFeeAmount?: number;
  settlementCurrency: string;
  
  // ID verification
  idRequiredFor: string[];
  idMandatoryAtEntry: boolean;
  additionalAttributes: string[];
  idVerificationTier: string;
  
  // Interaction
  interactionMethod: string;
  
  // Wearables
  wearableIntegrationRequired: boolean;
  wearableUseGhostPass: boolean;
  wearableTypes: string[];
  wearableVendorContactName?: string;
  wearableVendorContactEmail?: string;
  wearableVendorCompany?: string;
  wearableApiEndpoint?: string;
  wearableApiNotes?: string;
  
  // Outside vendors
  hasOutsideVendors: boolean;
  outsideVendorCount: number;
  outsideVendorTypes: string[];
  
  // Payout
  legalBusinessName?: string;
  entityType: string;
  bankAccountCountry: string;
  stripeConnectExists: boolean;
  payoutTiming: string;
  payoutDestination?: {
    method: string;
    accountEmail?: string;
    accountPhone?: string;
  };
  
  // Promoter
  hasPromoter: boolean;
  promoterSplits: any[];
  
  // Vendors
  vendors: any[];
  
  // Operations
  enableRealtimeDashboard: boolean;
  estimatedStaffAtPeak?: number;
  numManagementAccessCodes: number;
  numOwnershipGatewayCodes: number;
  
  // Sensory
  sensoryCargosEnabled: boolean;
  sensoryAudiology: boolean;
  sensoryVisual: boolean;
  sensoryTaste: boolean;
  sensoryTouch: boolean;
  sensoryOlfactory: boolean;
  sensoryAtmospheric: boolean;
  sensoryNotes?: string;
  
  // Compliance
  jurisdictionNotes?: string;
  specialInstructions?: string;
}

interface SubmitResult {
  success: boolean;
  eventId?: string;
  error?: string;
}

/**
 * Submits intake form data to all canon tables:
 * 1. ghost_pass_event_intakes (original intake record)
 * 2. events (anchor object)
 * 3. event_configuration (adjustable logic)
 * 4. access_points (scan locations)
 */
export async function submitEventIntake(data: EventIntakeData): Promise<SubmitResult> {
  try {
    // Step 1: Insert into events table (anchor object)
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .insert({
        event_name: data.eventName,
        start_time: data.eventStartDate,
        end_time: data.eventEndDate || null,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        currency: data.settlementCurrency || 'USD',
        reentry_allowed: data.reentryAllowed,
        status: 'draft',
      })
      .select('id')
      .single();

    if (eventError) throw new Error(`Failed to create event: ${eventError.message}`);
    
    const eventId = eventData.id;

    // Step 2: Insert event_configuration (all adjustable logic)
    const passPrice1Day = data.passTypes.find(p => p.duration === '1 Day')?.price || null;
    const passPrice3Day = data.passTypes.find(p => p.duration === '3 Day')?.price || null;
    const passPrice7Day = data.passTypes.find(p => p.duration === '7 Day')?.price || null;

    // Calculate fee splits based on ID tier
    let idVerificationFee = 0;
    switch (data.idVerificationTier) {
      case 'tier_1':
        idVerificationFee = 1.50; // midpoint of $1.00-$2.00
        break;
      case 'tier_2':
        idVerificationFee = 3.35; // midpoint of $2.85-$3.85
        break;
      default:
        idVerificationFee = 0; // self-check is free
    }

    const { error: configError } = await supabase
      .from('event_configuration')
      .insert([{
        event_id: eventId,
        initial_entry_fee: data.platformFeeEnabled ? (data.platformFeeAmount || 2.50) : 0,
        venue_reentry_fee: data.reentryAllowed ? 1.00 : 0,
        valid_reentry_scan_fee: data.reentryAllowed ? 0.20 : 0,
        reentry_max_count: null,
        pass_required: data.passTypes.length > 0,
        pass_price_1_day: passPrice1Day,
        pass_price_3_day: passPrice3Day,
        pass_price_7_day: passPrice7Day,
        custom_pass_rules: data.passTypes.length > 0 ? (data.passTypes as any) : null,
        id_verification_tier: data.idVerificationTier,
        id_verification_fee: idVerificationFee,
        venue_split_percent: 70,
        valid_split_percent: 20,
        pool_split_percent: 5,
        promoter_split_percent: data.hasPromoter ? 5 : 0,
      }]);

    if (configError) throw new Error(`Failed to create event config: ${configError.message}`);

    // Step 3: Create access_points for all entry locations
    const accessPoints: Array<{
      event_id: string;
      name: string;
      access_type: string;
      interaction_mode: string;
    }> = [];

    // Exterior GA entry points
    for (let i = 1; i <= data.numExteriorGaPoints; i++) {
      accessPoints.push({
        event_id: eventId,
        name: data.numExteriorGaPoints > 1 ? `Main Entry ${i}` : 'Main Entry',
        access_type: 'entry',
        interaction_mode: data.interactionMethod === 'both' ? 'qr_nfc' : data.interactionMethod,
      });
    }

    // Exterior VIP entry points
    for (let i = 1; i <= data.numExteriorVipPoints; i++) {
      accessPoints.push({
        event_id: eventId,
        name: data.numExteriorVipPoints > 1 ? `VIP Entry ${i}` : 'VIP Entry',
        access_type: 'entry',
        interaction_mode: data.interactionMethod === 'both' ? 'qr_nfc' : data.interactionMethod,
      });
    }

    // Interior reentry points
    for (let i = 1; i <= data.numInteriorReentryPoints; i++) {
      accessPoints.push({
        event_id: eventId,
        name: data.numInteriorReentryPoints > 1 ? `Interior Reentry ${i}` : 'Interior Reentry',
        access_type: 'reentry',
        interaction_mode: data.interactionMethod === 'both' ? 'qr_nfc' : data.interactionMethod,
      });
    }

    // Bar locations
    for (let i = 1; i <= data.numBarLocations; i++) {
      accessPoints.push({
        event_id: eventId,
        name: data.numBarLocations > 1 ? `Bar ${i}` : 'Bar',
        access_type: 'concession',
        interaction_mode: data.interactionMethod === 'both' ? 'qr_nfc' : data.interactionMethod,
      });
    }

    // Food concessions
    for (let i = 1; i <= data.numFoodConcessions; i++) {
      accessPoints.push({
        event_id: eventId,
        name: data.numFoodConcessions > 1 ? `Food Concession ${i}` : 'Food Concession',
        access_type: 'concession',
        interaction_mode: data.interactionMethod === 'both' ? 'qr_nfc' : data.interactionMethod,
      });
    }

    // Merch locations
    for (let i = 1; i <= data.numMerchLocations; i++) {
      accessPoints.push({
        event_id: eventId,
        name: data.numMerchLocations > 1 ? `Merch ${i}` : 'Merch',
        access_type: 'merch',
        interaction_mode: data.interactionMethod === 'both' ? 'qr_nfc' : data.interactionMethod,
      });
    }

    // Server stations
    for (let i = 1; i <= data.numServerStations; i++) {
      accessPoints.push({
        event_id: eventId,
        name: data.numServerStations > 1 ? `Server Station ${i}` : 'Server Station',
        access_type: 'concession',
        interaction_mode: data.interactionMethod === 'both' ? 'qr_nfc' : data.interactionMethod,
      });
    }

    // Table service areas
    for (let i = 1; i <= data.numTableServiceAreas; i++) {
      accessPoints.push({
        event_id: eventId,
        name: data.numTableServiceAreas > 1 ? `Table Service ${i}` : 'Table Service',
        access_type: 'concession',
        interaction_mode: data.interactionMethod === 'both' ? 'qr_nfc' : data.interactionMethod,
      });
    }

    // Insert all access points
    if (accessPoints.length > 0) {
      const { error: accessError } = await supabase
        .from('access_points')
        .insert(accessPoints);

      if (accessError) throw new Error(`Failed to create access points: ${accessError.message}`);
    }

    // Step 4: Still insert into ghost_pass_event_intakes for full record
    const { error: intakeError } = await supabase
      .from('ghost_pass_event_intakes')
      .insert([{
        submitter_email: data.submitterEmail,
        event_name: data.eventName,
        event_start_date: data.eventStartDate,
        event_end_date: data.eventEndDate || null,
        venue_name: data.venueName || null,
        venue_address: data.venueAddress || null,
        estimated_attendance: data.estimatedAttendance,
        wearable_integration_required: data.wearableIntegrationRequired,
        wearable_use_ghost_pass: data.wearableUseGhostPass,
        wearable_types: data.wearableTypes,
        wearable_vendor_contact_name: data.wearableVendorContactName || null,
        wearable_vendor_contact_email: data.wearableVendorContactEmail || null,
        wearable_vendor_company: data.wearableVendorCompany || null,
        wearable_api_endpoint: data.wearableApiEndpoint || null,
        wearable_api_notes: data.wearableApiNotes || null,
        entry_types: data.entryTypes,
        num_exterior_ga_entry_points: data.numExteriorGaPoints,
        num_exterior_vip_entry_points: data.numExteriorVipPoints,
        num_interior_reentry_points: data.numInteriorReentryPoints,
        reentry_allowed: data.reentryAllowed,
        interior_locations: data.interiorLocations,
        num_bar_locations: data.numBarLocations,
        num_server_stations: data.numServerStations,
        num_table_service_areas: data.numTableServiceAreas,
        num_food_concessions: data.numFoodConcessions,
        num_merch_locations: data.numMerchLocations,
        num_countertop_units: data.numCountertopUnits,
        countertop_locations: data.countertopLocations || null,
        num_handheld_units: data.numHandheldUnits,
        handheld_locations: data.handheldLocations || null,
        has_outside_vendors: data.hasOutsideVendors,
        outside_vendor_count: data.outsideVendorCount,
        outside_vendor_types: data.outsideVendorTypes,
        pass_types: data.passTypes as any,
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
        promoter_splits: data.promoterSplits as any,
        vendors: data.vendors as any,
        id_required_for: data.idRequiredFor,
        id_mandatory_at_entry: data.idMandatoryAtEntry,
        additional_attributes: data.additionalAttributes,
        id_verification_tier: data.idVerificationTier,
        payout_destination: data.stripeConnectExists ? null : (data.payoutDestination as any),
        interaction_method: data.interactionMethod,
        enable_realtime_dashboard: data.enableRealtimeDashboard,
        estimated_staff_at_peak: data.estimatedStaffAtPeak || null,
        sensory_cargoes_enabled: data.sensoryCargosEnabled,
        sensory_audiology: data.sensoryAudiology,
        sensory_visual: data.sensoryVisual,
        sensory_taste: data.sensoryTaste,
        sensory_touch: data.sensoryTouch,
        sensory_olfactory: data.sensoryOlfactory,
        sensory_atmospheric: data.sensoryAtmospheric,
        sensory_notes: data.sensoryNotes || null,
        jurisdiction_notes: data.jurisdictionNotes || null,
        special_instructions: data.specialInstructions || null,
        status: 'submitted',
      }]);

    if (intakeError) throw new Error(`Failed to create intake record: ${intakeError.message}`);

    return { success: true, eventId };
  } catch (error: any) {
    console.error('Event intake submission error:', error);
    return { success: false, error: error.message };
  }
}
