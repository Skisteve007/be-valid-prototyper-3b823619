import React from 'react';
import { Settings } from 'lucide-react';

/**
 * Ghost Pass Admin Panel
 * Placeholder — awaiting build by Nick (Ghost Pass Command Center integration)
 */
const GhostPassAdminPanel: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
      <Settings className="w-10 h-10 text-muted-foreground/40" />
      <p className="text-muted-foreground text-sm">Ghost Pass configuration panel — awaiting build.</p>
    </div>
  );
};

export default GhostPassAdminPanel;
