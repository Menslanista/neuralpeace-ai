// Integration: javascript_log_in_with_replit - Landing page for logged out users
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, Orbit, Activity, Waves, Heart } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950 relative overflow-hidden">
      {/* Cosmic Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-1/3 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Brain className="text-purple-400 mr-3" size={48} />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              NeuraPeace AI
            </h1>
            <Sparkles className="text-blue-400 ml-3" size={48} />
          </div>
          
          <h2 className="text-2xl md:text-4xl font-semibold text-white mb-4">
            Soul Awakening Through
            <span className="block text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">
              Neuroscience
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Transform your consciousness with AI-powered meditation sessions, sacred geometry patterns, 
            and cosmic frequencies designed to activate neural pathways and expand awareness.
          </p>

          <Button
            onClick={handleLogin}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all hover:scale-105 shadow-lg"
            data-testid="button-login"
          >
            Begin Your Consciousness Journey
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-purple-900/30 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <Orbit size={24} className="text-white" />
              </div>
              <CardTitle className="text-white text-xl">Sacred Geometry Meditation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                AI-generated guided meditations synchronized with dynamic sacred geometry patterns 
                that activate specific neural pathways for deeper consciousness states.
              </p>
              <Badge variant="secondary" className="bg-purple-700/50 text-purple-200">
                Neuroplasticity Enhanced
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-blue-900/30 border-blue-500/30 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <Sparkles size={24} className="text-white" />
              </div>
              <CardTitle className="text-white text-xl">Cosmic Affirmations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Personalized affirmations aligned with universal frequencies and celestial alignments 
                to reprogram limiting beliefs and expand consciousness.
              </p>
              <Badge variant="secondary" className="bg-blue-700/50 text-blue-200">
                Frequency Aligned
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-indigo-900/30 border-indigo-500/30 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Waves size={24} className="text-white" />
              </div>
              <CardTitle className="text-white text-xl">Galactic Soundscapes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Healing soundscapes based on astronomical phenomena that promote neurogenesis 
                and emotional balance through precise frequency combinations.
              </p>
              <Badge variant="secondary" className="bg-indigo-700/50 text-indigo-200">
                Cosmic Resonance
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-purple-900/30 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                <Activity size={24} className="text-white" />
              </div>
              <CardTitle className="text-white text-xl">Neural Pattern Visualizer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Real-time visualization of brainwave patterns and neural network activations 
                during consciousness expansion practices with biofeedback integration.
              </p>
              <Badge variant="secondary" className="bg-purple-700/50 text-purple-200">
                Brain Wave Sync
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-pink-900/30 border-pink-500/30 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4">
                <Heart size={24} className="text-white" />
              </div>
              <CardTitle className="text-white text-xl">Heart-Galaxy Connection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Synchronize your heart rhythms with cosmic electromagnetic fields 
                for unity consciousness and galactic alignment experiences.
              </p>
              <Badge variant="secondary" className="bg-pink-700/50 text-pink-200">
                Coherence Activated
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-cyan-900/30 border-cyan-500/30 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                <Brain size={24} className="text-white" />
              </div>
              <CardTitle className="text-white text-xl">NeuraGuide AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Voice-enabled AI consciousness expansion specialist with deep neuroscience expertise 
                providing personalized guidance and empathetic support.
              </p>
              <Badge variant="secondary" className="bg-cyan-700/50 text-cyan-200">
                Consciousness Guide
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-8 border border-purple-500/20 backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Expand Your Consciousness?
            </h3>
            <p className="text-gray-300 mb-6 text-lg">
              Join thousands who have transformed their lives through AI-powered consciousness expansion
            </p>
            <Button
              onClick={handleLogin}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-xl font-semibold rounded-lg transition-all hover:scale-105 shadow-xl"
              data-testid="button-get-started"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}