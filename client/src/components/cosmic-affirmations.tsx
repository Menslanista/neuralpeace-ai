import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Affirmation {
  affirmation_id: string;
  text: string;
  category: string;
  vibrational_frequency: number;
  cosmic_alignment: string;
  personalization_factors: string[];
}

export default function CosmicAffirmations() {
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userInput, setUserInput] = useState({
    intention: "",
    lifeArea: "",
    personality: ""
  });

  const generateAffirmation = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/affirmations/cosmic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInput),
      });
      
      const result = await response.json();
      
      if (result.status === "success") {
        setCurrentAffirmation(result.data);
      }
    } catch (error) {
      console.error("Failed to generate affirmation:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Input Fields */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Your intention"
          value={userInput.intention}
          onChange={(e) => setUserInput({...userInput, intention: e.target.value})}
          className="w-full px-3 py-2 bg-secondary/50 rounded-lg border border-border text-foreground placeholder-muted-foreground text-sm"
          data-testid="input-intention"
        />
        <input
          type="text"
          placeholder="Life area (e.g., career, relationships)"
          value={userInput.lifeArea}
          onChange={(e) => setUserInput({...userInput, lifeArea: e.target.value})}
          className="w-full px-3 py-2 bg-secondary/50 rounded-lg border border-border text-foreground placeholder-muted-foreground text-sm"
          data-testid="input-life-area"
        />
      </div>

      <Button
        onClick={generateAffirmation}
        disabled={isGenerating}
        className="w-full bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30"
        data-testid="button-generate-affirmation"
      >
        {isGenerating ? "Channeling Cosmic Wisdom..." : "Generate Personal Affirmation"}
      </Button>

      {/* Affirmation Display */}
      {isGenerating ? (
        <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Skeleton className="h-6 w-full" />
          <div className="flex justify-center space-x-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      ) : currentAffirmation ? (
        <div className="bg-secondary/50 rounded-lg p-4" data-testid="affirmation-display">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Today's Cosmic Affirmation</div>
            <blockquote className="text-lg italic text-foreground mb-3" data-testid="text-affirmation">
              "{currentAffirmation.text}"
            </blockquote>
            <div className="flex justify-center space-x-2">
              <Badge className="bg-accent/20 text-accent" data-testid="badge-category">
                {currentAffirmation.category}
              </Badge>
              <Badge className="bg-primary/20 text-primary" data-testid="badge-frequency">
                {currentAffirmation.vibrational_frequency}Hz
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-3">
              <strong>Cosmic Alignment:</strong> 
              <span className="text-accent ml-1" data-testid="text-cosmic-alignment">
                {currentAffirmation.cosmic_alignment}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-secondary/50 rounded-lg p-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Today's Cosmic Affirmation</div>
            <blockquote className="text-lg italic text-foreground mb-3">
              "Generate your first personalized cosmic affirmation"
            </blockquote>
            <div className="flex justify-center space-x-2">
              <Badge className="bg-accent/20 text-accent">Potential</Badge>
              <Badge className="bg-primary/20 text-primary">Awaiting</Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
