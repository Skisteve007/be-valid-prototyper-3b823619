import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DoorOpen, 
  Wine, 
  TableProperties, 
  Ghost,
  ArrowRight,
  User
} from "lucide-react";

interface StationConfig {
  type: 'door' | 'bar' | 'table';
  label: string;
  icon: typeof DoorOpen;
}

const STATIONS: StationConfig[] = [
  { type: 'door', label: 'Door A', icon: DoorOpen },
  { type: 'door', label: 'Door B', icon: DoorOpen },
  { type: 'door', label: 'Door C', icon: DoorOpen },
  { type: 'bar', label: 'Bar 1', icon: Wine },
  { type: 'bar', label: 'Bar 2', icon: Wine },
  { type: 'bar', label: 'Bar 3', icon: Wine },
  { type: 'table', label: 'Table A', icon: TableProperties },
  { type: 'table', label: 'Table B', icon: TableProperties },
  { type: 'table', label: 'Table C', icon: TableProperties },
  { type: 'table', label: 'Table D', icon: TableProperties },
  { type: 'table', label: 'Table E', icon: TableProperties },
  { type: 'table', label: 'Table F', icon: TableProperties },
  { type: 'table', label: 'Table G', icon: TableProperties },
];

interface StationSelectorProps {
  onComplete: (station: string, operator: string, pin?: string) => void;
  currentStation?: string;
  lastOperator?: string;
}

export default function StationSelector({ 
  onComplete, 
  currentStation,
  lastOperator = ''
}: StationSelectorProps) {
  const [step, setStep] = useState<'station' | 'pin' | 'operator'>(currentStation ? 'operator' : 'station');
  const [selectedStation, setSelectedStation] = useState<string>(currentStation || '');
  const [stationPin, setStationPin] = useState('');
  const [operatorName, setOperatorName] = useState(lastOperator);
  const [error, setError] = useState('');

  const handleStationSelect = (label: string) => {
    setSelectedStation(label);
    setStep('pin');
    setError('');
  };

  const handlePinSubmit = () => {
    // For now, accept any 4-digit PIN (in production, verify against venue config)
    if (stationPin.length >= 4) {
      setStep('operator');
      setError('');
    } else {
      setError('Enter at least 4 digits');
    }
  };

  const handleOperatorSubmit = () => {
    if (operatorName.trim().length >= 2) {
      onComplete(selectedStation, operatorName.trim(), stationPin);
    } else {
      setError('Enter your name or initials');
    }
  };

  // Station selection step
  if (step === 'station') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <header className="p-4 border-b border-white/10 flex items-center gap-2">
          <Ghost className="w-6 h-6 text-purple-400" />
          <span className="font-bold text-lg">Ghostware™</span>
          <span className="text-xs text-muted-foreground ml-2">SELECT STATION</span>
        </header>

        <main className="flex-1 p-4 overflow-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">Select Your Station</h2>
          
          {/* Doors */}
          <div className="mb-6">
            <h3 className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">Doors</h3>
            <div className="grid grid-cols-3 gap-2">
              {STATIONS.filter(s => s.type === 'door').map((station) => (
                <button
                  key={station.label}
                  onClick={() => handleStationSelect(station.label)}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-purple-500/20 hover:border-purple-500/50 transition-all flex flex-col items-center gap-2"
                >
                  <DoorOpen className="w-8 h-8 text-purple-400" />
                  <span className="font-medium">{station.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bars */}
          <div className="mb-6">
            <h3 className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">Bars</h3>
            <div className="grid grid-cols-3 gap-2">
              {STATIONS.filter(s => s.type === 'bar').map((station) => (
                <button
                  key={station.label}
                  onClick={() => handleStationSelect(station.label)}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-amber-500/20 hover:border-amber-500/50 transition-all flex flex-col items-center gap-2"
                >
                  <Wine className="w-8 h-8 text-amber-400" />
                  <span className="font-medium">{station.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tables */}
          <div>
            <h3 className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">Tables</h3>
            <div className="grid grid-cols-4 gap-2">
              {STATIONS.filter(s => s.type === 'table').map((station) => (
                <button
                  key={station.label}
                  onClick={() => handleStationSelect(station.label)}
                  className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-blue-500/20 hover:border-blue-500/50 transition-all flex flex-col items-center gap-1"
                >
                  <TableProperties className="w-6 h-6 text-blue-400" />
                  <span className="text-sm font-medium">{station.label}</span>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // PIN entry step
  if (step === 'pin') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <header className="p-4 border-b border-white/10 flex items-center gap-2">
          <Ghost className="w-6 h-6 text-purple-400" />
          <span className="font-bold text-lg">Ghostware™</span>
          <span className="text-xs text-muted-foreground ml-2">{selectedStation}</span>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-xs space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Station PIN</h2>
              <p className="text-sm text-muted-foreground">Enter the PIN for {selectedStation}</p>
            </div>

            <Input
              type="password"
              inputMode="numeric"
              value={stationPin}
              onChange={(e) => setStationPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="••••"
              className="text-center text-2xl tracking-widest bg-white/10 border-white/20 h-14"
              autoFocus
            />

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setStep('station');
                  setStationPin('');
                }}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handlePinSubmit}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Operator name step
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="p-4 border-b border-white/10 flex items-center gap-2">
        <Ghost className="w-6 h-6 text-purple-400" />
        <span className="font-bold text-lg">Ghostware™</span>
        <span className="text-xs text-muted-foreground ml-2">{selectedStation}</span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-xs space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Who's Working?</h2>
            <p className="text-sm text-muted-foreground">Enter your name or initials</p>
          </div>

          <Input
            type="text"
            value={operatorName}
            onChange={(e) => setOperatorName(e.target.value)}
            placeholder="e.g., Steve G"
            className="text-center text-lg bg-white/10 border-white/20 h-14"
            autoFocus
          />

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <div className="flex gap-2">
            {!currentStation && (
              <Button
                variant="outline"
                onClick={() => {
                  setStep('pin');
                  setOperatorName('');
                }}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleOperatorSubmit}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {currentStation ? 'Switch Station' : 'Start Shift'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
