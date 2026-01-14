// AI Governance Badge — Single Source of Truth Configuration

export const BADGE_CONFIG = {
  display_name: "AI Governance Badge",
  issuer: "Giant Ventures LLC",
  asset_path: "/assets/badges/ai-governance-badge.svg",
  alt_text: "AI Governance Badge — Issued by Giant Ventures LLC",
  included_all_tiers: true,
  guidelines_url: "/brand/badge-guidelines",
  tooltip: "Authorized to display while subscription is active and governance standards are met.",
  legacy_name_override: "" // Set to "Grillo AI Governance Badge" if legacy label required
} as const;

// Get the display name, preferring legacy override if set
export const getBadgeDisplayName = () => {
  return BADGE_CONFIG.legacy_name_override || BADGE_CONFIG.display_name;
};

// Get full badge title with issuer
export const getBadgeFullTitle = () => {
  const displayName = getBadgeDisplayName();
  return `${displayName} — Issued by ${BADGE_CONFIG.issuer}`;
};
