import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

type Props = {
  mode: string;
};

const AIGenerate = ({ mode }: Props) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('ai-generate-image', {
        body: { prompt },
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast({
          title: "Image generated!",
          description: "Your AI-generated image is ready.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
      <div className="mb-6">
        <h2 className="font-semibold text-xl mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Image Generator
        </h2>
        <p className="text-sm text-muted-foreground capitalize">
          Generate images, logos, and avatars for {mode}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-2">
            Describe what you want to generate
          </label>
          <Input
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A professional logo with modern design..."
            disabled={loading}
          />
        </div>

        <Button
          onClick={generateImage}
          disabled={loading || !prompt.trim()}
          className="w-full bg-gradient-to-r from-primary to-secondary"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Image
            </>
          )}
        </Button>

        {generatedImage && (
          <div className="mt-6 rounded-xl overflow-hidden border-2 border-primary/20">
            <img
              src={generatedImage}
              alt="AI Generated"
              className="w-full h-auto"
            />
          </div>
        )}

        {!generatedImage && !loading && (
          <div className="mt-6 aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
            <div className="text-center text-muted-foreground p-8">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Your generated image will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGenerate;
