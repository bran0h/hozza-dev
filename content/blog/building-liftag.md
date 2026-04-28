---
title: "Building Liftag: QR-Powered Gym Tracking"
date: 2025-07-01
readTime: 11 min read
tags: [React Native, AdonisJS, PostgreSQL, Expo]
excerpt: Frictionless workout logging — scan the QR on any machine and the app already knows what to do.
---

# Building Liftag: QR-Powered Gym Tracking

The problem with most gym apps is the same: you've just finished a set, your hands are chalked, and the app wants you to navigate three menus to find the leg press. Liftag's premise is simple — every piece of gym equipment gets a QR code, you scan it, and the right exercise is already loaded. No searching, no typing.

## The Stack

Liftag is three projects sharing a PostgreSQL database:

- **API** — AdonisJS 6 + Lucid ORM, modularised by domain
- **Mobile** — React Native + Expo, strict TypeScript, NativeWind for styling
- **Dashboard** — Nuxt + Nuxt UI for gym owners to manage equipment and QR assignments

The QR scan is the beating heart of the whole system. A scan resolves to a machine ID; the API returns the exercise templates configured for that machine, including instructional video URLs stored in Supabase Storage.

## The API Architecture

The API is split into domain modules, each with its own PostgreSQL schema:

```
app/modules/
  users/        # auth, profiles, Strava connections
  catalog/      # exercise templates, video assets
  gyms/         # gym profiles, equipment, QR mappings
  workouts/     # sessions, sets, Strava sync
  routines/     # saved programmes
  trainers/     # trainer–athlete relationships
  plans/        # structured training plans
```

Each module owns its schema, controllers, services, validators, and router. The router file exports a single `register*Routes` function that the main `start/routes.ts` calls at boot. This keeps the entry point clean and lets modules stay self-contained.

## Schema Generation

One of my favourite AdonisJS patterns in this project: I generate TypeScript types directly from the live database schema.

```bash
node ace schema:generate
```

This writes `database/schema.ts` — a set of base classes with every column typed exactly as Postgres has it. Models then extend these classes and add only relations:

```typescript
export default class WorkoutSession extends WorkoutSessionSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>;

  @hasMany(() => WorkoutSet)
  declare sets: HasMany<typeof WorkoutSet>;
}
```

No drift between the DB and the type layer. If I add a column in a migration and forget to regenerate, TypeScript will tell me the property doesn't exist before the code ever runs.

## The Mobile App

The React Native app is Expo + file-based routing via Expo Router. Every screen is in `app/`, all business logic lives in `src/hooks/`. The UI is deliberately thin — hooks own the state and mutations, components just render.

The QR flow is the most interesting UX challenge. A scan needs to:

1. Identify the machine
2. Check whether there's an active workout session
3. If not, create one automatically
4. Pre-load the exercise and put the user directly on the logging screen

All of that happens in under 300ms on a good connection. The auto-start behaviour means a member can walk up to any machine, scan, and be logging their first set within seconds.

```typescript
// hooks/useQrScan.ts
export function useQrScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (qrId: string) => {
      const machine = await resolveMachine(qrId);
      const session = await ensureActiveSession();
      return { machine, session };
    },
    onSuccess: ({ machine, session }) => {
      queryClient.invalidateQueries({ queryKey: ["session", session.id] });
      router.push(`/tracking/${session.id}/${machine.exerciseId}`);
    },
  });
}
```

## Strava Sync

Members can connect their Strava account and have completed workout sessions automatically create Strava activities.

The sync is intentionally not automatic on session end. It's triggered manually from the app, which keeps the happy path fast and avoids surprising users with a third-party API call blocking their post-workout flow.

Failed syncs are stored with a `pending` status and retried on the next manual trigger. Simple, but it's survived six months in production without a stuck record.

## The Gym Owner Dashboard

The Nuxt dashboard lets gym admins do three things: manage their equipment catalogue, assign exercise templates to machines, and generate/print QR codes. It's built on Nuxt UI, which is opinionated enough to keep the UI consistent without me designing every component from scratch.

QR generation is a client-side SVG operation — the machine ID is encoded as a QR, rendered to canvas, and exported as a printable PNG. No server round-trip needed.
