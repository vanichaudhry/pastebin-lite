## Pastebin Lite

A simple Pastebin-like service built using Next.js and MongoDB.

## Features
- Create a paste with optional expiry (TTL)
- Optional maximum view count
- Persistent storage using MongoDB Atlas
- REST APIs and HTML view for pastes

## Tech Stack
- Next.js
- MongoDB Atlas
- Node.js

## APIs
- POST /api/pastes
- GET /api/pastes/:id
- GET /api/healthz

## Running Locally
1. Install dependencies
2. Add `.env.local` with `MONGODB_URI`
3. Run `npm run dev`

## Deployment
Deployed on Vercel.
