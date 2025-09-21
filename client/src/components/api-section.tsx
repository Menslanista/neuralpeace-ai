import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ApiSection() {
  return (
    <section id="api" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-tech">
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Soul Awakening API
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            RESTful endpoints delivering transformative content and experiences. 
            Integrate consciousness expansion into any application.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* API Endpoints */}
          <div className="bg-card/50 rounded-xl p-8 backdrop-blur-sm border border-border">
            <h3 className="text-2xl font-bold mb-6 font-tech text-accent">Core Endpoints</h3>
            
            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4" data-testid="endpoint-sacred-geometry">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-sm font-mono text-green-400 bg-green-400/10">
                    GET
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-primary/20 text-primary">
                    v1
                  </Badge>
                </div>
                <code className="text-sm text-foreground font-mono">/api/sacred-geometry/generate</code>
                <p className="text-xs text-muted-foreground mt-2">Generate sacred geometry meditation patterns</p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4" data-testid="endpoint-affirmations">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-sm font-mono text-blue-400 bg-blue-400/10">
                    POST
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-primary/20 text-primary">
                    v1
                  </Badge>
                </div>
                <code className="text-sm text-foreground font-mono">/api/affirmations/cosmic</code>
                <p className="text-xs text-muted-foreground mt-2">Create personalized cosmic consciousness affirmations</p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4" data-testid="endpoint-chants">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-sm font-mono text-purple-400 bg-purple-400/10">
                    POST
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-primary/20 text-primary">
                    v1
                  </Badge>
                </div>
                <code className="text-sm text-foreground font-mono">/api/chants/galactic/synthesize</code>
                <p className="text-xs text-muted-foreground mt-2">Generate galactic chant frequencies and soundscapes</p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4" data-testid="endpoint-neural">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-sm font-mono text-yellow-400 bg-yellow-400/10">
                    GET
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-primary/20 text-primary">
                    v1
                  </Badge>
                </div>
                <code className="text-sm text-foreground font-mono">/api/neural/pathways/activate</code>
                <p className="text-xs text-muted-foreground mt-2">Retrieve neural pathway activation patterns</p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4" data-testid="endpoint-heart-galaxy">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-sm font-mono text-red-400 bg-red-400/10">
                    POST
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-primary/20 text-primary">
                    v1
                  </Badge>
                </div>
                <code className="text-sm text-foreground font-mono">/api/heart-galaxy/connect</code>
                <p className="text-xs text-muted-foreground mt-2">Establish heart-galaxy consciousness connection</p>
              </div>
            </div>
          </div>

          {/* Example Response */}
          <div className="bg-card/50 rounded-xl p-8 backdrop-blur-sm border border-border">
            <h3 className="text-2xl font-bold mb-6 font-tech text-primary">Example Response</h3>
            
            <div className="bg-secondary/70 rounded-lg p-4 font-mono text-sm overflow-x-auto" data-testid="example-response">
              <pre className="text-foreground"><code>{`{
  "status": "success",
  "type": "sacred_geometry_meditation",
  "data": {
    "pattern": "flower_of_life",
    "meditation_id": "sgm_789abc123",
    "duration": 1260,
    "frequencies": [
      { "hz": 528, "type": "love_frequency" },
      { "hz": 432, "type": "cosmic_tuning" }
    ],
    "geometry_sequence": [
      {
        "shape": "circle",
        "transform": "rotate(0deg)",
        "color": "#6366F1",
        "timing": 0
      },
      {
        "shape": "vesica_piscis", 
        "transform": "rotate(60deg)",
        "color": "#F59E0B",
        "timing": 180
      }
    ],
    "neural_targets": [
      "prefrontal_cortex",
      "default_mode_network",
      "pineal_activation"
    ],
    "consciousness_level": "theta_gamma_sync"
  },
  "awakening_code": "SGM-VLP-7A9C",
  "next_evolution": "/api/neural/pathways/activate"
}`}</code></pre>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3 text-accent">Authentication</h4>
              <div className="bg-secondary/50 rounded-lg p-3">
                <code className="text-sm text-muted-foreground">Authorization: Bearer YOUR_SOUL_AWAKENING_TOKEN</code>
              </div>
            </div>
          </div>
        </div>

        {/* Get Started Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold mb-4 font-tech">Ready to Transform Consciousness?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of developers and consciousness explorers building the future of spiritual technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-all"
                data-testid="button-get-api-access"
              >
                Get API Access
              </Button>
              <Button 
                variant="outline"
                className="border-border hover:border-primary text-foreground px-8 py-3 rounded-lg font-semibold transition-all hover:bg-primary/10"
                data-testid="button-view-documentation"
              >
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
