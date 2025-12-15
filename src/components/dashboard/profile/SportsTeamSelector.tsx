import { useState, useMemo } from "react";
import { Trophy, X, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sportsTeams, LeagueType } from "@/constants/sportsTeams";

interface SelectedTeams {
  nfl: string[];
  nba: string[];
  nhl: string[];
  mlb: string[];
}

interface SportsTeamSelectorProps {
  selectedTeams: SelectedTeams;
  onTeamsChange: (teams: SelectedTeams) => void;
}

const leagueLabels: Record<LeagueType, string> = {
  nfl: "NFL",
  nba: "NBA",
  nhl: "NHL",
  mlb: "MLB"
};

const leagueEmojis: Record<LeagueType, string> = {
  nfl: "🏈",
  nba: "🏀",
  nhl: "🏒",
  mlb: "⚾"
};

export const SportsTeamSelector = ({ selectedTeams, onTeamsChange }: SportsTeamSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [activeLeague, setActiveLeague] = useState<LeagueType>("nfl");
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelected, setTempSelected] = useState<SelectedTeams>(selectedTeams);

  const filteredTeams = useMemo(() => {
    const teams = sportsTeams[activeLeague];
    if (!searchQuery.trim()) return teams;
    return teams.filter(team => 
      team.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeLeague, searchQuery]);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setTempSelected(selectedTeams);
      setSearchQuery("");
    }
    setOpen(isOpen);
  };

  const handleTeamToggle = (team: string) => {
    setTempSelected(prev => {
      const leagueTeams = prev[activeLeague];
      if (leagueTeams.includes(team)) {
        return { ...prev, [activeLeague]: leagueTeams.filter(t => t !== team) };
      } else {
        return { ...prev, [activeLeague]: [...leagueTeams, team] };
      }
    });
  };

  const handleSave = () => {
    onTeamsChange(tempSelected);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempSelected(selectedTeams);
    setOpen(false);
  };

  const totalSelected = Object.values(selectedTeams).flat().length;
  const allSelectedTeams = Object.entries(selectedTeams)
    .flatMap(([league, teams]) => teams.map(t => ({ league: league as LeagueType, team: t })));

  // Get display text for the pill
  const getDisplayContent = () => {
    if (totalSelected === 0) {
      return (
        <>
          <Trophy className="w-4 h-4" />
          <span className="text-[10px] font-bold tracking-wider">+ MY TEAMS</span>
        </>
      );
    }

    return (
      <div className="flex items-center gap-2 flex-wrap">
        {allSelectedTeams.map((item, idx) => (
          <span key={idx} className="text-xs md:text-sm font-medium whitespace-nowrap">
            {leagueEmojis[item.league]} {item.team.split(' ').pop()}
          </span>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-all text-amber-400 backdrop-blur-sm"
        >
          {getDisplayContent()}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border border-white/10 top-[20%] translate-y-0 sm:top-[15%]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
            <Trophy className="w-5 h-5 text-amber-400" />
            Rep Your Squad
          </DialogTitle>
        </DialogHeader>

        {/* League Tabs */}
        <div className="flex gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
          {(Object.keys(sportsTeams) as LeagueType[]).map(league => {
            const count = tempSelected[league].length;
            return (
              <button
                key={league}
                type="button"
                onClick={() => {
                  setActiveLeague(league);
                  setSearchQuery("");
                }}
                className={`flex-1 px-3 py-2 rounded-md text-xs font-bold transition-all backdrop-blur-sm ${
                  activeLeague === league
                    ? 'bg-amber-500/30 border border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : 'bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10'
                }`}
              >
                {leagueLabels[league]}
                {count > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px] bg-amber-500/50 text-white">
                    {count}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>


        {/* Teams List */}
        <ScrollArea className="h-[250px] rounded-lg border border-white/10 bg-white/5">
          <div className="p-2 space-y-1">
            {filteredTeams.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-4">No teams found</p>
            ) : (
              filteredTeams.map(team => {
                const isSelected = tempSelected[activeLeague].includes(team);
                return (
                  <button
                    key={team}
                    type="button"
                    onClick={() => handleTeamToggle(team)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border border-amber-400/50 text-amber-300'
                        : 'bg-transparent hover:bg-white/5 text-foreground'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'bg-amber-500 border-amber-400' 
                        : 'border-white/30 bg-transparent'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-black" />}
                    </div>
                    <span>{team}</span>
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* Selected Summary */}
        {Object.values(tempSelected).flat().length > 0 && (
          <div className="flex flex-wrap gap-1 max-h-[60px] overflow-y-auto">
            {Object.entries(tempSelected).map(([league, teams]) =>
              teams.map(team => (
                <Badge
                  key={`${league}-${team}`}
                  variant="secondary"
                  className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] cursor-pointer hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30"
                  onClick={() => {
                    setTempSelected(prev => ({
                      ...prev,
                      [league]: prev[league as LeagueType].filter(t => t !== team)
                    }));
                  }}
                >
                  {leagueEmojis[league as LeagueType]} {team}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="flex-1 border-white/20 text-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold"
          >
            Save ({Object.values(tempSelected).flat().length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
