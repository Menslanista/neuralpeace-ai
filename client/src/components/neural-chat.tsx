import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Brain, MessageCircle, Sparkles, Send, Mic, MicOff, Trash2, ListTodo, Plus, Check } from "lucide-react";
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

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  created_at: Date;
}

export function NeuralChat() {
  const [inputValue, setInputValue] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [showTodos, setShowTodos] = useState(false);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const { toast } = useToast();

  // Load todos and chat history from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('neurapeace-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
    
    const savedSessionId = localStorage.getItem('neurapeace-session-id');
    if (savedSessionId) {
      setSessionId(savedSessionId);
    }
  }, []);

  // Load chat messages from localStorage for current session
  const loadLocalMessages = useCallback((sid: string) => {
    const savedMessages = localStorage.getItem(`neurapeace-chat-${sid}`);
    return savedMessages ? JSON.parse(savedMessages) : [];
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('neurapeace-todos', JSON.stringify(todos));
  }, [todos]);

  // Save session ID to localStorage when it changes
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('neurapeace-session-id', sessionId);
    }
  }, [sessionId]);

  // Sound effects with shared AudioContext
  const playSound = useCallback((type: 'send' | 'receive' | 'error' | 'click') => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const context = audioContextRef.current;
      if (context.state === 'suspended') {
        context.resume();
      }
      
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      const frequencies = {
        send: 800,
        receive: 600,
        error: 300,
        click: 400
      };
      
      oscillator.frequency.setValueAtTime(frequencies[type], context.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.1);
    } catch (error) {
      // Silently fail if audio is not available
      console.warn('Audio playback failed:', error);
    }
  }, []);

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        playSound('click');
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
        playSound('receive');
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsRecording(false);
        playSound('error');
        toast({
          title: "Voice Recognition Error",
          description: "Failed to recognize speech. Please try again.",
          variant: "destructive",
        });
      };
      
      recognition.onend = () => {
        setIsListening(false);
        setIsRecording(false);
      };
      
        recognitionRef.current = recognition;
      }
    }
  }, [playSound, toast]);

  // Fetch chat history when sessionId changes
  const { data: messages = [], refetch: refetchHistory } = useQuery({
    queryKey: ["/api/chat", sessionId, "history"],
    queryFn: async () => {
      if (!sessionId) return [];
      
      // First try to load from localStorage
      const localMessages = loadLocalMessages(sessionId);
      
      try {
        // Then fetch from server and merge if available
        const response = await fetch(`/api/chat/${sessionId}/history`);
        if (!response.ok) {
          // If server fails, return local messages
          return localMessages;
        }
        const result = await response.json();
        const serverMessages = result.data as ChatMessage[];
        
        // Return server messages if available, otherwise local
        return serverMessages.length > 0 ? serverMessages : localMessages;
      } catch (error) {
        // If server is unavailable, return local messages
        return localMessages;
      }
    },
    enabled: !!sessionId
  });

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (sessionId && messages.length > 0) {
      localStorage.setItem(`neurapeace-chat-${sessionId}`, JSON.stringify(messages));
    }
  }, [messages, sessionId]);

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", { message, sessionId });
      const result = await response.json();
      return result.data as ChatResponse;
    },
    onSuccess: (data) => {
      setSessionId(data.session_id);
      setInputValue("");
      playSound('receive');
      
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
      playSound('error');
      toast({
        title: "Chat Error",
        description: "Failed to connect to NeuraGuide",
        variant: "destructive",
      });
    }
  });

  // Voice recording functions
  const startVoiceRecording = async () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Request microphone permission and immediately stop the stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      
      setIsRecording(true);
      recognitionRef.current.start();
    } catch (error) {
      toast({
        title: "Microphone Permission Denied",
        description: "Please enable microphone access to use voice input.",
        variant: "destructive",
      });
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  // Todo management functions
  const addTodo = () => {
    if (!newTodo.trim()) return;
    
    const todo: TodoItem = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      created_at: new Date()
    };
    
    setTodos(prev => [...prev, todo]);
    setNewTodo("");
    playSound('click');
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
    playSound('click');
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    playSound('click');
  };

  // Clear chat history
  const clearChatHistory = () => {
    if (sessionId) {
      localStorage.removeItem(`neurapeace-chat-${sessionId}`);
    }
    localStorage.removeItem('neurapeace-session-id');
    setSessionId(null);
    playSound('click');
    toast({
      title: "Chat History Cleared",
      description: "Starting fresh conversation with NeuraGuide",
    });
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    playSound('send');
    sendMessageMutation.mutate(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTodoKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTodo();
    }
  };

  return (
    <Card className="cosmic-bg border-purple-500/30 backdrop-blur-sm">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-purple-500/20">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <CardTitle className="text-white flex items-center gap-2">
              NeuraGuide AI Assistant
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTodos(!showTodos)}
              className="text-purple-300 border-purple-500/50 hover:bg-purple-500/20"
              data-testid="button-toggle-todos"
            >
              <ListTodo className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearChatHistory}
              className="text-red-300 border-red-500/50 hover:bg-red-500/20"
              data-testid="button-clear-chat"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-purple-200 text-sm">
          Ask me about consciousness expansion, sacred geometry, neural patterns, and spiritual awakening
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Todo List */}
        {showTodos && (
          <Card className="bg-purple-900/20 border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-purple-400" />
                Consciousness Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyDown={handleTodoKeyDown}
                  placeholder="Add a spiritual task or reminder..."
                  className="flex-1 bg-purple-900/20 border-purple-500/50 text-white placeholder:text-purple-300"
                  data-testid="input-new-todo"
                />
                <Button
                  onClick={addTodo}
                  disabled={!newTodo.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  data-testid="button-add-todo"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`flex items-center gap-3 p-2 rounded-lg bg-purple-800/20 border border-purple-500/30 ${
                      todo.completed ? 'opacity-60' : ''
                    }`}
                    data-testid={`todo-item-${todo.id}`}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTodo(todo.id)}
                      className={`w-6 h-6 p-0 rounded-full ${
                        todo.completed
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                      }`}
                      data-testid={`button-toggle-todo-${todo.id}`}
                    >
                      <Check className={`w-3 h-3 ${todo.completed ? 'opacity-100' : 'opacity-30'}`} />
                    </Button>
                    <span
                      className={`flex-1 text-sm ${
                        todo.completed
                          ? 'text-purple-300 line-through'
                          : 'text-white'
                      }`}
                    >
                      {todo.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                      className="w-6 h-6 p-0 text-red-400 hover:bg-red-500/20"
                      data-testid={`button-delete-todo-${todo.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                {todos.length === 0 && (
                  <p className="text-purple-400 text-sm text-center py-4">
                    No consciousness tasks yet. Add one above to begin your journey.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

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
              {messages.map((message: ChatMessage, index: number) => (
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
              {/* Enhanced Loading Animation */}
              {sendMessageMutation.isPending && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-blue-600/30 text-blue-100 border border-blue-500/50">
                    <div className="flex items-center gap-3" data-testid="ai-thinking-indicator">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-blue-400 animate-pulse" />
                        <span className="text-sm text-blue-200 animate-pulse">
                          NeuraGuide is channeling cosmic consciousness...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Chat Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening..." : "Ask about consciousness, neural patterns, sacred geometry..."}
              className={`w-full bg-purple-900/20 border-purple-500/50 text-white placeholder:text-purple-300 pr-12 ${
                isListening ? 'ring-2 ring-purple-400' : ''
              }`}
              data-testid="input-chat-message"
            />
            <Button
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              disabled={sendMessageMutation.isPending}
              className={`absolute right-1 top-1 h-8 w-8 p-0 transition-colors ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                  : 'bg-purple-600/80 hover:bg-purple-700 text-white'
              }`}
              data-testid="button-voice-input"
            >
              {isRecording ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>
          </div>
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