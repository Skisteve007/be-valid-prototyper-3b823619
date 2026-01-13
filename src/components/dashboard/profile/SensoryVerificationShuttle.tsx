import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Ear, 
  Eye, 
  Apple, 
  Hand, 
  Droplets, 
  Wind, 
  Activity, 
  ChevronDown, 
  ChevronUp,
  Radio
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SensoryItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  glowClass: string;
  route: string;
  status: 'awaiting' | 'verified' | 'caution' | 'failed';
}

const sensoryItems: SensoryItem[] = [
  {
    id: 'audiology',
    name: 'Audiology',
    description: 'Hearing acuity & auditory processing assessment',
    icon: <Ear className="w-4 h-4" />,
    colorClass: 'text-blue-400',
    glowClass: 'bg-blue-500/10 border-blue-400/30',
    route: '/verification/audiology',
    status: 'awaiting'
  },
  {
    id: 'visual',
    name: 'Visual',
    description: 'Ophthalmic health & vision clarity verification',
    icon: <Eye className="w-4 h-4" />,
    colorClass: 'text-amber-400',
    glowClass: 'bg-amber-500/10 border-amber-400/30',
    route: '/verification/visual',
    status: 'awaiting'
  },
  {
    id: 'taste',
    name: 'Taste Sense',
    description: 'Gustatory function & taste receptor sensitivity',
    icon: <Apple className="w-4 h-4" />,
    colorClass: 'text-rose-400',
    glowClass: 'bg-rose-500/10 border-rose-400/30',
    route: '/verification/taste',
    status: 'awaiting'
  },
  {
    id: 'touch',
    name: 'Touch Sense',
    description: 'Tactile perception & nerve response testing',
    icon: <Hand className="w-4 h-4" />,
    colorClass: 'text-emerald-400',
    glowClass: 'bg-emerald-500/10 border-emerald-400/30',
    route: '/verification/touch',
    status: 'awaiting'
  },
  {
    id: 'olfactory',
    name: 'Olfactory',
    description: 'Pheromone signature & scent receptor analysis',
    icon: <Droplets className="w-4 h-4" />,
    colorClass: 'text-pink-400',
    glowClass: 'bg-pink-500/10 border-pink-400/30',
    route: '/verification/olfactory',
    status: 'awaiting'
  },
  {
    id: 'atmospheric',
    name: 'Atmospheric Balance',
    description: 'Environmental equilibrium & biometric harmony',
    icon: <Wind className="w-4 h-4" />,
    colorClass: 'text-indigo-400',
    glowClass: 'bg-indigo-500/10 border-indigo-400/30',
    route: '/verification/atmospheric',
    status: 'awaiting'
  }
];

export const SensoryVerificationShuttle = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = (status: SensoryItem['status']) => {
    switch (status) {
      case 'verified':
        return <span className="text-[8px] text-green-400 font-semibold">VERIFIED</span>;
      case 'caution':
        return <span className="text-[8px] text-yellow-400 font-semibold">CAUTION</span>;
      case 'failed':
        return <span className="text-[8px] text-red-400 font-semibold">FAILED</span>;
      default:
        return <span className="text-[8px] text-gray-400 font-semibold animate-pulse">AWAITING</span>;
    }
  };

  return (
    <div className="flex flex-col p-3 rounded-lg border border-indigo-400/30 bg-indigo-500/10">
      {/* Header - Always visible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center">
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-left">
            <p className="text-[10px] text-indigo-300 uppercase tracking-wider font-semibold">SENSORY VERIFICATION</p>
            <p className="text-[9px] text-gray-400">Signal conduit — no data stored</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Radio className="w-3 h-3 text-indigo-400 animate-pulse" />
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-indigo-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-indigo-400" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-3 space-y-2 pt-3 border-t border-indigo-400/20">
          {sensoryItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.route)}
              className={`w-full flex items-center gap-3 p-2 rounded-lg border transition-all hover:scale-[1.02] active:scale-95 ${item.glowClass}`}
            >
              <div className={`w-8 h-8 rounded-full bg-black/30 border border-white/10 flex items-center justify-center ${item.colorClass}`}>
                {item.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${item.colorClass}`}>{item.name}</span>
                  {getStatusBadge(item.status)}
                </div>
                <p className="text-[9px] text-gray-400 line-clamp-1">{item.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SensoryVerificationShuttle;
