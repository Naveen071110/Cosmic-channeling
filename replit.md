# Replit Development Guide

## Overview

This repository contains a full-stack cosmic channeling web application that combines spirituality, astronomy, and mindfulness into an engaging user experience. The application provides daily cosmic insights, meditation tools, celestial exploration, and interactive journal features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS with custom cosmic theming
- **UI Components**: Radix UI components with shadcn/ui design system
- **State Management**: TanStack Query for server state, React hooks for local state
- **Build Tool**: Vite with custom plugin configuration

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js REST API
- **Authentication**: Passport.js with local and Google OAuth strategies
- **Session Management**: Express sessions with PostgreSQL store option
- **Payment Processing**: PayPal SDK integration
- **Email Services**: SendGrid for newsletter functionality

### Data Storage
- **Primary Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with schema-first approach
- **Local Storage**: Browser localStorage for user preferences and journal entries
- **File Storage**: JSON files for simple data (subscribers list)

## Key Components

### 1. Authentication System
- Local username/password authentication with bcrypt hashing
- Google OAuth integration using Firebase Auth on frontend
- Session-based authentication with Express sessions
- Protected routes using React context and custom hooks

### 2. Cosmic Content Management
- **Daily Quotes**: Rotating cosmic and scientific quotes
- **Celestial Objects**: Database of planets, galaxies, nebulae with images and descriptions
- **Cosmic Patterns**: Random pattern generator for inspiration
- **Audio Meditation**: Cosmic sound library for meditation sessions

### 3. User Features
- **Astro-Journal**: Personal journaling with tagging system
- **Meditation Timer**: Customizable timer with ambient cosmic sounds
- **Universe Explorer**: Interactive celestial body browser
- **Spiritual Quiz**: Personality assessment based on cosmic preferences

### 4. Payment Integration
- PayPal subscription system for premium features
- Stripe integration prepared but primarily using PayPal
- User subscription status tracking in database

## Data Flow

1. **User Registration/Login**: 
   - Frontend authenticates via local form or Google OAuth
   - Backend validates credentials and creates session
   - User data stored in PostgreSQL with Drizzle ORM

2. **Content Delivery**:
   - Static cosmic content served from API endpoints
   - Dynamic content (quotes, patterns) served randomly
   - User-specific content (journal entries) requires authentication

3. **Real-time Features**:
   - Meditation timer uses browser APIs for audio playback
   - Journal entries stored locally and optionally synced to server
   - Newsletter subscriptions stored in JSON file system

## External Dependencies

### APIs and Services
- **Neon Database**: PostgreSQL serverless hosting
- **PayPal SDK**: Payment processing and subscriptions
- **SendGrid**: Email delivery for newsletters
- **Firebase Auth**: Google OAuth integration
- **NASA APOD API**: Astronomy Picture of the Day (with fallbacks)

### Asset Sources
- **Unsplash**: High-quality space and cosmic imagery
- **Font Sources**: Google Fonts (Inter, Space Grotesk)
- **Icons**: Remix Icons for consistent iconography

### Development Tools
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Server-side bundling for production
- **TSX**: TypeScript execution for development

## Deployment Strategy

### Development Environment
- Local development using `npm run dev`
- Hot module replacement via Vite
- Database migrations via `npm run db:push`
- Environment variables for API keys and database connections

### Production Build
- Frontend built with Vite to static assets
- Backend bundled with ESBuild for Node.js deployment
- Database hosted on Neon with connection pooling
- Session store can use PostgreSQL or in-memory for simplicity

### Environment Configuration
Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: OAuth credentials
- `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET_KEY`: Payment processing
- `SENDGRID_API_KEY`: Email service

### Scaling Considerations
- Stateless backend design allows horizontal scaling
- Database connection pooling via Neon
- Static assets can be served via CDN
- Session store can be moved to Redis for multi-instance deployments

## Notable Architectural Decisions

### Database Schema Design
- **Rationale**: Chose PostgreSQL for ACID compliance and complex queries
- **Schema**: Normalized design with proper foreign key relationships
- **Migration Strategy**: Drizzle Kit for type-safe schema evolution

### Authentication Architecture
- **Problem**: Need both local and social authentication
- **Solution**: Passport.js with multiple strategies
- **Trade-offs**: Session-based auth simpler than JWT for this use case

### Frontend State Management
- **Problem**: Complex state between server data and local preferences
- **Solution**: TanStack Query for server state, React hooks for UI state
- **Benefits**: Automatic caching, optimistic updates, error handling

### Payment Processing
- **Problem**: Need subscription billing with good UX
- **Solution**: PayPal SDK with React components
- **Alternative**: Stripe considered but PayPal chosen for simpler integration

### Content Delivery
- **Problem**: Mixed static and dynamic content needs
- **Solution**: Express API with file-based fallbacks
- **Benefits**: Can scale to CMS later while maintaining performance