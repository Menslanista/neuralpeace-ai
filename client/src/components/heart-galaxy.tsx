import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeartGalaxySession {
  session_id: string;
  heart_rate: number;
  coherence_level: number;
  galaxy_sync_status: string;
  cosmic_coordinates: {
    galactic_longitude: number;
    galactic_latitude: number;
    distance_from_center: number;
    constellation: string;
  };
  session_duration: number;
  connection_strength: string;
  biometric_harmony: string;
}

export default function HeartGalaxy() {
  const [currentSession, setCurrentSession] = useState<HeartGalaxySession | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [simulatedHeartRate, setSimulatedHeartRate] = useState(72);

  // Simulate heart rate changes
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedHeartRate(prev => {
        const variation = (Math.random() - 0.5) * 6;
        return Math.max(60, Math.min(100, Math.round(prev + variation)));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const connectToGalaxy = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch("/api/heart-galaxy/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          heart_rate: simulatedHeartRate,
          session_duration: 300
        }),
      });
      
      const result = await response.json();
      
      if (result.status === "success") {
        setCurrentSession(result.data);
      }
    } catch (error) {
      console.error("Failed to connect to galaxy:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "synchronized": return "text-green-400";
      case "aligning": return "text-yellow-400";
      case "seeking": return "text-orange-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4">
      {/* Heart Rate Display */}
      <div className="bg-secondary/50 rounded-lg p-4">
        <div className="text-center mb-4">
          <div className="text-3xl font-tech font-bold text-red-400 mb-1" data-testid="text-heart-rate">
            {currentSession ? currentSession.heart_rate : simulatedHeartRate}
          </div>
          <div className="text-sm text-muted-foreground">
            BPM - {currentSession ? "Cosmic Sync" : "Simulated"}
          </div>
        </div>
        
        {/* Heart Rate Visualization */}
        <div className="flex items-center justify-center h-16 mb-3">
          <svg className="w-full h-full" viewBox="0 0 200 50">
            <path 
              d="M0,25 Q50,10 100,25 T200,25" 
              stroke="rgba(239, 68, 68, 0.6)" 
              strokeWidth="2" 
              fill="none" 
              opacity="0.8"
            />
            <path 
              d="M0,25 Q50,40 100,25 T200,25" 
              stroke="rgba(236, 72, 153, 0.4)" 
              strokeWidth="1" 
              fill="none" 
              opacity="0.6"
            />
          </svg>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Coherence: 
            <span className="text-pink-400 ml-1" data-testid="text-coherence">
              {currentSession ? currentSession.coherence_level : 87}%
            </span>
          </span>
          <span>
            Galaxy Sync: 
            <span className={`ml-1 capitalize ${getStatusColor(currentSession?.galaxy_sync_status || "seeking")}`} data-testid="text-sync-status">
              {currentSession ? currentSession.galaxy_sync_status : "Inactive"}
            </span>
          </span>
        </div>

        {currentSession && (
          <div className="mt-4 space-y-2">
            <div className="text-xs text-muted-foreground">
              <strong>Connection Strength:</strong>
              <Badge 
                variant="outline" 
                className={`ml-1 text-xs ${
                  currentSession.connection_strength === "strong" ? "text-green-400" :
                  currentSession.connection_strength === "moderate" ? "text-yellow-400" : "text-orange-400"
                }`}
                data-testid="badge-connection-strength"
              >
                {currentSession.connection_strength}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              <strong>Constellation:</strong>
              <span className="text-accent ml-1" data-testid="text-constellation">
                {currentSession.cosmic_coordinates.constellation}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              <strong>Galactic Distance:</strong>
              <span className="text-primary ml-1" data-testid="text-distance">
                {Math.round(currentSession.cosmic_coordinates.distance_from_center)} ly
              </span>
            </div>
          </div>
        )}
      </div>

      <Button
        onClick={connectToGalaxy}
        disabled={isConnecting}
        className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
        data-testid="button-connect-cosmos"
      >
        {isConnecting ? "Establishing Connection..." : 
         currentSession ? "Reconnect to Cosmos" : "Connect to Cosmos"}
      </Button>
    </div>
  );
}
