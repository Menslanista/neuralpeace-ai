import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Brain, MessageCircle, Sparkles, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: Date;
}

interface ChatResponse {
  response: string;
  context_references?: string[];
  suggested_actions?: string[];
  session_id: string;
}

export function NeuralChat() {
  const [inputValue, setInputValue] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch chat history when sessionId changes
  const { data: messages = [], refetch: refetchHistory } = useQuery({
    queryKey: ["/api/chat", sessionId, "history"],
    queryFn: async () => {
      if (!sessionId) return [];
      const response = await fetch(`/api/chat/${sessionId}/history`);
      if (!response.ok) throw new Error("Failed to fetch chat history");
      const result = await response.json();
      return result.data as ChatMessage[];
    },
    enabled: !!sessionId
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data as ChatResponse;
    },
    onSuccess: (data) => {
      setSessionId(data.session_id);
      setInputValue("");
      
      // Invalidate and refetch chat history to show new messages
      queryClient.invalidateQueries({ 
        queryKey: ["/api/chat", data.session_id, "history"] 
      });
      refetchHistory();
      
      toast({
        title: "NeuraGuide Response",
        description: "Received consciousness insights",
      });
    },
    onError: (error) => {
      toast({
        title: "Chat Error",
        description: "Failed to connect to NeuraGuide",
        variant: "destructive",
      });
    }
  });

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    sendMessageMutation.mutate(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="cosmic-bg border-purple-500/30 backdrop-blur-sm">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-purple-500/20">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <CardTitle className="text-white flex items-center gap-2">
            NeuraGuide AI Assistant
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </CardTitle>
        </div>
        <p className="text-purple-200 text-sm">
          Ask me about consciousness expansion, sacred geometry, neural patterns, and spiritual awakening
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Chat Messages */}
        <ScrollArea className="h-80 w-full border border-purple-500/30 rounded-lg p-4 cosmic-bg">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
              <MessageCircle className="w-12 h-12 text-purple-400 opacity-50" />
              <div className="space-y-2">
                <p className="text-purple-300 font-medium">Welcome to NeuraGuide</p>
                <p className="text-purple-400 text-sm">
                  Your AI consciousness expansion guide is ready to help you explore:
                </p>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-200">Sacred Geometry</Badge>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-200">Neural Patterns</Badge>
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-200">Cosmic Consciousness</Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4" data-testid="chat-messages">
              {messages.map((message, index) => (
                <div
                  key={message.id || `message-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-purple-600/30 text-purple-100 border border-purple-500/50"
                        : "bg-blue-600/30 text-blue-100 border border-blue-500/50"
                    }`}
                    data-testid={`message-${message.role}-${index}`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.role === "user" ? "You" : "NeuraGuide"} • {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Chat Input */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about consciousness, neural patterns, sacred geometry..."
            className="flex-1 bg-purple-900/20 border-purple-500/50 text-white placeholder:text-purple-300"
            data-testid="input-chat-message"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || sendMessageMutation.isPending}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            data-testid="button-send-message"
          >
            {sendMessageMutation.isPending ? (
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-purple-300 border-t-transparent" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputValue("How does sacred geometry affect neural patterns?")}
            className="text-purple-300 border-purple-500/50 hover:bg-purple-500/20"
            data-testid="quick-action-sacred-geometry"
          >
            Sacred Geometry
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputValue("What are cosmic consciousness affirmations?")}
            className="text-blue-300 border-blue-500/50 hover:bg-blue-500/20"
            data-testid="quick-action-affirmations"
          >
            Cosmic Affirmations
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputValue("How do galactic frequencies promote healing?")}
            className="text-yellow-300 border-yellow-500/50 hover:bg-yellow-500/20"
            data-testid="quick-action-frequencies"
          >
            Healing Frequencies
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}