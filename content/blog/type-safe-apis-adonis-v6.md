---
title: Type-Safe APIs with AdonisJS v6
date: 2025-04-15
readTime: 10 min read
tags: [AdonisJS, TypeScript, API]
summary: AdonisJS v6 brings first-class TypeScript support and a completely rethought router.
---

# Type-Safe APIs with AdonisJS v6

I've been building production APIs with AdonisJS for two years. v6 is the release that finally makes it feel like a framework designed for TypeScript from day one, rather than a JavaScript framework with types bolted on.

## The Router

The new router infers types from your controller methods. If your controller returns `{ id: number, name: string }`, the router knows that. It's a small thing that eliminates an entire category of bugs — the "I changed the response shape but forgot to update the client" class.

```ts
// app/controllers/users_controller.ts
export default class UsersController {
  async show({ params }: HttpContext) {
    const user = await User.findOrFail(params.id);
    return user.serialize();
  }
}
```

```ts
// start/routes.ts
router.get("/users/:id", [UsersController, "show"]);
```

The string `"show"` is typed — TypeScript will error if you typo the method name.

## VineJS for Validation

AdonisJS v6 ships with VineJS as the default validator. It's fast, composable, and the error messages are human-readable out of the box.

```ts
import vine from "@vinejs/vine";

const createUserValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(8),
    role: vine.enum(["admin", "user", "guest"]),
  }),
);

// In the controller
const payload = await request.validateUsing(createUserValidator);
// payload is fully typed: { email: string, password: string, role: 'admin' | 'user' | 'guest' }
```

No `any` in sight. The inferred type of `payload` is exactly what you'd write by hand.

## Lucid ORM with Proper Types

Lucid v20 (bundled with v6) generates model types from your column definitions. This sounds obvious, but it took years to land properly.

```ts
import { BaseModel, column, belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare title: string;

  @column()
  declare userId: number;

  @belongsTo(() => User)
  declare author: BelongsTo<typeof User>;
}
```

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

## Middleware Typing

Middleware can now declare what they attach to `HttpContext`. If an `auth` middleware sets `ctx.auth.user`, downstream controllers can access that with full type safety — no casting, no optional chaining just to satisfy the compiler.

```ts
// Middleware declares its contract
declare module "@adonisjs/core/http" {
  interface HttpContext {
    auth: {
      user: User;
    };
  }
}
```

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

## The End-to-End Flow

With all of this in place, a typical request/response cycle looks like:

1. Request arrives, middleware attaches `ctx.auth.user`
2. Controller calls `request.validateUsing(validator)` — fully typed payload
3. Lucid query returns typed model instances
4. `model.serialize()` returns a typed object
5. Response is sent

Not a single `as unknown as SomeType` in the chain. That's the goal, and v6 actually achieves it.
