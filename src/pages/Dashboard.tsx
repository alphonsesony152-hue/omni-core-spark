import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, User, Briefcase, Users, Home, LogOut, Plus } from "lucide-react";
import AIChat from "@/components/AIChat";
import AIGenerate from "@/components/AIGenerate";

type Mode = 'personal' | 'career' | 'team' | 'family';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [mode, setMode] = useState<Mode>('personal');
  const [activeTab, setActiveTab] = useState('chat');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "See you soon!",
    });
    navigate("/");
  };

  const getModeIcon = (m: Mode) => {
    switch (m) {
      case 'personal': return <User className="w-4 h-4" />;
      case 'career': return <Briefcase className="w-4 h-4" />;
      case 'team': return <Users className="w-4 h-4" />;
      case 'family': return <Home className="w-4 h-4" />;
    }
  };

  const getModeColor = (m: Mode) => {
    switch (m) {
      case 'personal': return 'from-purple-500 to-blue-500';
      case 'career': return 'from-blue-500 to-cyan-500';
      case 'team': return 'from-cyan-500 to-green-500';
      case 'family': return 'from-green-500 to-yellow-500';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getModeColor(mode)} flex items-center justify-center`}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Super App</h1>
              <p className="text-xs text-muted-foreground capitalize">{mode} Mode</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Mode Switcher */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['personal', 'career', 'team', 'family'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                mode === m
                  ? `border-primary bg-gradient-to-br ${getModeColor(m)} text-white shadow-lg scale-105`
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                {getModeIcon(m)}
                <span className="font-semibold capitalize">{m}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="chat">AI Chat</TabsTrigger>
            <TabsTrigger value="generate">AI Generate</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <AIChat mode={mode} />
          </TabsContent>

          <TabsContent value="generate" className="space-y-4">
            <AIGenerate mode={mode} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
