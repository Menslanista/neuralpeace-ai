# NeuraPeace AI - Soul Awakening Platform

## Overview

NeuraPeace AI is a consciousness expansion platform that combines sacred geometry, cosmic frequencies, and neuroscience to deliver transformative spiritual experiences. The application generates personalized meditation sessions, affirmations, soundscapes, and neural patterns through AI-powered algorithms. Built as a full-stack TypeScript application, it features a React frontend with modern UI components and an Express.js backend with RESTful APIs for consciousness awakening content generation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript in SPA (Single Page Application) mode
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom cosmic/spiritual theming and CSS variables
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack React Query for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints focused on consciousness expansion features
- **Request Handling**: JSON-based request/response with middleware for logging and error handling
- **Development Mode**: Vite integration for hot reloading and development experience

### Data Storage Solutions
- **Database**: PostgreSQL as the primary database with Neon Database serverless provider
- **ORM**: Drizzle ORM for type-safe database operations with full schema alignment
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Storage Implementation**: **DatabaseStorage** - Fully converted from Map-based MemStorage to PostgreSQL operations
- **Data Integrity**: All storage methods aligned with database schema fields and properly typed

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **User System**: Basic user registration and authentication scaffolding
- **Security**: Environment-based configuration for sensitive data

### External Service Integrations
- **AI Content Generation**: OpenAI API integration for generating spiritual content
  - Sacred geometry meditation patterns
  - Cosmic consciousness affirmations  
  - Galactic soundscape synthesis
  - Neural pathway activation sequences
- **Audio Processing**: Web Audio API for real-time frequency generation and binaural beats
- **Fonts**: Google Fonts integration (Inter, Orbitron, DM Sans, Fira Code, Geist Mono)

### Core Features Architecture
1. **Sacred Geometry Generator**: Creates meditation patterns with specific frequencies and geometric sequences
2. **Cosmic Affirmation Engine**: Generates personalized affirmations based on vibrational frequencies
3. **Galactic Soundscape Synthesizer**: Produces audio experiences with specific frequency combinations
4. **Neural Pattern Visualizer**: Creates brain wave patterns and activation sequences
5. **Heart Galaxy Connector**: Simulates biometric synchronization with cosmic coordinates

### Development and Deployment
- **Development**: Hot reloading with Vite, TypeScript checking, and real-time error overlay
- **Build Process**: Vite builds the frontend, esbuild bundles the backend
- **Environment**: Replit-optimized with special plugins for development experience
- **Monitoring**: Request logging middleware with response time tracking

## External Dependencies

### Core Runtime Dependencies
- **Database**: `@neondatabase/serverless` for PostgreSQL connectivity
- **ORM**: `drizzle-orm` and `drizzle-zod` for database operations and validation
- **Frontend**: React ecosystem with `@tanstack/react-query` for data fetching
- **UI Framework**: Complete Radix UI component suite with `class-variance-authority` for styling
- **Form Handling**: `react-hook-form` with `@hookform/resolvers` for validation
- **Utilities**: `date-fns` for date manipulation, `clsx` and `tailwind-merge` for styling

### Development Tools
- **Build Tools**: Vite with React plugin and TypeScript support
- **Replit Integration**: Custom Vite plugins for development experience and error handling
- **Code Quality**: TypeScript for type safety, ESLint configuration implied

### External APIs
- **OpenAI**: For AI-powered content generation across all spiritual features
- **Web Audio API**: Browser-native audio synthesis for soundscapes and frequencies
- **Google Fonts**: CDN-hosted font families for typography