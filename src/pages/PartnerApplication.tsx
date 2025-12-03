import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Shield, Upload, CheckCircle2, ArrowLeft, Sparkles } from "lucide-react";

const PartnerApplication = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    payoutMethod: "paypal",
    payoutHandle: "",
  });
  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
  const [idBackFile, setIdBackFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState({ front: false, back: false });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (type: "front" | "back", file: File | null) => {
    if (type === "front") {
      setIdFrontFile(file);
    } else {
      setIdBackFile(file);
    }
  };

  const generateReferralCode = (name: string) => {
    const cleanName = name.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${cleanName}${random}`;
  };

  const uploadFile = async (file: File, userId: string, type: string) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${type}-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("affiliate-docs")
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from("affiliate-docs")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.payoutHandle) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!idFrontFile || !idBackFile) {
      toast.error("Please upload both sides of your government ID");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Create account first
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: Math.random().toString(36).slice(-12) + "A1!", // Temporary password
          options: {
            data: { full_name: formData.fullName }
          }
        });

        if (signUpError) throw signUpError;
        
        if (!signUpData.user) {
          toast.error("Failed to create account. Please try again.");
          return;
        }

        // Upload ID documents
        setUploadProgress({ front: true, back: false });
        const idFrontUrl = await uploadFile(idFrontFile, signUpData.user.id, "id-front");
        
        setUploadProgress({ front: true, back: true });
        const idBackUrl = await uploadFile(idBackFile, signUpData.user.id, "id-back");

        // Create affiliate record
        const referralCode = generateReferralCode(formData.fullName);
        
        const { error: affiliateError } = await (supabase
          .from("affiliates") as any)
          .insert({
            user_id: signUpData.user.id,
            referral_code: referralCode,
            full_name: formData.fullName,
            email: formData.email,
            paypal_email: formData.payoutHandle,
            payout_method: formData.payoutMethod,
            phone_number: formData.phone,
            id_front_url: idFrontUrl,
            id_back_url: idBackUrl,
            status: "pending",
          });

        if (affiliateError) throw affiliateError;

        toast.success("Application submitted! Check your email to set your password.");
        navigate("/sales-portal");
      } else {
        // User is logged in, just create affiliate record
        setUploadProgress({ front: true, back: false });
        const idFrontUrl = await uploadFile(idFrontFile, user.id, "id-front");
        
        setUploadProgress({ front: true, back: true });
        const idBackUrl = await uploadFile(idBackFile, user.id, "id-back");

        const referralCode = generateReferralCode(formData.fullName);

        const { error: affiliateError } = await (supabase
          .from("affiliates") as any)
          .insert({
            user_id: user.id,
            referral_code: referralCode,
            full_name: formData.fullName,
            email: formData.email,
            paypal_email: formData.payoutHandle,
            payout_method: formData.payoutMethod,
            phone_number: formData.phone,
            id_front_url: idFrontUrl,
            id_back_url: idBackUrl,
            status: "pending",
          });

        if (affiliateError) throw affiliateError;

        toast.success("Application submitted successfully!");
        navigate("/sales-portal");
      }
    } catch (error: any) {
      console.error("Application error:", error);
      toast.error(error.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
      setUploadProgress({ front: false, back: false });
    }
  };

  return (
    <div 
      className="min-h-screen text-white font-sans"
      style={{
        background: 'radial-gradient(circle at 50% 30%, rgba(244, 114, 182, 0.25) 0%, rgba(15, 23, 42, 1) 90%)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
      }}
    >
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>
      {/* Header */}
      <header className="relative border-b border-pink-500/20 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-amber-400" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-300" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">Clean Check</span>
              <span className="ml-2 text-xs font-semibold text-amber-400 tracking-wider">PARTNERS</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
            asChild
          >
            <Link to="/compliance"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Link>
          </Button>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
            <CheckCircle2 className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-amber-300 font-medium">Exclusive Partner Program</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-white">Strategic Partner</span>{" "}
            <span className="text-amber-400">Application</span>
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Join our global network of partners earning recurring commissions. Complete your application below.
          </p>
        </div>

        <Card className="bg-slate-900/80 border-pink-500/30 shadow-2xl shadow-pink-500/10">
          <CardHeader>
            <CardTitle className="text-white">Partner Information</CardTitle>
            <CardDescription className="text-slate-400">
              All fields are required for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Personal Details</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-slate-300">Full Legal Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Smith"
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-300">Mobile Phone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              {/* Payout Setup */}
              <div className="space-y-4 pt-4 border-t border-slate-700">
                <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Payout Setup</h3>
                
                <div className="space-y-2">
                  <Label className="text-slate-300">Payout Method *</Label>
                <Select 
                  value={formData.payoutMethod} 
                  onValueChange={(value) => setFormData({ ...formData, payoutMethod: value })}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue placeholder="Select payout method" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="z-50">
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="venmo">Venmo</SelectItem>
                      <SelectItem value="zelle">Zelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payoutHandle" className="text-slate-300">
                    {formData.payoutMethod === "zelle" ? "Zelle Email/Phone" : `${formData.payoutMethod.charAt(0).toUpperCase() + formData.payoutMethod.slice(1)} Email/Handle`} *
                  </Label>
                  <Input
                    id="payoutHandle"
                    name="payoutHandle"
                    value={formData.payoutHandle}
                    onChange={handleInputChange}
                    placeholder={formData.payoutMethod === "venmo" ? "@username" : "email@example.com"}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              {/* Identity Verification */}
              <div className="space-y-4 pt-4 border-t border-slate-700">
                <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Identity Verification (KYC)</h3>
                <p className="text-xs text-slate-500">Upload clear photos of your government-issued ID. Files are encrypted and stored securely.</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Government ID (Front) *</Label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange("front", e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        required
                      />
                      <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${idFrontFile ? "border-green-500 bg-green-500/10" : "border-slate-600 hover:border-amber-500/50"}`}>
                        {idFrontFile ? (
                          <div className="flex items-center justify-center gap-2 text-green-400">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-sm truncate max-w-[150px]">{idFrontFile.name}</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 mx-auto mb-2 text-slate-500" />
                            <p className="text-sm text-slate-400">Click to upload</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Government ID (Back) *</Label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange("back", e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        required
                      />
                      <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${idBackFile ? "border-green-500 bg-green-500/10" : "border-slate-600 hover:border-amber-500/50"}`}>
                        {idBackFile ? (
                          <div className="flex items-center justify-center gap-2 text-green-400">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-sm truncate max-w-[150px]">{idBackFile.name}</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 mx-auto mb-2 text-slate-500" />
                            <p className="text-sm text-slate-400">Click to upload</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 text-lg font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-500/25"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {uploadProgress.front && !uploadProgress.back ? "Uploading Documents..." : "Submitting..."}
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>

              <p className="text-xs text-slate-500 text-center">
                By submitting, you agree to our Partner Terms and consent to identity verification.
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PartnerApplication;
