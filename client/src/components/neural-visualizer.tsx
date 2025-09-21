import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NeuralPattern {
  pattern_id: string;
  pattern_type: string;
  brain_waves: {
    alpha: number;
    theta: number;
    delta: number;
    beta: number;
    gamma: number;
  };
  visualization_data: {
    nodes: Array<{ x: number; y: number; intensity: number }>;
    connections: Array<{ from: number; to: number; strength: number }>;
  };
  activation_sequence: Array<{ timestamp: number; region: string; intensity: number }>;
}

export default function NeuralVisualizer() {
  const [currentPattern, setCurrentPattern] = useState<NeuralPattern | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  const generateNeuralPattern = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/neural/pathways/activate?consciousnessState=theta_gamma_sync");
      const result = await response.json();
      
      if (result.status === "success") {
        setCurrentPattern(result.data);
      }
    } catch (error) {
      console.error("Failed to generate neural pattern:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const startVisualization = () => {
    setIsActive(true);
    animateNeuralNetwork();
  };

  const stopVisualization = () => {
    setIsActive(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const animateNeuralNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentPattern) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
      ctx.lineWidth = 2;
      
      currentPattern.visualization_data.connections.forEach(connection => {
        const fromNode = currentPattern.visualization_data.nodes[connection.from];
        const toNode = currentPattern.visualization_data.nodes[connection.to];
        
        if (fromNode && toNode) {
          ctx.beginPath();
          ctx.moveTo(fromNode.x * canvas.width / 100, fromNode.y * canvas.height / 100);
          ctx.lineTo(toNode.x * canvas.width / 100, toNode.y * canvas.height / 100);
          ctx.globalAlpha = connection.strength * (0.5 + 0.5 * Math.sin(timestamp * 0.01));
          ctx.stroke();
        }
      });

      // Draw nodes
      currentPattern.visualization_data.nodes.forEach((node, index) => {
        const x = node.x * canvas.width / 100;
        const y = node.y * canvas.height / 100;
        const pulse = 0.5 + 0.5 * Math.sin(timestamp * 0.005 + index);
        
        ctx.beginPath();
        ctx.arc(x, y, 4 + pulse * 3, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(245, 158, 11, ${0.8 * node.intensity * pulse})`;
        ctx.fill();
      });

      if (isActive) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (currentPattern && isActive) {
      animateNeuralNetwork();
    }
  }, [currentPattern, isActive]);

  return (
    <div className="space-y-4">
      {/* Neural Network Visualization */}
      <div className="bg-secondary/50 rounded-lg p-6 relative overflow-hidden" style={{ minHeight: "200px" }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={180}
          className="absolute inset-0 w-full h-full"
          data-testid="neural-canvas"
        />
        
        {/* Static fallback when no pattern is active */}
        {!currentPattern && (
          <>
            <div className="neural-node" style={{ top: "20%", left: "15%", animationDelay: "0s" }}></div>
            <div className="neural-node" style={{ top: "40%", left: "30%", animationDelay: "0.5s" }}></div>
            <div className="neural-node" style={{ top: "60%", left: "45%", animationDelay: "1s" }}></div>
            <div className="neural-node" style={{ top: "30%", right: "20%", animationDelay: "1.5s" }}></div>
            <div className="neural-node" style={{ bottom: "20%", right: "35%", animationDelay: "2s" }}></div>

            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "rgba(34, 197, 94, 0.6)", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "rgba(20, 184, 166, 0.6)", stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <line x1="15%" y1="20%" x2="30%" y2="40%" stroke="url(#connectionGradient)" strokeWidth="2" opacity="0.7"/>
              <line x1="30%" y1="40%" x2="45%" y2="60%" stroke="url(#connectionGradient)" strokeWidth="2" opacity="0.7"/>
              <line x1="45%" y1="60%" x2="80%" y2="30%" stroke="url(#connectionGradient)" strokeWidth="2" opacity="0.7"/>
              <line x1="80%" y1="30%" x2="65%" y2="80%" stroke="url(#connectionGradient)" strokeWidth="2" opacity="0.7"/>
            </svg>
          </>
        )}

        <div className="absolute bottom-4 left-4 text-sm text-muted-foreground z-10">
          <div className="flex items-center space-x-4">
            <span>Alpha: <span className="text-green-400" data-testid="text-alpha">
              {currentPattern ? currentPattern.brain_waves.alpha.toFixed(1) : "8.2"} Hz
            </span></span>
            <span>Theta: <span className="text-teal-400" data-testid="text-theta">
              {currentPattern ? currentPattern.brain_waves.theta.toFixed(1) : "6.7"} Hz
            </span></span>
            <span>Delta: <span className="text-blue-400" data-testid="text-delta">
              {currentPattern ? currentPattern.brain_waves.delta.toFixed(1) : "2.1"} Hz
            </span></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={isActive ? stopVisualization : (currentPattern ? startVisualization : generateNeuralPattern)}
          disabled={isGenerating}
          className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
          data-testid="button-brain-mapping"
        >
          {isGenerating ? "Mapping..." : 
           isActive ? "Stop Mapping" : 
           currentPattern ? "Start Brain Mapping" : "Generate Pattern"}
        </Button>
        <Button
          onClick={() => currentPattern && console.log("Exporting neural data:", currentPattern)}
          disabled={!currentPattern}
          className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 border border-teal-500/30"
          data-testid="button-export-data"
        >
          Export Neural Data
        </Button>
      </div>

      {currentPattern && (
        <div className="text-xs text-muted-foreground space-y-1">
          <div>
            <strong>Pattern Type:</strong> 
            <span className="text-green-400 ml-1" data-testid="text-pattern-type">
              {currentPattern.pattern_type.replace(/_/g, " ")}
            </span>
          </div>
          <div>
            <strong>Nodes Active:</strong> 
            <Badge variant="outline" className="ml-1 text-xs" data-testid="badge-node-count">
              {currentPattern.visualization_data.nodes.length}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}
