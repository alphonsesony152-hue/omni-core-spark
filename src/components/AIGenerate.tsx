import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Plus, Camera, Image as ImageIcon, Mic, MicOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AIGenerate = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [style, setStyle] = useState<string>("realistic");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        toast({
          title: "Image attached",
          description: "Reference image for generation",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const startVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in your browser",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(prev => prev + (prev ? ' ' : '') + transcript);
      toast({
        title: "Voice captured",
        description: "Your speech has been converted to text",
      });
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      toast({
        title: "Error",
        description: "Could not recognize speech. Please try again.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setGeneratedImage(null);

    try {
      const stylePrefix = style !== "realistic" ? `${style} style: ` : "";
      const fullPrompt = `${stylePrefix}${prompt}`;
      
      const { data, error } = await supabase.functions.invoke('ai-generate-image', {
        body: { prompt: fullPrompt },
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
          Xylos Image Generator
        </h2>
        <p className="text-sm text-muted-foreground">
          Generate images, logos, and avatars with AI
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="style" className="block text-sm font-medium mb-2">
            Art Style
          </label>
          <Select value={style} onValueChange={setStyle} disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realistic">Realistic/Photorealistic</SelectItem>
              <SelectItem value="cartoon">Cartoon Animation</SelectItem>
              <SelectItem value="oil painting">Oil Painting</SelectItem>
              <SelectItem value="watercolor">Watercolor</SelectItem>
              <SelectItem value="sketch">Sketch/Pencil Drawing</SelectItem>
              <SelectItem value="pixel art">Pixel Art</SelectItem>
              <SelectItem value="pop art">Pop Art</SelectItem>
              <SelectItem value="3D render">3D Render</SelectItem>
              <SelectItem value="minimalist">Minimalist</SelectItem>
              <SelectItem value="concept art">Concept Art</SelectItem>
              <SelectItem value="line art">Line Art</SelectItem>
              <SelectItem value="vector art">Vector Art</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-2">
            Describe what you want to generate
          </label>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" size="icon" disabled={loading}>
                  <Plus className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => cameraInputRef.current?.click()}>
                  <Camera className="w-4 h-4 mr-2" />
                  Camera
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Gallery
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              disabled={loading}
              className={isRecording ? "bg-destructive text-destructive-foreground" : ""}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>

            <div className="flex-1 flex flex-col gap-2">
              {selectedImage && (
                <div className="relative inline-block">
                  <img src={selectedImage} alt="Reference" className="h-20 rounded border" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => setSelectedImage(null)}
                  >
                    ×
                  </Button>
                </div>
              )}
              <Input
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A professional logo with modern design..."
                disabled={loading}
                className="w-full"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading && prompt.trim()) {
                    generateImage();
                  }
                }}
              />
            </div>
          </div>
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
