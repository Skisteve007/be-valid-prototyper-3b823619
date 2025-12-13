// Universal Workforce Module - Staff List, Shift Assignment, Time Clock
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Clock, Trash2, LogIn, LogOut, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { getIndustryConfig } from "@/config/industryConfig";

interface StaffMember {
  id: string;
  staff_name: string;
  staff_role: string;
  station_id?: string;
  station_name?: string;
  is_active: boolean;
  shift_start: string;
  shift_end?: string;
  qr_token?: string;
}

interface WorkforceModuleProps {
  venueId: string | null;
  industryType: string;
  stations: { id: string; station_name: string }[];
}

const WorkforceModule = ({ venueId, industryType, stations }: WorkforceModuleProps) => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("");
  const [newStaffStation, setNewStaffStation] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const config = getIndustryConfig(industryType);

  useEffect(() => {
    if (venueId) {
      loadStaff();
    }
  }, [venueId]);

  const loadStaff = async () => {
    if (!venueId) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from("staff_shifts")
      .select(`
        id,
        staff_name,
        staff_role,
        station_id,
        is_active,
        shift_start,
        shift_end,
        qr_token,
        venue_stations (
          station_name
        )
      `)
      .eq("venue_id", venueId)
      .order("shift_start", { ascending: false });

    if (error) {
      console.error("Error loading staff:", error);
      // Demo data fallback
      setStaffList([
        { id: "1", staff_name: "Mike Torres", staff_role: "Doorman", is_active: true, shift_start: new Date().toISOString() },
        { id: "2", staff_name: "Sarah Lee", staff_role: "Bartender", is_active: true, shift_start: new Date().toISOString() },
        { id: "3", staff_name: "James King", staff_role: "VIP Host", is_active: false, shift_start: new Date().toISOString(), shift_end: new Date().toISOString() }
      ]);
    } else {
      const formattedStaff = (data || []).map(s => ({
        ...s,
        station_name: (s.venue_stations as any)?.station_name || undefined
      }));
      setStaffList(formattedStaff);
    }
    setIsLoading(false);
  };

  const handleAddStaff = async () => {
    if (!venueId || !newStaffName.trim() || !newStaffRole) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Generate a simple user ID for demo (in production, this would be a real auth user)
    const demoUserId = crypto.randomUUID();

    const { data, error } = await supabase
      .from("staff_shifts")
      .insert({
        venue_id: venueId,
        staff_name: newStaffName.trim(),
        staff_role: newStaffRole,
        station_id: newStaffStation || null,
        staff_user_id: demoUserId,
        shift_start: new Date().toISOString(),
        is_active: true
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add staff member");
      console.error(error);
    } else {
      toast.success(`${newStaffName} added to roster!`);
      setStaffList(prev => [data, ...prev]);
      setNewStaffName("");
      setNewStaffRole("");
      setNewStaffStation("");
      setIsAddingStaff(false);
    }
  };

  const handleClockOut = async (staffId: string) => {
    const { error } = await supabase
      .from("staff_shifts")
      .update({ 
        is_active: false,
        shift_end: new Date().toISOString()
      })
      .eq("id", staffId);

    if (error) {
      toast.error("Failed to clock out");
    } else {
      toast.success("Clocked out successfully");
      setStaffList(prev => prev.map(s => 
        s.id === staffId ? { ...s, is_active: false, shift_end: new Date().toISOString() } : s
      ));
    }
  };

  const handleRemoveStaff = async (staffId: string) => {
    const { error } = await supabase
      .from("staff_shifts")
      .delete()
      .eq("id", staffId);

    if (error) {
      toast.error("Failed to remove staff");
    } else {
      toast.success("Staff removed from roster");
      setStaffList(prev => prev.filter(s => s.id !== staffId));
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateShiftHours = (start: string, end?: string) => {
    const startTime = new Date(start);
    const endTime = end ? new Date(end) : new Date();
    const diffMs = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const activeCount = staffList.filter(s => s.is_active).length;

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <CardTitle className="text-white">Workforce Roster</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              {activeCount} Active
            </Badge>
            <Dialog open={isAddingStaff} onOpenChange={setIsAddingStaff}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-black">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Add Staff Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Name</Label>
                    <Input
                      placeholder="Full Name"
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Role</Label>
                    <Select value={newStaffRole} onValueChange={setNewStaffRole}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="Select role..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {config.staffRoles.map(role => (
                          <SelectItem key={role} value={role} className="text-white">
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Assign to {config.assignmentUnit}</Label>
                    <Select value={newStaffStation} onValueChange={setNewStaffStation}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="Select station..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="" className="text-slate-400">Unassigned</SelectItem>
                        {stations.map(station => (
                          <SelectItem key={station.id} value={station.id} className="text-white">
                            {station.station_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddStaff} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black">
                    Add to Roster
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <CardDescription className="text-slate-400">
          Staff List, Shift Assignment & Time Clock
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-400">Name</TableHead>
                <TableHead className="text-slate-400">Role</TableHead>
                <TableHead className="text-slate-400">{config.assignmentUnit}</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400">Clock In</TableHead>
                <TableHead className="text-slate-400">Hours</TableHead>
                <TableHead className="text-slate-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                    No staff on roster. Add your first team member.
                  </TableCell>
                </TableRow>
              ) : (
                staffList.map(staff => (
                  <TableRow key={staff.id} className="border-slate-700">
                    <TableCell className="text-white font-medium">
                      <div className="flex items-center gap-2">
                        <UserCheck className={`w-4 h-4 ${staff.is_active ? 'text-green-400' : 'text-slate-500'}`} />
                        {staff.staff_name}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">{staff.staff_role}</TableCell>
                    <TableCell className="text-cyan-400">{staff.station_name || '—'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={staff.is_active 
                          ? 'border-green-500/50 text-green-400' 
                          : 'border-slate-500/50 text-slate-400'
                        }
                      >
                        {staff.is_active ? 'On Shift' : 'Off'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400 font-mono text-sm">
                      {formatTime(staff.shift_start)}
                    </TableCell>
                    <TableCell className="text-slate-400 font-mono text-sm">
                      {calculateShiftHours(staff.shift_start, staff.shift_end)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {staff.is_active && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-yellow-400 hover:text-yellow-300"
                            onClick={() => handleClockOut(staff.id)}
                            title="Clock Out"
                          >
                            <LogOut className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400 hover:text-red-300"
                          onClick={() => handleRemoveStaff(staff.id)}
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkforceModule;
