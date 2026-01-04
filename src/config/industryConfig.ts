// Universal Industry Configuration - Polymorphic Dashboard Labels & Settings

export type IndustryType = 
  | 'Nightlife' 
  | 'Transportation' 
  | 'Workforce' 
  | 'Medical' 
  | 'Rentals' 
  | 'Security'
  | 'Enterprises'
  | 'Health'
  | 'Law'
  | 'Adult'
  | 'Sports';

export interface IndustryLabels {
  // Live Operations metrics
  primaryMetric: string;
  secondaryMetric: string;
  tertiaryMetric: string;
  
  // Assignment unit naming
  assignmentUnit: string;
  assignmentUnitPlural: string;
  
  // Revenue categories
  revenueCategories: {
    id: string;
    label: string;
    color: string;
  }[];
  
  // Staff role options
  staffRoles: string[];
  
  // Station types
  stationTypes: string[];
}

export const INDUSTRY_CONFIG: Record<IndustryType, IndustryLabels> = {
  Nightlife: {
    primaryMetric: 'Headcount',
    secondaryMetric: 'Bar Sales',
    tertiaryMetric: 'VIP Occupancy',
    assignmentUnit: 'Station',
    assignmentUnitPlural: 'Stations',
    revenueCategories: [
      { id: 'door', label: 'Door Entry', color: '#00bcd4' },
      { id: 'bar', label: 'Bar Sales', color: '#f59e0b' },
      { id: 'concessions', label: 'Concessions', color: '#22c55e' },
      { id: 'swag', label: 'Merchandise', color: '#a855f7' },
      { id: 'vip', label: 'VIP Services', color: '#ec4899' }
    ],
    staffRoles: ['Doorman', 'Bartender', 'VIP Host', 'Security', 'Manager', 'Barback', 'Server'],
    stationTypes: ['Bar', 'Door', 'VIP', 'Concessions', 'Swag', 'Security Desk']
  },
  
  Transportation: {
    primaryMetric: 'Active Fleet',
    secondaryMetric: 'Deliveries Completed',
    tertiaryMetric: 'Manifests Audited',
    assignmentUnit: 'Vehicle',
    assignmentUnitPlural: 'Vehicles',
    revenueCategories: [
      { id: 'delivery', label: 'Deliveries', color: '#3b82f6' },
      { id: 'freight', label: 'Freight', color: '#22c55e' },
      { id: 'passenger', label: 'Passenger', color: '#f59e0b' },
      { id: 'special', label: 'Special Cargo', color: '#a855f7' }
    ],
    staffRoles: ['Driver', 'Dispatcher', 'Loader', 'Fleet Manager', 'Route Supervisor'],
    stationTypes: ['Vehicle', 'Route', 'Depot', 'Loading Dock', 'Dispatch Center']
  },
  
  Workforce: {
    primaryMetric: 'On-Site Personnel',
    secondaryMetric: 'Safety Compliance %',
    tertiaryMetric: 'Hours Logged',
    assignmentUnit: 'Job Site',
    assignmentUnitPlural: 'Job Sites',
    revenueCategories: [
      { id: 'labor', label: 'Labor Hours', color: '#3b82f6' },
      { id: 'overtime', label: 'Overtime', color: '#f59e0b' },
      { id: 'bonus', label: 'Bonuses', color: '#22c55e' },
      { id: 'penalties', label: 'Penalties', color: '#ef4444' }
    ],
    staffRoles: ['Worker', 'Foreman', 'Safety Officer', 'Site Manager', 'Equipment Operator'],
    stationTypes: ['Job Site', 'Gate', 'Checkpoint', 'Break Area', 'Equipment Yard']
  },
  
  Medical: {
    primaryMetric: 'Patients Processed',
    secondaryMetric: 'Tests Completed',
    tertiaryMetric: 'Pending Results',
    assignmentUnit: 'Station',
    assignmentUnitPlural: 'Stations',
    revenueCategories: [
      { id: 'testing', label: 'Testing', color: '#22c55e' },
      { id: 'consultation', label: 'Consultation', color: '#3b82f6' },
      { id: 'kit_sales', label: 'Kit Sales', color: '#f59e0b' },
      { id: 'followup', label: 'Follow-up', color: '#a855f7' }
    ],
    staffRoles: ['Phlebotomist', 'Technician', 'Nurse', 'Physician', 'Admin'],
    stationTypes: ['Collection Station', 'Lab', 'Consultation Room', 'Reception', 'Storage']
  },
  
  Rentals: {
    primaryMetric: 'Assets Out',
    secondaryMetric: 'Pending Returns',
    tertiaryMetric: 'Insurance Verifications',
    assignmentUnit: 'Asset',
    assignmentUnitPlural: 'Assets',
    revenueCategories: [
      { id: 'rental', label: 'Rental Fees', color: '#f59e0b' },
      { id: 'insurance', label: 'Insurance', color: '#3b82f6' },
      { id: 'damage', label: 'Damage Fees', color: '#ef4444' },
      { id: 'extras', label: 'Add-ons', color: '#a855f7' }
    ],
    staffRoles: ['Agent', 'Detailer', 'Inspector', 'Manager', 'Delivery Driver'],
    stationTypes: ['Vehicle/Asset', 'Inspection Bay', 'Pickup Counter', 'Return Lane', 'Storage Lot']
  },
  
  Security: {
    primaryMetric: 'Personnel Deployed',
    secondaryMetric: 'Incidents Reported',
    tertiaryMetric: 'Checkpoints Cleared',
    assignmentUnit: 'Post',
    assignmentUnitPlural: 'Posts',
    revenueCategories: [
      { id: 'patrol', label: 'Patrol Hours', color: '#3b82f6' },
      { id: 'static', label: 'Static Guard', color: '#22c55e' },
      { id: 'event', label: 'Event Security', color: '#f59e0b' },
      { id: 'executive', label: 'Executive Protection', color: '#a855f7' }
    ],
    staffRoles: ['Guard', 'Patrol Officer', 'Supervisor', 'K-9 Handler', 'Executive Protection'],
    stationTypes: ['Post', 'Patrol Route', 'Checkpoint', 'Command Center', 'Entry Gate']
  },
  
  Enterprises: {
    primaryMetric: 'Active Employees',
    secondaryMetric: 'Compliance Rate',
    tertiaryMetric: 'Verifications Today',
    assignmentUnit: 'Department',
    assignmentUnitPlural: 'Departments',
    revenueCategories: [
      { id: 'verification', label: 'Verifications', color: '#3b82f6' },
      { id: 'compliance', label: 'Compliance Fees', color: '#22c55e' },
      { id: 'subscription', label: 'Subscriptions', color: '#f59e0b' }
    ],
    staffRoles: ['HR Admin', 'Compliance Officer', 'Department Head', 'Security Admin'],
    stationTypes: ['Entry Gate', 'Department', 'Verification Kiosk', 'Admin Office']
  },
  
  Health: {
    primaryMetric: 'Patients Verified',
    secondaryMetric: 'Health Cards Active',
    tertiaryMetric: 'Compliance Rate',
    assignmentUnit: 'Facility',
    assignmentUnitPlural: 'Facilities',
    revenueCategories: [
      { id: 'verification', label: 'Health Verifications', color: '#ef4444' },
      { id: 'testing', label: 'Testing Services', color: '#22c55e' },
      { id: 'cards', label: 'Health Cards', color: '#3b82f6' }
    ],
    staffRoles: ['Nurse', 'Technician', 'Physician', 'Admin', 'Compliance Officer'],
    stationTypes: ['Testing Station', 'Verification Desk', 'Lab', 'Admin Office']
  },
  
  Law: {
    primaryMetric: 'Cases Verified',
    secondaryMetric: 'Background Checks',
    tertiaryMetric: 'Compliance Audits',
    assignmentUnit: 'Office',
    assignmentUnitPlural: 'Offices',
    revenueCategories: [
      { id: 'background', label: 'Background Checks', color: '#6366f1' },
      { id: 'compliance', label: 'Compliance', color: '#22c55e' },
      { id: 'verification', label: 'Verifications', color: '#3b82f6' }
    ],
    staffRoles: ['Attorney', 'Paralegal', 'Compliance Officer', 'Investigator'],
    stationTypes: ['Office', 'Court Liaison', 'Verification Desk', 'Records']
  },
  
  Adult: {
    primaryMetric: 'Headcount',
    secondaryMetric: 'VIP Revenue',
    tertiaryMetric: 'Verifications',
    assignmentUnit: 'Station',
    assignmentUnitPlural: 'Stations',
    revenueCategories: [
      { id: 'door', label: 'Door Entry', color: '#f59e0b' },
      { id: 'vip', label: 'VIP Services', color: '#ec4899' },
      { id: 'bar', label: 'Bar Sales', color: '#22c55e' }
    ],
    staffRoles: ['Host', 'Security', 'VIP Host', 'Manager', 'Bartender'],
    stationTypes: ['Door', 'VIP', 'Bar', 'Stage', 'Security Desk']
  },
  
  Sports: {
    primaryMetric: 'Fan Attendance',
    secondaryMetric: 'Concession Sales',
    tertiaryMetric: 'VIP Box Occupancy',
    assignmentUnit: 'Section',
    assignmentUnitPlural: 'Sections',
    revenueCategories: [
      { id: 'tickets', label: 'Ticket Sales', color: '#a855f7' },
      { id: 'concessions', label: 'Concessions', color: '#22c55e' },
      { id: 'merchandise', label: 'Merchandise', color: '#f59e0b' }
    ],
    staffRoles: ['Usher', 'Security', 'Concessions', 'Box Office', 'Event Staff'],
    stationTypes: ['Gate', 'Section', 'Concession Stand', 'VIP Box', 'Press Box']
  }
};

export const getIndustryConfig = (type: string | null | undefined): IndustryLabels => {
  const industryType = (type as IndustryType) || 'Nightlife';
  return INDUSTRY_CONFIG[industryType] || INDUSTRY_CONFIG.Nightlife;
};
