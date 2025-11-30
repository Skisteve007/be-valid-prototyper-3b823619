import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, ExternalLink, Loader2 } from "lucide-react";

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
  const [verifiedRequests, setVerifiedRequests] = useState<ReferenceRequest[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadReferences();
  }, [userId]);

  const loadReferences = async () => {
    try {
      const { data, error } = await supabase
        .from("member_references")
        .select("*")
        .eq("referee_user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles for all referrer_user_ids
      const referrerUserIds = (data || []).map((ref: any) => ref.referrer_user_id);
      
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("user_id, full_name, member_id, profile_image_url")
        .in("user_id", referrerUserIds);

      if (profileError) throw profileError;

      // Map profiles to references
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      
      const enrichedData = (data || []).map((ref: any) => ({
        ...ref,
        referrer_profile: profileMap.get(ref.referrer_user_id) || {
          full_name: "Unknown",
          member_id: "N/A",
          profile_image_url: null
        }
      }));

      const pending = enrichedData.filter((ref: any) => !ref.verified);
      const verified = enrichedData.filter((ref: any) => ref.verified);

      setPendingRequests(pending as ReferenceRequest[]);
      setVerifiedRequests(verified as ReferenceRequest[]);
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

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {pendingRequests.length > 0 && (
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">Verified References</span>
          </CardTitle>
          <CardDescription>
            Members you've confirmed as references
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verifiedRequests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No verified references yet
            </p>
          ) : (
            verifiedRequests.map((request) => (
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
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-mono">
                          {request.referrer_profile.member_id}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Verified {new Date(request.verified_at!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`/profile/${request.referrer_user_id}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingReferencesTab;