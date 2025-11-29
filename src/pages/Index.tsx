import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Award, QrCode, Users, CheckCircle } from "lucide-react";
import logo from "@/assets/clean-check-logo.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Clean Check" className="h-12 w-auto" />
          </div>
          <Button onClick={() => navigate("/auth")}>Get Started</Button>
        </div>
      </header>

      <main>
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <h2 className="text-5xl font-bold mb-6">
              Professional Cleaning QA & Certification Platform
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Verify, showcase, and share your professional cleaning certifications with clients and partners
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/auth")}>
                Sign Up Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
                Login
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h4 className="text-xl font-semibold">Certification Management</h4>
                <p className="text-muted-foreground">
                  Store and manage all your professional certifications in one secure location
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <QrCode className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h4 className="text-xl font-semibold">QR Code Sharing</h4>
                <p className="text-muted-foreground">
                  Generate and share QR codes to instantly verify your credentials with clients
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h4 className="text-xl font-semibold">Partner Network</h4>
                <p className="text-muted-foreground">
                  Connect with service partners and build trust through verified credentials
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto text-center max-w-3xl">
            <h3 className="text-3xl font-bold mb-6">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-8">
              Join Clean Check today and take control of your professional certification management
            </p>
            <Button size="lg" onClick={() => navigate("/auth")}>
              Create Your Account
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Clean Check. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
