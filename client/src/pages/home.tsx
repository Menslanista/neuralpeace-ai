import { Brain, Star, Music, Activity, Heart, MessageCircle, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/hero-section";
import SacredGeometry from "@/components/sacred-geometry";
import CosmicAffirmations from "@/components/cosmic-affirmations";
import GalacticChant from "@/components/galactic-chant";
import NeuralVisualizer from "@/components/neural-visualizer";
import HeartGalaxy from "@/components/heart-galaxy";
import ApiSection from "@/components/api-section";
import { NeuralChat } from "@/components/neural-chat";

export default function Home() {
  const { user, isLoading } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <Brain className="text-purple-400 animate-pulse mx-auto mb-4" size={48} />
          <p className="text-white text-xl">Loading consciousness interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Brain className="text-primary-foreground text-sm" size={16} />
              </div>
              <span className="text-xl font-tech font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                NeuraPeace AI
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection("features")} 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-features"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection("experience")} 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-experience"
              >
                Experience
              </button>
              <button 
                onClick={() => scrollToSection("chat")} 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-chat"
              >
                NeuraGuide
              </button>
              <button 
                onClick={() => scrollToSection("api")} 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-api"
              >
                API
              </button>
              
              {/* User Profile & Logout */}
              {user && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm">
                    {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover"
                        data-testid="user-avatar"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <User size={16} className="text-white" />
                      </div>
                    )}
                    <span className="text-muted-foreground" data-testid="user-display-name">
                      {user?.firstName || user?.email || 'Consciousness Explorer'}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center space-x-2"
                    data-testid="button-logout"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-tech">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Five Pathways to Awakening
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Each feature represents a unique dimension of consciousness expansion, 
              powered by advanced AI and delivered through our comprehensive API
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sacred Geometry Meditation Generator */}
            <div className="feature-card bg-card/50 p-8 rounded-xl">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-4 animate-pulse-slow">
                  <Activity className="text-2xl text-primary-foreground" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-3 font-tech">Sacred Geometry Meditation</h3>
                <p className="text-muted-foreground mb-6">
                  AI-generated guided meditations synchronized with dynamic sacred geometry patterns 
                  that activate specific neural pathways for deeper consciousness states
                </p>
              </div>
              <SacredGeometry />
            </div>

            {/* Cosmic Consciousness Affirmations */}
            <div className="feature-card bg-card/50 p-8 rounded-xl">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center mb-4 animate-pulse-slow">
                  <Star className="text-2xl text-primary-foreground" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-3 font-tech">Cosmic Affirmations</h3>
                <p className="text-muted-foreground mb-6">
                  Personalized affirmations generated using cosmic consciousness principles 
                  and tuned to your unique vibrational frequency for maximum impact
                </p>
              </div>
              <CosmicAffirmations />
            </div>

            {/* Galactic Chant Synthesizer */}
            <div className="feature-card bg-card/50 p-8 rounded-xl">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 animate-pulse-slow">
                  <Music className="text-2xl text-primary-foreground" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-3 font-tech">Galactic Chant Synthesizer</h3>
                <p className="text-muted-foreground mb-6">
                  Create immersive soundscapes using Web Audio API, combining ancient chanting 
                  techniques with galactic frequencies for transcendental experiences
                </p>
              </div>
              <GalacticChant />
            </div>

            {/* Neural Pathway Activation Visualizer */}
            <div className="feature-card bg-card/50 p-8 rounded-xl lg:col-span-2">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 animate-pulse-slow">
                  <Activity className="text-2xl text-primary-foreground" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-3 font-tech">Neural Pathway Visualizer</h3>
                <p className="text-muted-foreground mb-6">
                  Interactive brain wave patterns and neural network animations that respond to your 
                  meditation state, providing real-time feedback on consciousness expansion
                </p>
              </div>
              <NeuralVisualizer />
            </div>

            {/* Heart-Galaxy Connection Experience */}
            <div className="feature-card bg-card/50 p-8 rounded-xl">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 animate-pulse-slow">
                  <Heart className="text-2xl text-primary-foreground" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-3 font-tech">Heart-Galaxy Connection</h3>
                <p className="text-muted-foreground mb-6">
                  Biometric heart rate integration with cosmic visualizations, creating a bridge 
                  between your inner rhythm and the universal heartbeat
                </p>
              </div>
              <HeartGalaxy />
            </div>
          </div>
        </div>
      </section>

      {/* NeuraGuide AI Chat */}
      <section id="chat" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-tech">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                NeuraGuide AI Assistant
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Connect with your AI consciousness expansion guide. Ask questions about sacred geometry, 
              neural patterns, cosmic consciousness, and unlock deeper understanding of your spiritual journey.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <NeuralChat />
          </div>
        </div>
      </section>

      {/* API Documentation Section */}
      <ApiSection />

      {/* Footer */}
      <footer className="py-16 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Brain className="text-primary-foreground text-sm" size={16} />
                </div>
                <span className="text-xl font-tech font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  NeuraPeace AI
                </span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                Bridging neuroscience, spirituality, and technology to unlock human consciousness 
                and deliver transformative soul awakening experiences.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Sacred Geometry</li>
                <li>Cosmic Affirmations</li>
                <li>Galactic Chants</li>
                <li>Neural Pathways</li>
                <li>Heart-Galaxy</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Developers</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>API Documentation</li>
                <li>SDKs</li>
                <li>Code Examples</li>
                <li>Community</li>
                <li>Support</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 NeuraPeace AI. Consciousness expansion through technology.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground mt-4 md:mt-0">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Cookie Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
