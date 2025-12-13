// Shift Manager - Calendar/Timeline View with Drag-and-Drop Staff Assignment
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, ChevronLeft, ChevronRight, Plus, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { getIndustryConfig } from "@/config/industryConfig";

interface Station {
  id: string;
  station_name: string;
  station_category: string;
  assignment_number?: number;
}

interface StaffShift {
  id: string;
  staff_name: string;
  staff_role: string;
  station_id?: string;
  is_active: boolean;
  shift_start: string;
  shift_end?: string;
}

interface ShiftSchedulerProps {
  venueId: string | null;
  industryType: string;
}

type ViewMode = 'day' | 'week';

const SHIFT_BLOCKS = [
  { id: 'morning', label: 'Morning', time: '6AM - 2PM', hours: '6-14' },
  { id: 'afternoon', label: 'Afternoon', time: '2PM - 10PM', hours: '14-22' },
  { id: 'night', label: 'Night', time: '10PM - 6AM', hours: '22-6' }
];

const ShiftScheduler = ({ venueId, industryType }: ShiftSchedulerProps) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [staffShifts, setStaffShifts] = useState<StaffShift[]>([]);
  const [unassignedStaff, setUnassignedStaff] = useState<StaffShift[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [draggedStaff, setDraggedStaff] = useState<StaffShift | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const config = getIndustryConfig(industryType);

  useEffect(() => {
    if (venueId) {
      loadScheduleData();
    }
  }, [venueId, selectedDate]);

  const loadScheduleData = async () => {
    if (!venueId) return;
    
    setIsLoading(true);
    
    // Load stations
    const { data: stationsData } = await supabase
      .from("venue_stations")
      .select("id, station_name, station_category, assignment_number")
      .eq("venue_id", venueId)
      .eq("is_active", true)
      .order("assignment_number");

    // Load staff shifts for selected date
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const { data: shiftsData } = await supabase
      .from("staff_shifts")
      .select("id, staff_name, staff_role, station_id, is_active, shift_start, shift_end")
      .eq("venue_id", venueId)
      .gte("shift_start", startOfDay.toISOString())
      .lte("shift_start", endOfDay.toISOString());

    if (stationsData) {
      setStations(stationsData);
    } else {
      // Demo stations
      setStations([
        { id: "1", station_name: "Main Bar", station_category: "bar", assignment_number: 1 },
        { id: "2", station_name: "VIP Bar", station_category: "bar", assignment_number: 2 },
        { id: "3", station_name: "Front Door", station_category: "door", assignment_number: 3 },
        { id: "4", station_name: "Back Door", station_category: "door", assignment_number: 4 }
      ]);
    }

    if (shiftsData) {
      const assigned = shiftsData.filter(s => s.station_id);
      const unassigned = shiftsData.filter(s => !s.station_id);
      setStaffShifts(assigned);
      setUnassignedStaff(unassigned);
    } else {
      // Demo shifts
      setUnassignedStaff([
        { id: "s1", staff_name: "Mike T.", staff_role: "Bartender", is_active: true, shift_start: new Date().toISOString() },
        { id: "s2", staff_name: "Sarah L.", staff_role: "Doorman", is_active: true, shift_start: new Date().toISOString() },
        { id: "s3", staff_name: "James K.", staff_role: "VIP Host", is_active: true, shift_start: new Date().toISOString() }
      ]);
    }
    
    setIsLoading(false);
  };

  const handleDragStart = (staff: StaffShift) => {
    setDraggedStaff(staff);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (stationId: string, shiftBlock: string) => {
    if (!draggedStaff || !venueId) return;

    const { error } = await supabase
      .from("staff_shifts")
      .update({ 
        station_id: stationId,
        shift_assignment: shiftBlock
      })
      .eq("id", draggedStaff.id);

    if (error) {
      toast.error("Failed to assign staff");
      console.error(error);
    } else {
      toast.success(`${draggedStaff.staff_name} assigned to station!`);
      
      // Update local state
      setUnassignedStaff(prev => prev.filter(s => s.id !== draggedStaff.id));
      setStaffShifts(prev => [...prev, { ...draggedStaff, station_id: stationId }]);
    }
    
    setDraggedStaff(null);
  };

  const handleUnassign = async (staff: StaffShift) => {
    const { error } = await supabase
      .from("staff_shifts")
      .update({ station_id: null })
      .eq("id", staff.id);

    if (error) {
      toast.error("Failed to unassign staff");
    } else {
      toast.success(`${staff.staff_name} unassigned`);
      setStaffShifts(prev => prev.filter(s => s.id !== staff.id));
      setUnassignedStaff(prev => [...prev, { ...staff, station_id: undefined }]);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    }
    setSelectedDate(newDate);
  };

  const getStaffAtStation = (stationId: string) => {
    return staffShifts.filter(s => s.station_id === stationId);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            <CardTitle className="text-white">Shift Manager</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </Button>
            <span className="text-white font-medium min-w-[200px] text-center">
              {formatDate(selectedDate)}
            </span>
            <Button variant="ghost" size="icon" onClick={() => navigateDate('next')}>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Button>
            <Select value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
              <SelectTrigger className="w-24 bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="day" className="text-white">Day</SelectItem>
                <SelectItem value="week" className="text-white">Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <CardDescription className="text-slate-400">
          Drag staff to assign to {config.assignmentUnitPlural}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Unassigned Staff Pool */}
        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Unassigned Staff ({unassignedStaff.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {unassignedStaff.length === 0 ? (
              <p className="text-sm text-slate-500">All staff assigned</p>
            ) : (
              unassignedStaff.map(staff => (
                <div
                  key={staff.id}
                  draggable
                  onDragStart={() => handleDragStart(staff)}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-700 rounded-lg cursor-grab hover:bg-slate-600 transition-colors"
                >
                  <GripVertical className="w-3 h-3 text-slate-400" />
                  <span className="text-white text-sm">{staff.staff_name}</span>
                  <Badge variant="outline" className="text-xs border-cyan-500/50 text-cyan-400">
                    {staff.staff_role}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Header Row - Shift Blocks */}
            <div className="grid grid-cols-4 gap-2 mb-2">
              <div className="p-2 text-slate-400 font-medium text-sm">
                {config.assignmentUnit}
              </div>
              {SHIFT_BLOCKS.map(block => (
                <div key={block.id} className="p-2 text-center bg-slate-800 rounded-t-lg">
                  <p className="text-white font-medium text-sm">{block.label}</p>
                  <p className="text-slate-400 text-xs">{block.time}</p>
                </div>
              ))}
            </div>

            {/* Station Rows */}
            {stations.map(station => (
              <div key={station.id} className="grid grid-cols-4 gap-2 mb-2">
                {/* Station Name */}
                <div className="p-3 bg-slate-800 rounded-l-lg flex items-center gap-2">
                  <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 text-xs">
                    #{station.assignment_number || '—'}
                  </Badge>
                  <span className="text-white text-sm font-medium truncate">{station.station_name}</span>
                </div>

                {/* Shift Block Cells */}
                {SHIFT_BLOCKS.map(block => {
                  const assignedStaff = getStaffAtStation(station.id);
                  
                  return (
                    <div
                      key={`${station.id}-${block.id}`}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(station.id, block.id)}
                      className={`p-2 bg-slate-800/50 rounded border-2 border-dashed min-h-[60px] transition-colors ${
                        draggedStaff ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-slate-700'
                      }`}
                    >
                      <div className="flex flex-wrap gap-1">
                        {assignedStaff.map(staff => (
                          <div
                            key={staff.id}
                            onClick={() => handleUnassign(staff)}
                            className="flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-xs cursor-pointer hover:bg-red-500/20 hover:border-red-500/30 transition-colors"
                            title="Click to unassign"
                          >
                            <span className="text-white">{staff.staff_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {stations.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No {config.assignmentUnitPlural.toLowerCase()} configured. Add stations in the Stations tab.
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-700">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-slate-700 border-2 border-dashed border-slate-600"></div>
            <span>Empty slot</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/30"></div>
            <span>Assigned (click to remove)</span>
          </div>
          <div className="flex items-center gap-1">
            <GripVertical className="w-3 h-3" />
            <span>Drag to assign</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShiftScheduler;
