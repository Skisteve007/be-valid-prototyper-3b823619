import { Shield, Lock, Trash2, Eye, Server, Clock } from 'lucide-react';

interface PrivacyPromiseProps {
  variant?: 'fan' | 'venue';
}

const PrivacyPromise = ({ variant = 'fan' }: PrivacyPromiseProps) => {
  const fanPromises = [
    {
      icon: Eye,
      title: 'We Never See Your Face',
      description: 'Biometric hashes are created locally on your device. We only receive an encrypted token.',
    },
    {
      icon: Server,
      title: 'Zero Storage Architecture',
      description: 'Your data passes through our system in milliseconds. Nothing is retained or stored.',
    },
    {
      icon: Trash2,
      title: 'Instant Purge Protocol',
      description: 'Every scan is immediately deleted. Our audit logs prove 0ms data retention.',
    },
    {
      icon: Lock,
      title: 'You Control Your Data',
      description: 'Opt-in only. Revoke consent anytime. Your identity, your rules.',
    },
  ];

  const venuePromises = [
    {
      icon: Shield,
      title: 'Liability Shield',
      description: 'We absorb the compliance risk. You get verified entry without storing PII.',
    },
    {
      icon: Clock,
      title: '230ms Average Scan',
      description: 'Faster than reading an ID. Zero friction for your guests.',
    },
    {
      icon: Server,
      title: 'No Infrastructure Needed',
      description: 'Cloud-native solution. No servers to maintain, no data to secure.',
    },
    {
      icon: Lock,
      title: 'Audit-Ready Reports',
      description: 'Real-time compliance dashboards. Prove your privacy stance to regulators.',
    },
  ];

  const promises = variant === 'fan' ? fanPromises : venuePromises;
  const title = variant === 'fan' ? 'Our Privacy Promise to You' : 'Enterprise Privacy Guarantee';

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {variant === 'fan'
            ? 'Your identity is sacred. We built Valid™ to protect it.'
            : 'Deploy verified entry without the compliance headaches.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promises.map((promise, index) => (
          <div
            key={index}
            className="flex gap-4 p-4 rounded-xl border border-border/50 bg-card/50 hover:border-primary/30 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="p-2 rounded-lg bg-primary/10">
                <promise.icon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">{promise.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {promise.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPromise;
