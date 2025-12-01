import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, ExternalLink, Loader2, Eye, Lock, Unlock } from "lucide-react";

interface PendingReferencesTabProps {
  userId: string;
}

interface ReferenceRequest {
  id: string;
  referrer_user_id: string;
  verified: boolean;
  created_at: string;
  verified_at: string | null;
  referrer_profile: {
    full_name: string;
    member_id: string;
    profile_image_url: string | null;
  };
}

const PendingReferencesTab = ({ userId }: PendingReferencesTabProps) => {
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<ReferenceRequest[]>([]);
  const [myReferences, setMyReferences] = useState<ReferenceRequest[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);
  const [referencesLocked, setReferencesLocked] = useState(true);

  useEffect(() => {
    loadReferences();
  }, [userId]);

  const loadReferences = async () => {
    try {
      // Load user's profile to get references_locked status
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("references_locked")
        .eq("user_id", userId)
        .single();

      if (profileError) throw profileError;
      
      setReferencesLocked(profileData?.references_locked ?? true);

      // Load incoming references (where I'm the referee)
      const { data: incomingData, error: incomingError } = await supabase
        .from("member_references")
        .select("*")
        .eq("referee_user_id", userId)
        .order("created_at", { ascending: false });

      if (incomingError) throw incomingError;

      // Load my outgoing references (where I'm the referrer)
      const { data: outgoingData, error: outgoingError } = await supabase
        .from("member_references")
        .select("*")
        .eq("referrer_user_id", userId)
        .order("created_at", { ascending: false });

      if (outgoingError) throw outgoingError;

      // Fetch profiles for incoming references
      const referrerUserIds = (incomingData || []).map((ref: any) => ref.referrer_user_id);
      
      const { data: referrerProfiles, error: referrerProfileError } = await supabase
        .from("profiles")
        .select("user_id, full_name, member_id, profile_image_url")
        .in("user_id", referrerUserIds);

      if (referrerProfileError) throw referrerProfileError;

      // Fetch profiles for outgoing references
      const refereeUserIds = (outgoingData || []).map((ref: any) => ref.referee_user_id);
      
      const { data: refereeProfiles, error: refereeProfileError } = await supabase
        .from("profiles")
        .select("user_id, full_name, member_id, profile_image_url")
        .in("user_id", refereeUserIds);

      if (refereeProfileError) throw refereeProfileError;

      // Map profiles to incoming references
      const referrerProfileMap = new Map(referrerProfiles?.map(p => [p.user_id, p]) || []);
      
      const enrichedIncomingData = (incomingData || []).map((ref: any) => ({
        ...ref,
        referrer_profile: referrerProfileMap.get(ref.referrer_user_id) || {
          full_name: "Unknown",
          member_id: "N/A",
          profile_image_url: null
        }
      }));

      // Map profiles to outgoing references
      const refereeProfileMap = new Map(refereeProfiles?.map(p => [p.user_id, p]) || []);
      
      const enrichedOutgoingData = (outgoingData || []).map((ref: any) => ({
        ...ref,
        referrer_profile: refereeProfileMap.get(ref.referee_user_id) || {
          full_name: "Unknown",
          member_id: "N/A",
          profile_image_url: null
        }
      }));

      const pending = enrichedIncomingData.filter((ref: any) => !ref.verified);

      setPendingRequests(pending as ReferenceRequest[]);
      setMyReferences(enrichedOutgoingData as ReferenceRequest[]);
    } catch (error: any) {
      console.error("Failed to load references:", error);
      toast.error("Failed to load reference requests");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (referenceId: string) => {
    setProcessing(referenceId);
    try {
      const { error } = await supabase
        .from("member_references")
        .update({ 
          verified: true,
          verified_at: new Date().toISOString()
        })
        .eq("id", referenceId);

      if (error) throw error;

      toast.success("Reference verified successfully");
      loadReferences();
    } catch (error: any) {
      toast.error("Failed to verify reference");
    } finally {
      setProcessing(null);
    }
  };

  const handleDeny = async (referenceId: string) => {
    setProcessing(referenceId);
    try {
      const { error } = await supabase
        .from("member_references")
        .delete()
        .eq("id", referenceId);

      if (error) throw error;

      toast.success("Reference request denied");
      loadReferences();
    } catch (error: any) {
      toast.error("Failed to deny reference");
    } finally {
      setProcessing(null);
    }
  };

  const handleToggleLock = async () => {
    try {
      const newLockedState = !referencesLocked;
      
      const { error } = await supabase
        .from("profiles")
        .update({ references_locked: newLockedState })
        .eq("user_id", userId);

      if (error) throw error;

      setReferencesLocked(newLockedState);
      toast.success(newLockedState ? "References locked and hidden" : "References unlocked and visible");
    } catch (error: any) {
      toast.error("Failed to update reference privacy");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {!referencesLocked && pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">Pending Reference Requests</span>
            </CardTitle>
            <CardDescription>
              Members who have listed you as a reference. Verify to confirm the relationship.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      {request.referrer_profile.profile_image_url ? (
                        <img
                          src={request.referrer_profile.profile_image_url}
                          alt={request.referrer_profile.full_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-lg font-semibold text-muted-foreground">
                            {request.referrer_profile.full_name?.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{request.referrer_profile.full_name}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {request.referrer_profile.member_id}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Requested {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleVerify(request.id)}
                        disabled={processing === request.id}
                      >
                        {processing === request.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Verify
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeny(request.id)}
                        disabled={processing === request.id}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Deny
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {referencesLocked && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">My Clear Check Reference Member</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleLock();
                }}
                className="ml-auto p-1 hover:bg-muted rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
                title="Unlock references"
              >
                <Lock className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-semibold text-muted-foreground">References Locked</p>
            <p className="text-sm text-muted-foreground mt-2">
              Click the lock icon above to view and manage your references.
            </p>
          </CardContent>
        </Card>
      )}

      {!referencesLocked && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">My Clear Check Reference Member</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleLock();
                }}
                className="ml-auto p-1 hover:bg-muted rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
                title={referencesLocked ? "Unlock references" : "Lock references"}
              >
                {referencesLocked ? (
                  <Lock className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                ) : (
                  <Unlock className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                )}
              </button>
            </CardTitle>
            <CardDescription>
              Members you've added as references (from your profile)
            </CardDescription>
          </CardHeader>
        <CardContent className="space-y-4">
          {myReferences.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No references added yet. Add member IDs in your Profile tab.
            </p>
          ) : (
            myReferences.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      {request.referrer_profile.profile_image_url ? (
                        <img
                          src={request.referrer_profile.profile_image_url}
                          alt={request.referrer_profile.full_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-lg font-semibold text-muted-foreground">
                            {request.referrer_profile.full_name?.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{request.referrer_profile.full_name}</p>
                          {request.verified ? (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground font-mono">
                          {request.referrer_profile.member_id}
                        </p>
                        {request.verified ? (
                          <p className="text-xs text-muted-foreground mt-1">
                            Verified {new Date(request.verified_at!).toLocaleDateString()}
                          </p>
                        ) : (
                          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                            Awaiting verification from member
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
      )}
    </div>
  );
};

export default PendingReferencesTab;