# Nairobi Lifestyle Advisor

A weather intelligence application built on the **Weather-AI API** that translates raw meteorological data into practical, human-centered daily lifestyle recommendations for residents and visitors across Nairobi's major regions.

**Live Demo**: [https://nairobilifestyleapp.vercel.app](https://nairobilifestyleapp.vercel.app/)


---

## 🎯 Project Overview

Built as part of the **Weather-AI technical assessment**, this application demonstrates end-to-end API integration from secure server-side consumption of Weather-AI's data to a polished, opinionated frontend experience designed around real user needs in Nairobi.

The core thesis: raw weather numbers mean little to most people. What matters is *what to do with that information*. This app bridges that gap.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Regional Coverage** | 8 major Nairobi regions (Westlands, Karen, CBD, Gigiri, etc.) |
| **Smart Dress Advisor** | Outfit recommendations including accessories based on temperature, rain, and UV |
| **Run/Walk Windows** | Optimized exercise windows factoring in sunrise/sunset, temperature, and UV index |
| **Pet Activity Guidance** | Safe outdoor windows for pet walks based on heat and UV |
| **Gardening Tips** | Small-scale urban farming advice based on soil moisture, rainfall, and sun |
| **UV & Skin Protection** | SPF recommendations and exposure time limits per UV index level |
| **Cache-First Architecture** | 4-hour intelligent caching to ensure fast responses and minimal API calls |

---

## 🛠 Tech Stack & Design Decisions
Frontend  →  React + Vite + TypeScript + Tailwind CSS + shadcn/ui

Backend   →  Supabase Edge Functions

Database  →  Supabase PostgreSQL (caching layer)

Hosting   →  Vercel (frontend) + Supabase (backend)

### Why this stack?

Every service used operates comfortably within its **free tier**, which was a conscious constraint given the 48-hour window. Beyond cost, each choice has a technical rationale:

- **Supabase Edge Functions** serve as the secure REST API layer. Weather-AI API keys never touch the client they live exclusively in edge function environment variables, isolated from the browser entirely.
- **Supabase PostgreSQL** acts as the caching store. A `weather_advice_cache` table with a `JSONB` column holds pre-computed advice per region, with a `expires_at` TTL field for freshness control.
- **Vite + React + TypeScript** for a fast, type-safe developer experience with minimal configuration overhead.
- **shadcn/ui + Tailwind** for a consistent, accessible component system without opinionated design lock-in.

---

## 🏗 Architecture
```
User Browser
│
▼
React Frontend (Vercel)
│  HTTPS
▼
Supabase Edge Function (/get-advice)
│
├── Check PostgreSQL cache (region + expires_at)
│       ├── Cache HIT  → Return cached JSONB immediately
│       └── Cache MISS → Fetch from Weather-AI API
│                             │
│                             ▼
│                       Store in cache (TTL: 4 hours)
│                             │
└─────────────────────────────┘
```
Return advice to client

### Cache Strategy

Data is cached **per region** for 4 hours. This keeps the app well within Weather-AI API rate limits, ensures sub-100ms response times on cache hits, and reduces cold start frequency. A `pg_cron` job runs daily at **6:00 AM EAT** to pre-warm all 8 region caches before peak morning usage.

---

## 🔒 Security

- **No API keys in the client.** All Weather-AI credentials are stored as Supabase Edge Function secrets — they are never bundled into the frontend build or exposed in network requests.
- **Environment variables** follow `.env` conventions for local development, with `.env` excluded from version control via `.gitignore`.
- **Supabase Row-Level Security (RLS)** is enabled on the cache table, with read access scoped appropriately.

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js 18+
- A Supabase project
- Weather-AI API credentials

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/nairobi-lifestyle-advisor.git
cd nairobi-lifestyle-advisor
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Database Setup

In your Supabase SQL Editor, run:

```sql
CREATE TABLE IF NOT EXISTS weather_advice_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  region TEXT UNIQUE NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  advice_data JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_weather_region ON weather_advice_cache(region);
```

### 4. Deploy Edge Function

Deploy the `get-advice` function:

```bash
supabase functions deploy get-advice
```

Set your Weather-AI API key as a secret:

```bash
supabase secrets set WEATHER_AI_API_KEY=your_key_here
```

### 5. Run Locally

```bash
npm run dev
```

---

## 🚀 Scaling Considerations

This stack is sized for **100–200 concurrent users**, which matches the current scope. If this were to scale regionally or globally, the natural evolution would be:

- **AWS CloudFront** for global CDN distribution with edge caching, reducing latency across geographies
- **AWS Lambda + API Gateway** to replace Supabase Edge Functions with more granular control over cold start behavior and execution limits
- **ElastiCache (Redis)** as a high-throughput caching layer in place of PostgreSQL for sub-millisecond cache reads
- **Multi-region Supabase** or Aurora Global Database for data residency and failover

For now, Supabase's global CDN handles static asset delivery and Vercel's edge network covers the frontend both are production-grade for this scale.

---

## 🔮 Future Improvements

These were scoped and designed but not implemented due to the **48-hour time constraint** and a **Weather-AI API outage on June 4th, 2026 (approx. 3:35 PM EAT)** that returned 500 errors and meaningfully reduced available development and testing time.

### Planned Features

**Tomorrow's Outlook**
A dedicated tab showing next-day forecasts with the same advisory framework — dress, activity windows, UV, and gardening guidance for the following day.

**Vehicle & Parking Advisory**
A money-saving feature that would discourage car wash bookings on days with high rain probability, and warn against open-air parking on high-UV days to protect vehicle interiors and paintwork. Small but practical advice that compounds into real savings.

**Cron-Based Auto Refresh**
Automated daily cache refresh via `pg_cron` across all 8 regions at 6:00 AM, decoupled from user requests.

**Push Notifications**
Opt-in alerts for optimal activity windows (e.g., "Best run window opens in 30 minutes").

### A Different Product Direction

If starting from scratch, a compelling alternative would be targeting **renewable energy producers** — solar and wind farm operators. Weather-AI's UV index and wind speed data map directly to yield forecasting for energy producers. This creates a clear B2B monetization path and a stickier, higher-value use case than consumer lifestyle advice.

---

## 📄 License

Copyright © 2026 Naboth Tieng. All rights reserved.

This project was created as an independent technical work product. No portion of this codebase, architecture design, or feature concepts may be reproduced, distributed, or incorporated into any commercial product without explicit written permission from the author.

### Third-Party Attributions

- UI components from [shadcn/ui](https://ui.shadcn.com/) — [MIT License](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md)
- Photos from [Unsplash](https://unsplash.com) — [Unsplash License](https://unsplash.com/license)
- Weather data provided by [Weather-AI](https://weather-ai.co) via their developer API

---
