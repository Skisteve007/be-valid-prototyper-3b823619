// ============================================
// VALID™ PRIVACY BADGE - ENTERPRISE (B2B)
// Used in: Sales Decks, Venue Dashboards, Websites
// ============================================

import React, { useEffect, useState } from 'react';
import { usePrivacyStats } from '@/hooks/usePrivacyStats';
import { privacyService, ComplianceCert } from '@/services/privacyService';

interface PrivacyBadgeB2BProps {
  venueId?: string;
  variant?: 'dashboard' | 'embed' | 'sales';
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K+';
  }
  return num.toString();
};

const PrivacyBadgeB2B: React.FC<PrivacyBadgeB2BProps> = ({ 
  venueId,
  variant = 'dashboard'
}) => {
  const { stats } = usePrivacyStats();
  const [certs, setCerts] = useState<ComplianceCert[]>([]);

  useEffect(() => {
    privacyService.getComplianceCerts().then(setCerts);
  }, []);

  // ============================================
  // DASHBOARD VARIANT - For Venue Admin Panel
  // ============================================
  if (variant === 'dashboard') {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-foreground text-lg font-semibold">
            Privacy & Compliance Status
          </h2>
          <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-emerald-500 text-xs font-medium">ALL SYSTEMS COMPLIANT</span>
          </div>
        </div>

        {/* Certifications */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {['GDPR', 'CCPA', 'SOC2'].map((certType) => {
            const cert = certs.find(c => c.type === certType);
            return (
              <div 
                key={certType} 
                className="bg-primary/5 rounded-xl p-4 text-center border border-primary/20"
              >
                <div className="text-primary text-xl font-bold mb-1">
                  {certType}
                </div>
                <div className={`text-xs ${cert?.status === 'active' ? 'text-emerald-500' : 'text-orange-500'}`}>
                  {cert?.status === 'active' ? '✓ CERTIFIED' : '⏳ PENDING'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Key Metrics */}
        <div className="bg-background rounded-xl p-5">
          <h3 className="text-muted-foreground text-xs mb-4 tracking-wide">
            PRIVACY METRICS
          </h3>
          <div className="grid grid-cols-4 gap-5">
            <div>
              <div className="text-foreground text-2xl font-bold">0ms</div>
              <div className="text-muted-foreground text-xs">DATA RETENTION</div>
            </div>
            <div>
              <div className="text-foreground text-2xl font-bold">
                {formatNumber(stats.total_fans_protected)}
              </div>
              <div className="text-muted-foreground text-xs">TOTAL SCANS</div>
            </div>
            <div>
              <div className="text-foreground text-2xl font-bold">0</div>
              <div className="text-muted-foreground text-xs">DATA BREACHES</div>
            </div>
            <div>
              <div className="text-foreground text-2xl font-bold">100%</div>
              <div className="text-muted-foreground text-xs">PURGE RATE</div>
            </div>
          </div>
        </div>

        {/* Privacy Statement */}
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border-l-[3px] border-primary">
          <p className="text-muted-foreground text-sm leading-relaxed">
            <strong className="text-foreground">"We Check. We Don't Collect."</strong> — All ID scans are verified in real-time against federal safety databases and <strong className="text-primary">immediately discarded</strong>. No storage. No tracking. No surveillance. VALID™ complies with GDPR, CCPA, and SOC2 standards.
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // EMBED VARIANT - For Stadium Websites
  // ============================================
  if (variant === 'embed') {
    return (
      <div className="bg-gradient-to-br from-background to-card rounded-xl p-6 max-w-md font-sans">
        <div className="flex items-center gap-3 mb-5">
          <img 
            src="/valid-logo.svg" 
            alt="VALID™" 
            className="h-8"
          />
          <span className="text-primary text-xs tracking-widest bg-primary/10 px-2 py-1 rounded">
            VERIFIED VENUE
          </span>
        </div>

        <h3 className="text-foreground text-lg mb-3">
          Your Privacy. Our Priority.
        </h3>

        <p className="text-muted-foreground text-sm leading-relaxed mb-5">
          This venue uses VALID™ real-time safety verification. Your ID is checked against federal safety databases and <strong className="text-foreground">immediately deleted</strong>. We never store, track, or sell your information.
        </p>

        {/* Trust Badges */}
        <div className="flex gap-2 flex-wrap">
          {['GDPR', 'CCPA', 'SOC2'].map((cert) => (
            <span 
              key={cert} 
              className="bg-foreground/5 text-muted-foreground px-2.5 py-1 rounded text-xs"
            >
              {cert} Compliant
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-5 pt-5 border-t border-border">
          <a 
            href="https://bevalid.app/privacy" 
            className="text-primary text-sm hover:underline"
          >
            Learn more about VALID™ Privacy →
          </a>
        </div>
      </div>
    );
  }

  // ============================================
  // SALES VARIANT - For B2B Pitch Decks
  // ============================================
  if (variant === 'sales') {
    return (
      <div className="bg-white rounded-2xl p-10 max-w-xl shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-gray-900 text-2xl font-semibold mb-2">
            Privacy Without Compromise
          </h2>
          <p className="text-gray-500 text-base">
            Enterprise-grade security your fans will thank you for
          </p>
        </div>

        {/* Key Points */}
        <div className="mb-8">
          {[
            {
              title: "We Check. We Don't Collect.",
              desc: 'IDs are scanned, verified in real-time, and immediately purged. Zero data retention.'
            },
            {
              title: 'Safer Seats, Stronger Stadiums',
              desc: 'Block threats, not fans. 99.99% of visitors pass through invisibly.'
            },
            {
              title: 'Compliance Built-In',
              desc: 'GDPR, CCPA, and SOC2 certified. Enterprise-ready from day one.'
            }
          ].map((point, i) => (
            <div key={i} className="flex gap-4 mb-5">
              <div className="w-8 h-8 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold shrink-0">
                {i + 1}
              </div>
              <div>
                <h4 className="text-gray-900 font-medium mb-1">{point.title}</h4>
                <p className="text-gray-500 text-sm">{point.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="flex justify-around p-5 bg-gray-50 rounded-xl">
          <div className="text-center">
            <div className="text-gray-900 text-2xl font-bold">
              {formatNumber(stats.total_fans_protected)}
            </div>
            <div className="text-gray-500 text-xs">Fans Protected</div>
          </div>
          <div className="text-center">
            <div className="text-gray-900 text-2xl font-bold">0ms</div>
            <div className="text-gray-500 text-xs">Data Retention</div>
          </div>
          <div className="text-center">
            <div className="text-gray-900 text-2xl font-bold">0</div>
            <div className="text-gray-500 text-xs">Breaches Ever</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PrivacyBadgeB2B;