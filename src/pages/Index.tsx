import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Zap, Brain, Users, Shield, TrendingUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-secondary mb-6 animate-pulse">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent leading-tight">
            Xylos
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            One intelligent platform for personal growth, career advancement, team collaboration, and family management. Powered by Alphonse's Colabration.
          </p>

          <div className="flex justify-center pt-8">
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
              className="text-lg px-8 py-6 h-auto"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: Brain,
              title: "Advanced AI Chat",
              description: "Natural conversations with context-aware AI that learns from every interaction",
              gradient: "from-purple-500 to-blue-500"
            },
            {
              icon: Zap,
              title: "Instant Generation",
              description: "Create images, logos, avatars, and content in seconds with AI",
              gradient: "from-blue-500 to-cyan-500"
            },
            {
              icon: Users,
              title: "Multi-Mode Workspace",
              description: "Switch between Personal, Career, Team, and Family modes seamlessly",
              gradient: "from-cyan-500 to-green-500"
            },
            {
              icon: TrendingUp,
              title: "Smart Analytics",
              description: "Predictive insights and recommendations based on your habits",
              gradient: "from-green-500 to-yellow-500"
            },
            {
              icon: Shield,
              title: "Enterprise Security",
              description: "Bank-level encryption with granular privacy controls",
              gradient: "from-yellow-500 to-orange-500"
            },
            {
              icon: Sparkles,
              title: "Proactive Assistant",
              description: "AI that anticipates your needs and suggests actions before you ask",
              gradient: "from-orange-500 to-red-500"
            }
          ].map((feature, idx) => (
            <div
              key={idx}
              className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-3xl p-12">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Life?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who are already using AI to achieve more
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-12 py-6 h-auto"
          >
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
