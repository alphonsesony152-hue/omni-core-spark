import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import authHeroImage from "@/assets/auth-hero.png";

const Auth = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${authHeroImage})` }}
    >
      <div className="absolute inset-0 bg-black/20" />
      <div className="w-full max-w-md text-center space-y-8 relative z-10">
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-secondary mb-4">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              XYLOS AI
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
              FIRST DAY.
              <br />
              NEW LEGACY
            </h2>
          </div>
        </div>

        <div className="space-y-4 pt-8">
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/signup")}
            className="w-full text-lg py-6 h-auto bg-card hover:bg-accent"
          >
            Sign up
          </Button>
          
          <Button
            size="lg"
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg py-6 h-auto"
          >
            Log in
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
