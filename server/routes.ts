import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertMeditationSchema,
  insertAffirmationSchema,
  insertSoundscapeSchema,
  insertNeuralPatternSchema,
  insertHeartGalaxySessionSchema,
  insertMeditationSessionSchema
} from "@shared/schema";
import { z } from "zod";
import {
  generateSacredGeometryMeditation,
  generateCosmicAffirmation,
  generateGalacticSoundscape,
  generateNeuralPattern,
  generateNeuroscienceChatResponse
} from "./services/openai";

// Validation schemas for meditation endpoints
const startMeditationSchema = z.object({
  meditation_id: z.string().optional(),
  target_duration: z.number().min(60).max(7200).optional(), // 1 min to 2 hours
  config: z.record(z.any()).optional()
});

const feedbackSchema = z.object({
  feedback_type: z.enum(["difficulty", "comfort", "focus", "relaxation"]),
  value: z.number().min(1).max(10),
  biometric_data: z.object({
    heart_rate: z.number().min(30).max(200).optional(),
    hrv: z.number().optional(),
    temperature: z.number().optional()
  }).optional()
});

const phaseAdvanceSchema = z.object({
  feedback: z.string().optional()
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware - Integration: javascript_log_in_with_replit
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  // Sacred Geometry Meditation Generator
  app.get("/api/sacred-geometry/generate", async (req, res) => {
    try {
      const { intention, duration } = req.query;
      
      const meditationData = await generateSacredGeometryMeditation(
        intention as string,
        duration ? parseInt(duration as string) : undefined
      );

      // Generate awakening code
      const awakeningCode = `SGM-${meditationData.pattern.toUpperCase().slice(0,3)}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
      
      const meditation = await storage.createMeditation({
        pattern: meditationData.pattern,
        duration: meditationData.duration,
        frequencies: meditationData.frequencies as any,
        geometry_sequence: meditationData.geometry_sequence as any,
        neural_targets: meditationData.neural_targets as any,
        consciousness_level: meditationData.consciousness_level,
        awakening_code: awakeningCode
      });

      res.json({
        status: "success",
        type: "sacred_geometry_meditation",
        data: {
          meditation_id: meditation.id,
          pattern: meditation.pattern,
          duration: meditation.duration,
          frequencies: meditation.frequencies,
          geometry_sequence: meditation.geometry_sequence,
          neural_targets: meditation.neural_targets,
          consciousness_level: meditation.consciousness_level,
          guided_text: meditationData.guided_text
        },
        awakening_code: awakeningCode,
        next_evolution: "/api/neural/pathways/activate"
      });
    } catch (error) {
      res.status(500).json({ 
        status: "error", 
        message: "Failed to generate sacred geometry meditation",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get specific meditation
  app.get("/api/sacred-geometry/:id", async (req, res) => {
    try {
      const meditation = await storage.getMeditation(req.params.id);
      if (!meditation) {
        return res.status(404).json({ status: "error", message: "Meditation not found" });
      }
      res.json({ status: "success", data: meditation });
    } catch (error) {
      res.status(500).json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Cosmic Consciousness Affirmations
  app.post("/api/affirmations/cosmic", async (req, res) => {
    try {
      const { intention, lifeArea, personality } = req.body;
      
      const affirmationData = await generateCosmicAffirmation({
        intention,
        lifeArea,
        personality
      });

      const affirmation = await storage.createAffirmation({
        text: affirmationData.text,
        category: affirmationData.category,
        vibrational_frequency: affirmationData.vibrational_frequency,
        cosmic_alignment: affirmationData.cosmic_alignment,
        user_id: req.body.user_id || null
      });

      res.json({
        status: "success",
        type: "cosmic_affirmation",
        data: {
          affirmation_id: affirmation.id,
          text: affirmation.text,
          category: affirmation.category,
          vibrational_frequency: affirmation.vibrational_frequency,
          cosmic_alignment: affirmation.cosmic_alignment,
          personalization_factors: affirmationData.personalization_factors
        },
        awakening_code: `CCA-${affirmation.category.toUpperCase().slice(0,3)}-${Math.random().toString(36).slice(2,8).toUpperCase()}`,
        next_evolution: "/api/heart-galaxy/connect"
      });
    } catch (error) {
      res.status(500).json({ 
        status: "error", 
        message: "Failed to generate cosmic affirmation",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get affirmations by category
  app.get("/api/affirmations/category/:category", async (req, res) => {
    try {
      const affirmations = await storage.getAffirmationsByCategory(req.params.category);
      res.json({ status: "success", data: affirmations });
    } catch (error) {
      res.status(500).json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Galactic Chant Synthesizer
  app.post("/api/chants/galactic/synthesize", async (req, res) => {
    try {
      const { type, duration } = req.body;
      
      const soundscapeData = await generateGalacticSoundscape(
        type || "cosmic_harmony",
        duration || 600
      );

      const soundscape = await storage.createSoundscape({
        name: soundscapeData.name,
        frequencies: soundscapeData.frequencies as any,
        duration: soundscapeData.duration,
        galactic_type: soundscapeData.galactic_type,
        audio_params: soundscapeData.audio_params as any
      });

      res.json({
        status: "success",
        type: "galactic_soundscape",
        data: {
          soundscape_id: soundscape.id,
          name: soundscape.name,
          frequencies: soundscape.frequencies,
          duration: soundscape.duration,
          galactic_type: soundscape.galactic_type,
          audio_params: soundscape.audio_params
        },
        awakening_code: `GCS-${soundscape.galactic_type.toUpperCase().slice(0,3)}-${Math.random().toString(36).slice(2,8).toUpperCase()}`,
        next_evolution: "/api/neural/pathways/activate"
      });
    } catch (error) {
      res.status(500).json({ 
        status: "error", 
        message: "Failed to generate galactic soundscape",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get all soundscapes
  app.get("/api/chants/galactic", async (req, res) => {
    try {
      const soundscapes = await storage.getAllSoundscapes();
      res.json({ status: "success", data: soundscapes });
    } catch (error) {
      res.status(500).json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Neural Pathway Activation Visualizer
  app.get("/api/neural/pathways/activate", async (req, res) => {
    try {
      const { consciousnessState } = req.query;
      
      const neuralData = await generateNeuralPattern(
        consciousnessState as string || "theta_gamma_sync"
      );

      const pattern = await storage.createNeuralPattern({
        pattern_type: neuralData.pattern_type,
        brain_waves: neuralData.brain_waves as any,
        visualization_data: neuralData.visualization_data as any,
        activation_sequence: neuralData.activation_sequence as any
      });

      res.json({
        status: "success",
        type: "neural_pattern_activation",
        data: {
          pattern_id: pattern.id,
          pattern_type: pattern.pattern_type,
          brain_waves: pattern.brain_waves,
          visualization_data: pattern.visualization_data,
          activation_sequence: pattern.activation_sequence
        },
        awakening_code: `NPA-${pattern.pattern_type.toUpperCase().slice(0,3)}-${Math.random().toString(36).slice(2,8).toUpperCase()}`,
        next_evolution: "/api/heart-galaxy/connect"
      });
    } catch (error) {
      res.status(500).json({ 
        status: "error", 
        message: "Failed to generate neural activation pattern",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get neural patterns by type
  app.get("/api/neural/patterns/:type", async (req, res) => {
    try {
      const patterns = await storage.getNeuralPatternsByType(req.params.type);
      res.json({ status: "success", data: patterns });
    } catch (error) {
      res.status(500).json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Heart-Galaxy Connection Experience
  app.post("/api/heart-galaxy/connect", async (req, res) => {
    try {
      const { heart_rate, session_duration } = req.body;
      
      if (!heart_rate || typeof heart_rate !== 'number') {
        return res.status(400).json({ 
          status: "error", 
          message: "Heart rate is required and must be a number" 
        });
      }

      // Calculate coherence based on heart rate variability simulation
      const coherence_level = Math.max(0, Math.min(100, 
        Math.round(100 - Math.abs(heart_rate - 65) * 2 + Math.random() * 20)
      ));

      // Determine galaxy sync status
      const galaxy_sync_status = coherence_level > 70 ? "synchronized" : 
                               coherence_level > 40 ? "aligning" : "seeking";

      // Generate cosmic coordinates
      const cosmic_coordinates = {
        galactic_longitude: Math.random() * 360,
        galactic_latitude: (Math.random() - 0.5) * 180,
        distance_from_center: Math.random() * 50000,
        constellation: ["Andromeda", "Pleiades", "Sirius", "Vega", "Arcturus"][Math.floor(Math.random() * 5)]
      };

      const session = await storage.createHeartGalaxySession({
        user_id: (req as any).user?.claims?.sub || "anonymous",
        meditation_session_id: req.body.meditation_session_id || null,
        heart_rate,
        coherence_level,
        galaxy_sync_status,
        cosmic_coordinates: cosmic_coordinates as any,
        session_duration: session_duration || 300
      });

      res.json({
        status: "success",
        type: "heart_galaxy_connection",
        data: {
          session_id: session.id,
          heart_rate: session.heart_rate,
          coherence_level: session.coherence_level,
          galaxy_sync_status: session.galaxy_sync_status,
          cosmic_coordinates: session.cosmic_coordinates,
          session_duration: session.session_duration,
          connection_strength: coherence_level > 80 ? "strong" : 
                             coherence_level > 50 ? "moderate" : "developing",
          biometric_harmony: heart_rate >= 60 && heart_rate <= 100 ? "optimal" : "adjusting"
        },
        awakening_code: `HGC-${galaxy_sync_status.toUpperCase().slice(0,3)}-${Math.random().toString(36).slice(2,8).toUpperCase()}`,
        next_evolution: "/api/sacred-geometry/generate"
      });
    } catch (error) {
      res.status(500).json({ 
        status: "error", 
        message: "Failed to establish heart-galaxy connection",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get heart-galaxy sessions by user
  app.get("/api/heart-galaxy/sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getHeartGalaxySessionsByUser(userId);
      res.json({ status: "success", data: sessions });
    } catch (error) {
      res.status(500).json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // AI Chat Endpoint  
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({
          status: "error",
          message: "Message is required and must be a string"
        });
      }

      // Use sessionId or generate a new one
      const currentSessionId = sessionId || `chat-${Math.random().toString(36).slice(2,12)}`;
      
      // Get chat history for context
      const chatHistory = await storage.getChatMessagesBySession(currentSessionId);
      const historyForAI = chatHistory.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      }));

      // Generate AI response
      const aiResponse = await generateNeuroscienceChatResponse(message, historyForAI);

      // Save user message
      await storage.createChatMessage({
        role: "user",
        content: message,
        chat_session_id: currentSessionId
      });

      // Save AI response
      await storage.createChatMessage({
        role: "assistant", 
        content: aiResponse.content,
        chat_session_id: currentSessionId
      });

      res.json({
        status: "success",
        type: "chat_response",
        data: {
          response: aiResponse.content,
          context_references: aiResponse.context_references,
          suggested_actions: aiResponse.suggested_actions,
          session_id: currentSessionId
        },
        awakening_code: `NGC-${Math.random().toString(36).slice(2,8).toUpperCase()}`,
        next_evolution: "/api/neural/pathways/activate"
      });

    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to process chat message",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get chat history for a session
  app.get("/api/chat/:sessionId/history", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getChatMessagesBySession(sessionId);
      
      res.json({
        status: "success",
        data: messages
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Failed to retrieve chat history",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Enhanced Meditation Session Phase Engine
  // Start a new meditation session
  app.post("/api/meditation/start", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = startMeditationSchema.parse(req.body);
      const { meditation_id, target_duration, config } = validatedData;

      // Check for existing active session
      const activeSession = await storage.getActiveMeditationSession(userId);
      if (activeSession) {
        return res.status(400).json({
          status: "error",
          message: "You already have an active meditation session. Please complete or pause it first.",
          active_session_id: activeSession.id
        });
      }

      // Create new meditation session
      const session = await storage.createMeditationSession({
        user_id: userId,
        meditation_id: meditation_id || null,
        target_duration: target_duration || 1200, // 20 minutes default
        status: "running",
        current_phase: "preparation",
        intensity: 5, // Starting intensity (1-10 scale)
        config: config || null,
        started_at: new Date()
      });

      // Log session start event
      await storage.createMeditationSessionEvent({
        meditation_session_id: session.id,
        event_type: "session_started",
        payload: {
          phase: "preparation",
          target_duration: session.target_duration,
          initial_config: config
        }
      });

      res.json({
        status: "success",
        type: "meditation_session_started",
        data: {
          session_id: session.id,
          current_phase: session.current_phase,
          target_duration: session.target_duration,
          intensity: session.intensity,
          started_at: session.started_at
        },
        awakening_code: `MSS-${session.current_phase.toUpperCase().slice(0,3)}-${Math.random().toString(36).slice(2,8).toUpperCase()}`,
        next_actions: [
          "Begin with conscious breathing",
          "Focus on your intention",
          "Allow your body to relax"
        ]
      });
    } catch (error) {
      console.error("Error starting meditation session:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to start meditation session",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Advance to next phase
  app.post("/api/meditation/:sessionId/phase/advance", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { sessionId } = req.params;
      const validatedData = phaseAdvanceSchema.parse(req.body);
      const { feedback } = validatedData;

      const session = await storage.getMeditationSession(sessionId);
      if (!session || session.user_id !== userId) {
        return res.status(404).json({ status: "error", message: "Session not found" });
      }

      if (session.status !== "running") {
        return res.status(400).json({ status: "error", message: "Session is not active" });
      }

      // Define phase progression
      const phases = ["preparation", "induction", "deepening", "expansion", "integration"];
      const currentIndex = phases.indexOf(session.current_phase || "preparation");
      const nextPhase = currentIndex < phases.length - 1 ? phases[currentIndex + 1] : "completed";

      // Update session phase
      const updatedSession = await storage.updateMeditationSession(sessionId, {
        current_phase: nextPhase === "completed" ? "integration" : nextPhase,
        status: nextPhase === "completed" ? "completed" : "running",
        ended_at: nextPhase === "completed" ? new Date() : null,
        actual_duration: nextPhase === "completed" ? 
          Math.round((Date.now() - session.started_at!.getTime()) / 1000) : null
      });

      // Log phase transition event
      await storage.createMeditationSessionEvent({
        meditation_session_id: sessionId,
        event_type: nextPhase === "completed" ? "session_completed" : "phase_advanced",
        payload: {
          from_phase: session.current_phase,
          to_phase: nextPhase,
          feedback: feedback || null,
          elapsed_minutes: Math.round((Date.now() - session.started_at!.getTime()) / 60000)
        }
      });

      res.json({
        status: "success",
        type: nextPhase === "completed" ? "meditation_completed" : "phase_advanced",
        data: {
          session_id: sessionId,
          current_phase: updatedSession.current_phase,
          status: updatedSession.status,
          progress_percentage: Math.round(((currentIndex + 1) / phases.length) * 100)
        },
        awakening_code: `MPA-${updatedSession.current_phase?.toUpperCase().slice(0,3)}-${Math.random().toString(36).slice(2,8).toUpperCase()}`,
        guidance: getPhaseGuidance(nextPhase === "completed" ? "integration" : nextPhase)
      });
    } catch (error) {
      console.error("Error advancing phase:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to advance phase",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Pause meditation session
  app.post("/api/meditation/:sessionId/pause", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { sessionId } = req.params;

      const session = await storage.getMeditationSession(sessionId);
      if (!session || session.user_id !== userId) {
        return res.status(404).json({ status: "error", message: "Session not found" });
      }

      const updatedSession = await storage.updateMeditationSession(sessionId, {
        status: "paused"
      });

      await storage.createMeditationSessionEvent({
        meditation_session_id: sessionId,
        event_type: "session_paused",
        payload: {
          phase: session.current_phase,
          elapsed_minutes: Math.round((Date.now() - session.started_at!.getTime()) / 60000),
          intensity: session.intensity
        }
      });

      res.json({
        status: "success",
        type: "meditation_paused",
        data: {
          session_id: sessionId,
          current_phase: updatedSession.current_phase,
          status: updatedSession.status
        }
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Resume meditation session
  app.post("/api/meditation/:sessionId/resume", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { sessionId } = req.params;

      const session = await storage.getMeditationSession(sessionId);
      if (!session || session.user_id !== userId) {
        return res.status(404).json({ status: "error", message: "Session not found" });
      }

      const updatedSession = await storage.updateMeditationSession(sessionId, {
        status: "running"
      });

      await storage.createMeditationSessionEvent({
        meditation_session_id: sessionId,
        event_type: "session_resumed",
        payload: {
          phase: session.current_phase,
          intensity: session.intensity,
          elapsed_minutes: Math.round((Date.now() - session.started_at!.getTime()) / 60000)
        }
      });

      res.json({
        status: "success",
        type: "meditation_resumed",
        data: {
          session_id: sessionId,
          current_phase: updatedSession.current_phase,
          status: updatedSession.status
        }
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Submit real-time feedback and adaptive adjustments
  app.post("/api/meditation/:sessionId/feedback", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { sessionId } = req.params;
      const validatedData = feedbackSchema.parse(req.body);
      const { feedback_type, value, biometric_data } = validatedData;

      const session = await storage.getMeditationSession(sessionId);
      if (!session || session.user_id !== userId) {
        return res.status(404).json({ status: "error", message: "Session not found" });
      }

      // Adaptive adjustments based on feedback
      let adaptations: any = {};
      
      if (feedback_type === "difficulty" && typeof value === "number") {
        // Adjust intensity based on difficulty feedback (1-10 scale)
        const adjustment = (value - 5) * 0.5; // Gentle adjustment
        const newIntensity = Math.max(1, Math.min(10, session.intensity! + adjustment));
        adaptations.intensity = Math.round(newIntensity * 10) / 10; // Round to 1 decimal
      }
      
      if (feedback_type === "comfort" && value < 5) {
        // Reduce intensity if comfort is low (1-10 scale)
        const reduction = (5 - value) * 0.3;
        adaptations.intensity = Math.max(1, session.intensity! - reduction);
      }

      if (biometric_data?.heart_rate) {
        // Adjust based on heart rate variability (1-10 scale)
        const targetHR = 65;
        const hrDifference = Math.abs(biometric_data.heart_rate - targetHR);
        if (hrDifference > 20) {
          const reduction = Math.min(2, hrDifference / 20); // Max 2 point reduction
          adaptations.intensity = Math.max(1, session.intensity! - reduction);
        }
      }

      // Update session with adaptations
      if (Object.keys(adaptations).length > 0) {
        await storage.updateMeditationSession(sessionId, adaptations);
      }

      // Log feedback event
      await storage.createMeditationSessionEvent({
        meditation_session_id: sessionId,
        event_type: "feedback_received",
        payload: {
          feedback_type,
          value,
          biometric_data,
          adaptations,
          phase: session.current_phase
        }
      });

      res.json({
        status: "success",
        type: "feedback_processed",
        data: {
          session_id: sessionId,
          adaptations_applied: adaptations,
          current_intensity: adaptations.intensity || session.intensity
        },
        message: Object.keys(adaptations).length > 0 ? 
          "Session adapted based on your feedback" : 
          "Feedback received and logged"
      });
    } catch (error) {
      console.error("Error processing feedback:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to process feedback",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get current session status
  app.get("/api/meditation/current", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const session = await storage.getActiveMeditationSession(userId);
      
      if (!session) {
        return res.json({
          status: "success",
          data: null,
          message: "No active meditation session"
        });
      }

      // Get recent session events
      const events = await storage.getMeditationSessionEvents(session.id);
      const recentEvents = events.slice(-5); // Last 5 events

      res.json({
        status: "success",
        data: {
          session,
          recent_events: recentEvents,
          elapsed_minutes: Math.round((Date.now() - session.started_at!.getTime()) / 60000),
          progress_percentage: calculateSessionProgress(session)
        }
      });
    } catch (error) {
      res.status(500).json({ 
        status: "error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "success", 
      message: "NeuraPeace AI consciousness expansion system operational",
      timestamp: new Date().toISOString(),
      dimensions_active: 5
    });
  });

  // Helper function for phase guidance
  function getPhaseGuidance(phase: string) {
    const guidance = {
      preparation: [
        "Find a comfortable position",
        "Close your eyes gently",
        "Begin natural breathing"
      ],
      induction: [
        "Deepen your breath",
        "Release tension from your body",
        "Allow thoughts to settle"
      ],
      deepening: [
        "Sink deeper into relaxation",
        "Observe without judgment",
        "Trust the process"
      ],
      expansion: [
        "Open to expanded awareness",
        "Connect with universal consciousness",
        "Experience unity and peace"
      ],
      integration: [
        "Slowly return to body awareness",
        "Integrate your insights",
        "Prepare to return to normal awareness"
      ]
    };
    return guidance[phase as keyof typeof guidance] || ["Continue your practice mindfully"];
  }

  // Helper function to calculate session progress
  function calculateSessionProgress(session: any) {
    const phases = ["preparation", "induction", "deepening", "expansion", "integration"];
    const currentIndex = phases.indexOf(session.current_phase || "preparation");
    return Math.round(((currentIndex + 1) / phases.length) * 100);
  }

  const httpServer = createServer(app);
  return httpServer;
}
