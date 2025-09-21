import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Square } from "lucide-react";

interface Soundscape {
  soundscape_id: string;
  name: string;
  frequencies: Array<{ hz: number; type: string; amplitude: number }>;
  duration: number;
  galactic_type: string;
  audio_params: {
    reverb: number;
    delay: number;
    filter: string;
    modulation: number;
  };
}

export default function GalacticChant() {
  const [currentSoundscape, setCurrentSoundscape] = useState<Soundscape | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [oscillators, setOscillators] = useState<OscillatorNode[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      stopAllOscillators();
    };
  }, []);

  const generateSoundscape = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/chants/galactic/synthesize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "cosmic_harmony",
          duration: 600
        }),
      });
      
      const result = await response.json();
      
      if (result.status === "success") {
        setCurrentSoundscape(result.data);
      }
    } catch (error) {
      console.error("Failed to generate soundscape:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const initAudioContext = () => {
    if (!audioContext) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);
      return ctx;
    }
    return audioContext;
  };

  const playGalacticChant = async () => {
    if (!currentSoundscape) return;

    const ctx = initAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    stopAllOscillators();

    const newOscillators: OscillatorNode[] = [];

    currentSoundscape.frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq.hz, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(freq.amplitude * 0.1, ctx.currentTime + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start();
      newOscillators.push(oscillator);
    });

    setOscillators(newOscillators);
    setIsPlaying(true);
  };

  const stopAllOscillators = () => {
    oscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    setOscillators([]);
    setIsPlaying(false);
  };

  const pauseChant = () => {
    stopAllOscillators();
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={generateSoundscape}
        disabled={isGenerating}
        className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30"
        data-testid="button-generate-soundscape"
      >
        {isGenerating ? "Channeling Galactic Frequencies..." : "Create Soundscape"}
      </Button>

      {currentSoundscape ? (
        <div className="bg-secondary/50 rounded-lg p-4" data-testid="soundscape-display">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Galactic Frequency</span>
            <Badge className="bg-purple-500/20 text-purple-400" data-testid="badge-main-frequency">
              {currentSoundscape.frequencies[0]?.hz || 528} Hz
            </Badge>
          </div>
          
          <div className="text-sm font-medium mb-3" data-testid="text-soundscape-name">
            {currentSoundscape.name}
          </div>

          {/* Audio Visualizer Mockup */}
          <div className="flex items-end justify-center space-x-1 h-16 mb-3">
            {[20, 60, 100, 40, 80, 30, 70].map((height, index) => (
              <div
                key={index}
                className="bg-gradient-to-t from-purple-500 to-pink-500 w-2 rounded-full transition-all duration-300"
                style={{ height: `${isPlaying ? height : 20}%` }}
                data-testid={`visualizer-bar-${index}`}
              />
            ))}
          </div>

          <div className="flex justify-center space-x-4 mb-3">
            <Button
              size="sm"
              onClick={playGalacticChant}
              disabled={isPlaying}
              className="w-10 h-10 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-full p-0"
              data-testid="button-play"
            >
              <Play size={16} />
            </Button>
            <Button
              size="sm"
              onClick={pauseChant}
              disabled={!isPlaying}
              className="w-10 h-10 bg-secondary hover:bg-secondary/80 text-muted-foreground rounded-full p-0"
              data-testid="button-pause"
            >
              <Pause size={16} />
            </Button>
            <Button
              size="sm"
              onClick={stopAllOscillators}
              className="w-10 h-10 bg-secondary hover:bg-secondary/80 text-muted-foreground rounded-full p-0"
              data-testid="button-stop"
            >
              <Square size={16} />
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <strong>Galactic Type:</strong> 
            <span className="text-purple-400 ml-1 capitalize" data-testid="text-galactic-type">
              {currentSoundscape.galactic_type.replace(/_/g, " ")}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-secondary/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Galactic Frequency</span>
            <Badge className="bg-purple-500/20 text-purple-400">528 Hz</Badge>
          </div>
          
          <div className="flex items-end justify-center space-x-1 h-16 mb-3">
            {[20, 60, 100, 40, 80, 30, 70].map((height, index) => (
              <div
                key={index}
                className="bg-gradient-to-t from-purple-500 to-pink-500 w-2 rounded-full"
                style={{ height: "20%" }}
              />
            ))}
          </div>

          <div className="text-center text-muted-foreground text-sm">
            Generate your first galactic soundscape
          </div>
        </div>
      )}
    </div>
  );
}
