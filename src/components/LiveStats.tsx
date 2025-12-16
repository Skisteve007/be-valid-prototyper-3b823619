import React from 'react';
import { useActiveVisitors, useTotalUsers } from '@/hooks/useLiveStats';

const LiveStats: React.FC = () => {
  const activeVisitors = useActiveVisitors();
  const totalUsers = useTotalUsers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 py-3 px-6 bg-background/30 backdrop-blur-sm rounded-full border border-border/30">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-sm">
          <span className="font-bold text-foreground">{activeVisitors || 1}</span> viewing now
        </span>
      </div>
      
      <div className="hidden sm:block w-px h-4 bg-border/50" />
      
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-primary">🚀</span>
        <span className="text-sm">
          <span className="font-bold text-foreground">{totalUsers.toLocaleString()}</span> users joined
        </span>
      </div>
    </div>
  );
};

export default LiveStats;
