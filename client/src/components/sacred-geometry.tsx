import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Meditation {
  meditation_id: string;
  pattern: string;
  duration: number;
  frequencies: Array<{ hz: number; type: string }>;
  geometry_sequence: Array<{
    shape: string;
    transform: string;
    color: string;
    timing: number;
  }>;
  neural_targets: string[];
  consciousness_level: string;
  guided_text: string;
}

export default function SacredGeometry() {
  const [intention, setIntention] = useState("");
  const [currentMeditation, setCurrentMeditation] = useState<Meditation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMeditation = async () => {
    setIsGenerating(true);
    try {
      const params = new URLSearchParams();
      if (intention) params.append("intention", intention);
      params.append("duration", "1260");

      const response = await fetch(`/api/sacred-geometry/generate?${params}`);
      const result = await response.json();
      
      if (result.status === "success") {
        setCurrentMeditation(result.data);
      }
    } catch (error) {
      console.error("Failed to generate meditation:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Meditation Input */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Set your intention (optional)"
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          className="w-full px-3 py-2 bg-secondary/50 rounded-lg border border-border text-foreground placeholder-muted-foreground"
          data-testid="input-intention"
        />
        <Button
          onClick={generateMeditation}
          disabled={isGenerating}
          className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
          data-testid="button-generate-meditation"
        >
          {isGenerating ? "Generating Sacred Pattern..." : "Generate New Pattern"}
        </Button>
      </div>

      {/* Current Meditation Display */}
      {isGenerating ? (
        <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-2 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ) : currentMeditation ? (
        <div className="bg-secondary/50 rounded-lg p-4" data-testid="meditation-display">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Current Meditation</span>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              Active
            </Badge>
          </div>
          <div className="text-sm font-medium mb-2 capitalize" data-testid="text-pattern-name">
            {currentMeditation.pattern.replace(/_/g, " ")}
          </div>
          <Progress value={35} className="mb-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span data-testid="text-duration-current">7:23</span>
            <span data-testid="text-duration-total">
              {Math.floor(currentMeditation.duration / 60)}:{(currentMeditation.duration % 60).toString().padStart(2, "0")}
            </span>
          </div>
          
          {/* Meditation Details */}
          <div className="mt-4 space-y-2">
            <div className="text-xs text-muted-foreground">
              <strong>Consciousness Level:</strong> 
              <span className="text-accent ml-1" data-testid="text-consciousness-level">
                {currentMeditation.consciousness_level.replace(/_/g, " ")}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              <strong>Frequencies:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {currentMeditation.frequencies.map((freq, index) => (
                  <Badge key={index} variant="outline" className="text-xs" data-testid={`freq-${index}`}>
                    {freq.hz}Hz
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-secondary/50 rounded-lg p-4">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">Generate your first sacred geometry meditation pattern</p>
          </div>
        </div>
      )}
    </div>
  );
}
