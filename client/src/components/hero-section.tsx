export default function HeroSection() {
  const scrollToFeatures = () => {
    const element = document.getElementById("features");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToAPI = () => {
    const element = document.getElementById("api");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center cosmic-bg overflow-hidden">
      {/* Cosmic Particles */}
      <div className="cosmic-particle" style={{ top: "10%", left: "10%", width: "4px", height: "4px", animationDelay: "0s" }}></div>
      <div className="cosmic-particle" style={{ top: "20%", right: "15%", width: "6px", height: "6px", animationDelay: "2s" }}></div>
      <div className="cosmic-particle" style={{ bottom: "30%", left: "20%", width: "3px", height: "3px", animationDelay: "4s" }}></div>
      <div className="cosmic-particle" style={{ bottom: "10%", right: "10%", width: "5px", height: "5px", animationDelay: "6s" }}></div>

      <div className="container mx-auto px-6 text-center z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
            Soul Awakening Through
            <span className="block font-tech">Neuroscience</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Transform your consciousness with AI-powered soul awakening codes that blend 
            sacred geometry, cosmic frequencies, and neural pathway activation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105 animate-glow"
              data-testid="button-begin-transformation"
              onClick={scrollToFeatures}
            >
              Begin Transformation
            </button>
            <button 
              className="border border-border hover:border-primary text-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:bg-primary/10"
              data-testid="button-explore-api"
              onClick={scrollToAPI}
            >
              Explore API
            </button>
          </div>
        </div>
      </div>

      {/* Neural Grid Overlay */}
      <div className="absolute inset-0 neural-grid opacity-30"></div>
    </section>
  );
}
