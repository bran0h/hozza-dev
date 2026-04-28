---
title: Building a Game Engine in Rust
date: 2025-06-12
readTime: 8 min read
tags: [Rust, Bevy, ECS]
excerpt: Embarking on a game engine from scratch is equal parts humbling and exhilarating.
---

# Building a Game Engine in Rust

Two months ago I decided to stop watching YouTube videos about Bevy and actually write some code. What followed was a crash course in Entity Component Systems, borrow checker fights, and the occasional moment of pure joy when a sprite actually appeared on screen.

## Why Bevy?

There are a few Rust game frameworks out there — Macroquad is great for quick 2D sketches, ggez is battle-tested, and you could always reach for raw `wgpu`. I chose Bevy because its ECS architecture forces you to think about game logic in a fundamentally different way, and that friction is the point.

```rust
use bevy::prelude::*;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_systems(Startup, spawn_player)
        .add_systems(Update, move_player)
        .run();
}
```

## The ECS Mental Model

In a traditional OOP game you'd have a `Player` class with position, velocity, sprite, health — all bundled together. ECS flips this: **entities** are just IDs, **components** are plain data structs, and **systems** are functions that query for entities matching a component signature.

```rust
#[derive(Component)]
struct Player;

#[derive(Component)]
struct Velocity(Vec2);

fn move_player(
    mut query: Query<(&mut Transform, &Velocity), With<Player>>,
    time: Res<Time>,
) {
    for (mut transform, velocity) in &mut query {
        transform.translation.x += velocity.0.x * time.delta_secs();
        transform.translation.y += velocity.0.y * time.delta_secs();
    }
}
```

The first time this compiled and ran, I understood why people get obsessive about Bevy. The query system reads almost like a sentence.

## Fighting the Borrow Checker

The honeymoon ended when I tried to mutably borrow two different components in the same system. Bevy's scheduler parallelises systems automatically, which means it needs to prove at compile time that no two systems alias the same data mutably.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

The fix was splitting the logic into separate systems with explicit ordering:

```rust
app.add_systems(Update, (
    read_input,
    apply_velocity,
    check_collisions,
).chain());
```

## Rendering a Tilemap

Getting a basic sprite moving is one thing. Getting a tilemap rendering efficiently is another. Bevy's `TilemapPlugin` from the `bevy_ecs_tilemap` crate does a lot of the heavy lifting, but you still need to understand how texture atlases work.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## What's Next

I'm currently working on a simple dungeon crawler as a learning project. The goal isn't to ship a game — it's to build intuition for the patterns that keep large Bevy projects maintainable. Pathfinding with `big-brain` is next on the list.

If you're on the fence about trying Bevy, just do it. The learning curve is real, but the Rust borrow checker and the ECS model push you toward cleaner architecture than you'd naturally write otherwise.
