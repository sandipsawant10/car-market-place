# Car Market

A full-stack style React application for listing, searching, and browsing cars.

The app is built with Vite and React, uses Neon Postgres + Drizzle ORM for data access, Clerk for authentication, Cloudinary for image uploads, and Sendbird for chat/inbox features.

## Tech Stack

- Frontend: React 19, Vite 8, React Router
- UI: Tailwind CSS v4, shadcn/ui, React Icons
- Auth: Clerk
- Database: Neon Postgres
- ORM: Drizzle ORM + drizzle-kit
- Media: Cloudinary
- Messaging: Sendbird

## Features

- Public home page with category browsing and featured listings
- Search by category and search by filters
- Listing details page with gallery, specs, and pricing info
- Authenticated profile area
- Create and edit car listings
- Multi-image upload to Cloudinary
- Inbox integration via Sendbird

## Project Structure

Key folders:

- src/components: shared UI and page components
- src/add-listing: create/edit listing flow
- src/search: search pages and search-by-category route
- src/listing-details: listing details route
- src/profile: profile and inbox pages
- src/config: Drizzle/Neon config and schema
- src/shared: shared helpers and static data

## Prerequisites

- Node.js 18+
- npm 9+
- A Neon database
- A Clerk application
- A Cloudinary account with an unsigned upload preset
- A Sendbird application (for inbox/chat)

## Environment Variables

Create a .env file in the project root.

Required variables:

- VITE_CLERK_PUBLISHABLE_KEY
- VITE_NEON_CONNECTION_STRING
- VITE_CLOUDINARY_CLOUD_NAME
- VITE_CLOUDINARY_UPLOAD_PRESET
- VITE_APPLICATION_ID (Sendbird app id fallback)
- VITE_SENDBIRD_API_TOKEN

Optional variables:

- VITE_SENDBIRD_APP_ID (if set, used instead of VITE_APPLICATION_ID)
- VITE_ACCESS_KEY (used by current app integration)

Notes:

- Do not expose secrets as VITE\_ variables.
- Cloudinary API secret should never be stored in frontend environment variables.

## Getting Started

1. Install dependencies

   npm install

2. Start development server

   npm run dev

3. Open the local URL printed by Vite

## Available Scripts

- npm run dev: start development server
- npm run build: create production build
- npm run preview: preview production build locally
- npm run lint: run ESLint
- npm run db:push: push Drizzle schema to database
- npm run db:studio: open Drizzle Studio

## Database

Schema lives in src/config/schema.js and includes:

- carListing table (listing metadata)
- carImages table (image URLs linked to listing)

Drizzle config is in drizzle.config.js.

Important: move database credentials to environment variables for any shared or production setup.

## Routing Overview

- /: Home
- /search: Search by filters
- /search/:category: Search by category
- /listing/:id and /listing-details/:id: Listing details
- /add-listing: Create listing
- /profile: User profile

## Security Notes

- Browser-side SQL (Neon HTTP) is useful for fast iteration but has security tradeoffs.
- Enforce strict Neon RLS policies if querying directly from the client.
- For production, prefer a backend API layer for all write operations and sensitive reads.

## Build and Deploy

1. Build

   npm run build

2. Deploy dist output to your hosting provider.

3. Configure all required environment variables in your deployment platform.

## Troubleshooting

- No search results:
  - Verify query params match saved values (condition, make, price).
  - Verify seeded data exists in carListing and carImages.
- Cloudinary upload fails:
  - Confirm VITE_CLOUDINARY_CLOUD_NAME and unsigned VITE_CLOUDINARY_UPLOAD_PRESET.
- Clerk warning about development keys:
  - Expected in development; use production keys before release.


