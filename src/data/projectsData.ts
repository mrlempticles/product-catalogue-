import type { Project } from '../types/project';

export const PROJECTS_DATA: Project[] = [
  {
    id: 'ontripio',
    title: 'Ontripio',
    tagline: 'AI-Powered Smart Travel & Itinerary Planning Platform',
    description: 'A comprehensive travel companion application featuring dynamic itinerary generation, operator management, location discovery, and real-time Supabase backend integrations.',
    category: 'fullstack',
    tags: ['React', 'TypeScript', 'Vite', 'Supabase', 'TailwindCSS', 'AI'],
    githubUrl: 'https://github.com/mrlempticles/ontripio',
    liveUrl: 'https://ontripio.vercel.app',
    localPath: 'd:/code/ontripio',
    featured: true,
    stars: 14,
    forks: 3,
    stats: {
      filesCount: 42,
      linesOfCode: '8.4k',
      status: 'Active'
    },
    readmeMarkdown: `# Ontripio - AI Travel Planner

Ontripio is an intelligent travel itinerary and trip planner built with React, TypeScript, Vite, and Supabase.

## Key Features
- 🗺️ **Interactive Trip Planner**: Generate customized multi-day travel plans.
- 🚌 **Operator Management**: View and sync tour operators with Supabase.
- ⚡ **Real-time Sync**: Instant updates for itineraries and trip bookmarks.
- 📱 **Mobile Responsive**: Custom shell with bottom navigation and quick search.

## Tech Stack
- Frontend: React 18, TypeScript, Tailwind CSS, Lucide Icons
- Backend / Database: Supabase PostgreSQL, Row Level Security (RLS)
- Build System: Vite, ESLint, TypeScript
`,
    sampleFiles: [
      {
        name: 'src',
        type: 'folder',
        path: 'src',
        children: [
          {
            name: 'pages',
            type: 'folder',
            path: 'src/pages',
            children: [
              {
                name: 'TripsPage.tsx',
                type: 'file',
                path: 'src/pages/TripsPage.tsx',
                language: 'typescript',
                content: `import React, { useState } from 'react';
import { Compass, MapPin, Calendar, Plus } from 'lucide-react';

export const TripsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Expeditions</h1>
          <p className="text-slate-500">Plan and track your next adventure seamlessly.</p>
        </div>
        <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl transition">
          <Plus size={18} /> New Trip
        </button>
      </header>
    </div>
  );
};`
              },
              {
                name: 'SupportPage.tsx',
                type: 'file',
                path: 'src/pages/SupportPage.tsx',
                language: 'typescript',
                content: `import React from 'react';
import { HelpCircle, Mail, MessageSquare } from 'lucide-react';

export const SupportPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h2 className="text-2xl font-bold text-slate-900">Ontripio Help Center</h2>
      <p className="text-slate-600">Need help planning your next itinerary? Contact our support team below.</p>
    </div>
  );
};`
              }
            ]
          },
          {
            name: 'data',
            type: 'folder',
            path: 'src/data',
            children: [
              {
                name: 'trips.ts',
                type: 'file',
                path: 'src/data/trips.ts',
                language: 'typescript',
                content: `export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  tags: string[];
}`
              }
            ]
          }
        ]
      },
      {
        name: 'supabase',
        type: 'folder',
        path: 'supabase',
        children: [
          {
            name: 'schema.sql',
            type: 'file',
            path: 'supabase/schema.sql',
            language: 'sql',
            content: `-- Ontripio Core Database Schema
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`
          }
        ]
      }
    ],
    previewCapabilities: {
      hasLiveIframe: true,
      hasCodeExplorer: true,
      hasInteractiveSim: true
    },
    simulatedOutput: `[SYSTEM] Initializing Ontripio App Engine v2.1...
[SUPABASE] Connected to PostgreSQL cluster (us-east-1).
[GEO] Loaded 1,420 destination nodes.
[STATUS] All services operational. Ready for user interaction.`
  },
  {
    id: 'travio',
    title: 'Travio',
    tagline: 'Smart Travel & Flight Explorer Web Application',
    description: 'A modern, high-performance travel discovery web application built with React, Next.js components, and Supabase database integration for quick flight and destination discovery.',
    category: 'web',
    tags: ['React', 'Next.js', 'Vite', 'TypeScript', 'TailwindCSS'],
    githubUrl: 'https://github.com/mrlempticles/travio',
    liveUrl: 'https://travio-app.vercel.app',
    localPath: 'd:/code/travio',
    featured: true,
    stars: 9,
    forks: 2,
    stats: {
      filesCount: 35,
      linesOfCode: '5.2k',
      status: 'Active'
    },
    readmeMarkdown: `# Travio

Travio is a lightweight travel search engine designed for rapid flight comparison and destination exploration.

## Features
- 🛫 **Flight Discovery Engine**: Fast search with dynamic filters.
- 🔔 **Notification System**: Price alerts and itinerary notifications.
- 🎨 **Minimal UI**: Clean aesthetic built with custom CSS utilities.
`,
    sampleFiles: [
      {
        name: 'ai.ts',
        type: 'file',
        path: 'ai.ts',
        language: 'typescript',
        content: `export async function getTravelRecommendations(preferences: string[]) {
  return [
    { city: 'Kyoto', country: 'Japan', matchScore: 98 },
    { city: 'Reykjavik', country: 'Iceland', matchScore: 94 },
    { city: 'Barcelona', country: 'Spain', matchScore: 91 }
  ];
}`
      }
    ],
    previewCapabilities: {
      hasLiveIframe: true,
      hasCodeExplorer: true,
      hasInteractiveSim: true
    },
    simulatedOutput: `[TRAVIO] Fetching flight data stream...
[SEARCH] Found 14 active flights matching filter criteria.
[PRICING] Lowest fare: $340 (Non-stop).`
  },
  {
    id: 'my-ecommerce-store',
    title: 'My E-Commerce Store',
    tagline: 'Interactive Online Storefront with Python Server Integration',
    description: 'A sleek custom e-commerce web application featuring dynamic cart controls, product filtering, checkout calculation, and a Python micro-server API back-end.',
    category: 'web',
    tags: ['JavaScript', 'HTML5', 'CSS3', 'Python', 'HTTP Server'],
    githubUrl: 'https://github.com/mrlempticles/my-ecommerce-store',
    localPath: 'd:/code/my-ecommerce-store',
    featured: true,
    stars: 7,
    forks: 1,
    stats: {
      filesCount: 6,
      linesOfCode: '2.1k',
      status: 'Completed'
    },
    readmeMarkdown: `# My E-Commerce Store

A sleek, responsive e-commerce web platform created using vanilla JavaScript, modern CSS Grid/Flexbox styling, and a custom Python backend server.

## Features
- 🛒 **Dynamic Shopping Cart**: Add, update, and manage items in real time.
- 🐍 **Python Server API**: Serves catalog JSON endpoints and calculates order totals.
- 🎨 **Custom Theme**: Clean editorial layout with product grid view.
`,
    sampleFiles: [
      {
        name: 'script.js',
        type: 'file',
        path: 'script.js',
        language: 'javascript',
        content: `class ShoppingCart {
  constructor() {
    this.items = [];
    this.total = 0;
  }

  addItem(product) {
    this.items.push(product);
    this.calculateTotal();
    this.updateCartUI();
  }

  calculateTotal() {
    this.total = this.items.reduce((sum, item) => sum + item.price, 0);
  }

  updateCartUI() {
    const badge = document.querySelector('.cart-count');
    if (badge) badge.textContent = this.items.length;
  }
}

const cart = new ShoppingCart();`
      },
      {
        name: 'server.py',
        type: 'file',
        path: 'server.py',
        language: 'python',
        content: `from http.server import HTTPServer, SimpleHTTPRequestHandler
import json

class CustomHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/products':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            products = [
                {"id": 1, "name": "Minimalist Watch", "price": 120},
                {"id": 2, "name": "Leather Backpack", "price": 180}
            ]
            self.wfile.write(json.dumps(products).encode())
        else:
            super().do_GET()

if __name__ == '__main__':
    server = HTTPServer(('localhost', 8000), CustomHandler)
    print("Serving on port 8000...")
    server.serve_forever()`
      }
    ],
    previewCapabilities: {
      hasLiveIframe: false,
      hasCodeExplorer: true,
      hasInteractiveSim: true
    },
    simulatedOutput: `[PYTHON SERVER] Starting HTTP server on http://localhost:8000
[API] GET /api/products -> 200 OK (2 items returned)
[CART] Item added: Leather Backpack ($180)
[CHECKOUT] Subtotal calculated successfully.`
  },
  {
    id: 'codevectors',
    title: 'CodeVectors API',
    tagline: 'FastAPI Vector Embeddings & Product Search Microservice',
    description: 'A high-performance Python FastAPI service providing vector database indexing, CRUD operations, product schemas, and automated pytest test suites.',
    category: 'python',
    tags: ['Python', 'FastAPI', 'SQLite', 'Pytest', 'Docker', 'REST API'],
    githubUrl: 'https://github.com/mrlempticles/codevectors',
    localPath: 'd:/code/codevectors',
    featured: true,
    stars: 11,
    forks: 4,
    stats: {
      filesCount: 16,
      linesOfCode: '3.8k',
      status: 'Active'
    },
    readmeMarkdown: `# CodeVectors API

FastAPI powered microservice for vector search indexing and product catalog queries.

## Architecture
- **FastAPI Core**: Async RESTful endpoints for search & creation.
- **SQLAlchemy DB**: Relational persistence with SQLite database engine.
- **Pytest Suite**: Complete test coverage for CRUD endpoints.
`,
    sampleFiles: [
      {
        name: 'main.py',
        type: 'file',
        path: 'main.py',
        language: 'python',
        content: `from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import crud, models, schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CodeVectors API", version="1.0.0")

@app.get("/")
def read_root():
    return {"status": "online", "service": "CodeVectors Search Engine"}

@app.get("/products/search/")
def search_products(q: string, db: Session = Depends(get_db)):
    results = crud.search_vectors(db, query=q)
    return {"query": q, "count": len(results), "items": results}`
      },
      {
        name: 'crud.py',
        type: 'file',
        path: 'crud.py',
        language: 'python',
        content: `from sqlalchemy.orm import Session
import models, schemas

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def search_vectors(db: Session, query: str):
    # Vector similarity search mock implementation
    return db.query(models.Product).limit(10).all()`
      }
    ],
    previewCapabilities: {
      hasLiveIframe: false,
      hasCodeExplorer: true,
      hasInteractiveSim: true
    },
    simulatedOutput: `INFO:     Started server process [12840]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
GET /products/search/?q=vector 200 OK - 12ms`
  },
  {
    id: 'spotify-mood',
    title: 'Spotify Mood Recommender',
    tagline: 'Audio Features & Playlist Generation Engine',
    description: 'Python data science & Web API tool analyzing audio track valence, energy, and acoustic metrics to compile personalized playlists.',
    category: 'python',
    tags: ['Python', 'Spotify API', 'OAuth2', 'Data Science', 'JSON API'],
    githubUrl: 'https://github.com/mrlempticles/spotify-mood-based',
    localPath: 'd:/code/spotify mood based',
    featured: false,
    stars: 6,
    forks: 1,
    stats: {
      filesCount: 12,
      linesOfCode: '1.9k',
      status: 'Completed'
    },
    readmeMarkdown: `# Spotify Mood Based Recommender

Analyze Spotify audio metrics (Valence, Tempo, Energy) to generate mood-centric playlists.

## Highlights
- **OAuth 2.0 Auth**: Spotify Web API integration.
- **Audio Metric Mapping**: Classifies songs into Chill, Hype, Focus, or Melancholic moods.
`,
    sampleFiles: [
      {
        name: 'api',
        type: 'folder',
        path: 'api',
        children: [
          {
            name: 'mood_analyzer.py',
            type: 'file',
            path: 'api/mood_analyzer.py',
            language: 'python',
            content: `def categorize_track_mood(valence: float, energy: float, tempo: float) -> str:
    if valence > 0.75 and energy > 0.7:
        return "Euphoric / Party"
    elif valence < 0.4 and energy < 0.4:
        return "Deep Chill / Melancholy"
    elif energy > 0.8:
        return "High Voltage Workout"
    return "Focus & Flow"`
          }
        ]
      }
    ],
    previewCapabilities: {
      hasLiveIframe: false,
      hasCodeExplorer: true,
      hasInteractiveSim: true
    },
    simulatedOutput: `[SPOTIFY] Authenticated user session @mrlempticles
[ANALYZER] Analyzed 50 recent tracks.
[MOOD] Detected dominant mood: "Focus & Flow" (Score: 88%)
[PLAYLIST] Created playlist "Flow State 2026" with 20 tracks.`
  },
  {
    id: 'parkspace',
    title: 'ParkSpace',
    tagline: 'Smart Parking Allocation & Reservation System',
    description: 'A real-time parking slot management engine built with Node.js to track parking space availability, handle reservations, and compute fee structures.',
    category: 'tools',
    tags: ['JavaScript', 'Node.js', 'JSON DB', 'REST API'],
    githubUrl: 'https://github.com/mrlempticles/parkspace',
    localPath: 'd:/code/parkspace',
    featured: false,
    stars: 5,
    forks: 0,
    stats: {
      filesCount: 8,
      linesOfCode: '1.4k',
      status: 'Completed'
    },
    readmeMarkdown: `# ParkSpace

Automated smart parking system that monitors slot availability in real time.
`,
    sampleFiles: [
      {
        name: 'parkspace.js',
        type: 'file',
        path: 'parkspace.js',
        language: 'javascript',
        content: `const parkspace = {
  slots: Array(50).fill(null).map((_, i) => ({ id: i + 1, occupied: false })),
  
  reserve(slotId, vehicleNo) {
    const slot = this.slots.find(s => s.id === slotId);
    if (slot && !slot.occupied) {
      slot.occupied = true;
      slot.vehicleNo = vehicleNo;
      return { success: true, message: \`Slot \${slotId} reserved for \${vehicleNo}\` };
    }
    return { success: false, message: 'Slot unavailable' };
  }
};`
      }
    ],
    previewCapabilities: {
      hasLiveIframe: false,
      hasCodeExplorer: true,
      hasInteractiveSim: true
    },
    simulatedOutput: `[PARKSPACE] Initializing 50 parking slots...
[RESERVATION] Slot #12 reserved for Vehicle DL-08-AX-4910.
[STATUS] Occupancy: 1/50 slots (2% full).`
  }
];
