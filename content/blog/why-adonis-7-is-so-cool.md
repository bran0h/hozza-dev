---
title: Why AdonisJS 7 Is So Cool
date: 2026-04-30
readTime: 11 min read
tags: [AdonisJS, TypeScript, Lucid, API]
excerpt: Migrations-first schema generation meets a real serialization layer—and your API contract becomes something TypeScript can actually enforce end to end.
---

# Why AdonisJS 7 Is So Cool

If you’ve shipped APIs with Adonis for a while, v7 feels less like a bump and more like two missing puzzles snapping into place: **your database stays the source of truth for column-level typing**, and **your HTTP responses get a first-class, typed serialization layer**. Together they remove a ton of duplicate definitions and silent drift between backend and clients.

## Schema generation (the Lucid way)

Adonis 7 doubles down on a **migrations-first** mental model. You express the database with Lucid migrations; after they run, Lucid can **scan the live tables** and emit TypeScript **schema classes**—typically consolidated into something like `database/schema.ts`. Your models **extend** those classes instead of re-declaring every `@column` by hand.

That matters for three practical reasons:

1. **No imaginary columns** — If Postgres has it, the generated schema reflects it. If you rename a column in a migration and regenerate, anything still referring to the old name breaks at compile time, not in production logs.

2. **Legacy databases are fine** — You don’t need a perfect migration history on day one. Run `node ace schema:generate`, point models at the generated schemas, and you’re typed against reality.

3. **Regeneration is part of the workflow** — With schema generation enabled on your connection, running migrations can refresh schemas automatically. You can still run `schema:generate` manually whenever you need to sync without a full migrate cycle.

You can tailor how internal DB types map to TypeScript via **`database/schema_rules.ts`**—useful when you want consistent branded strings, stricter nullability, or table-specific overrides. Change the rules, regenerate, and the whole layer updates.

The pitch is simple: **migrations describe the world; generated schemas describe what TypeScript is allowed to assume about rows.** Your model files stay focused on relations, hooks, and behaviour.

## Migration + model (concrete slice)

Here’s the same idea with real files: a migration creates the table, you migrate (and optionally regenerate schemas), then the **model extends the generated schema** instead of listing columns manually.

**Migration** — defines what Postgres actually stores:

```ts
import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "posts";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").notNullable();
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.string("title", 255).notNullable();
      table.text("body").notNullable();
      table.timestamps(true, true);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
```

Run **`node ace migration:run`** (and **`node ace schema:generate`** if schemas aren’t hooked to migrate automatically). Lucid can emit schema classes (often rolled into `database/schema.ts`). You normally **don’t hand-edit** that file—think of it as compiler output from your DB:

```ts
// database/schema.ts — simplified / illustrative generated shape
import { BaseModel, column } from "@adonisjs/lucid/orm";

export class PostSchema extends BaseModel {
  static table = "posts";

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number;

  @column()
  declare title: string;

  @column()
  declare body: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: Date;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: Date;
}
```

**Model** — inherits every column from `PostSchema` and only adds what generators shouldn’t guess (relations, hooks, query scopes):

```ts
import { belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import User from "#models/user";
import { PostSchema } from "#database/schema";

export default class Post extends PostSchema {
  @belongsTo(() => User, {
    foreignKey: "userId",
  })
  declare author: BelongsTo<typeof User>;
}
```

If you rename `body` → `content` in a **new migration**, run migrations, then regenerate schemas, **`PostSchema` picks up `content`** and TypeScript immediately flags every `post.body` until you fix it. The model file stays short because it never owned the column list—only the relationship to `User`.

## Transformers: responses with a real contract

Until recently, “serialization” often meant `model.serialize()`, manual object literals, or ad-hoc pick lists scattered across controllers. **Transformers** in v7 turn that into an explicit pattern: a class extends `BaseTransformer`, implements **`toObject()`**, and defines **exactly** what crosses the wire.

```ts
// app/transformers/post_transformer.ts (conceptual)
import { BaseTransformer } from "@adonisjs/core/transformers";
import Post from "#models/post";

export default class PostTransformer extends BaseTransformer<typeof Post> {
  toObject() {
    return {
      id: this.resource.id,
      title: this.resource.title,
      excerpt: this.resource.body.slice(0, 200),
      updatedAt: this.resource.updatedAt,
    };
  }
}
```

From a controller you wire it through the context helper—**`serialize`** on `HttpContext`\*\* wraps the payload into a proper response instead of you stitching JSON by hand:

```ts
import PostTransformer from "#transformers/post_transformer";

export default class PostsController {
  async show({ params, serialize }: HttpContext) {
    const post = await Post.findOrFail(params.id);

    return serialize({
      post: PostTransformer.transform(post),
    });
  }
}
```

Nested resources compose cleanly: a post transformer can delegate to a user transformer for `author`, so **relationship shape is explicit** rather than “whatever Lucid felt like serializing today.” You also get guardrails like **depth limits** so you don’t accidentally ship an entire object graph because someone forgot to prune eager loads.

Scaffolding exists too — **`node ace make:transformer`** drops a file into `app/transformers/` so you’re not copying boilerplate from blog posts (including this one).

## From transformers to client types

Here’s the second half of why this release hits hard: transformers aren’t only a runtime pattern—they’re a **build-time input**. With the right setup (the **`indexEntities`** hook in your Adonis app config), the framework can **scan transformers** and emit TypeScript definitions derived from **`toObject()`** (and variants where you define them).

That means:

- Your **API contract** lives in one place—the transformer—not in a duplicate `types/api.ts` folder that nobody updates.
- **Rename a field** in `toObject()` and consumers importing generated types **fail the build** until they catch up.
- **Inertia apps, monorepo frontends, or generated SDKs** can share the same inferred shapes without hand-writing interfaces.

It’s the serialization layer TypeScript always wanted: not “trust me, this JSON matches,” but **the compiler checked it**.

## Why these two features belong together

**Schema generation** answers: _what can possibly exist on a row in the database?_  
**Transformers** answer: _what are we willing to show the outside world?_

Models sit in the middle: they inherit truthful columns from generated schemas, apply domain logic, then **transformers draw the boundary** for HTTP. That separation used to be fuzzy; in v7 it’s a documented workflow.

If you’re upgrading from v6, expect to spend time moving response shaping into transformers and pointing models at generated schema bases—but you’ll trade that for fewer “undefined over the wire” surprises and a single source of truth for client types.

Adonis 7 isn’t magic—it’s discipline with tooling. And for teams who care about TypeScript at the boundary between DB and browser, that’s exactly why it’s so cool.
