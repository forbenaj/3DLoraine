# Best Practices Change Steps

This document lists the concrete steps to bring the repo in line with common
front end and engine design best practices. Each step is written as a change
action you can implement.

## 1) Project setup and dependency management
1. Add a `package.json` and use a bundler/dev server (Vite is a good fit) so
   Three.js is managed as a dependency instead of a global CDN script.
2. Convert all Three.js usage to ESM imports (for example,
   `import * as THREE from "three";`) and remove reliance on the global `THREE`
   in every module.
3. Remove unused demo entry points or wire them into the build. For example,
   delete `script.js` if it is not used by `index.html`.
4. Add `npm` scripts for dev server, build, and preview so the project has
   predictable run steps.

## 2) Engine loop and ownership
1. Move the update/render loop into `engine/core/Game.js` and call `game.animate`
   from `main.js` instead of a separate loop.
2. Fix delta time math in `engine/core/Game.js` so it uses
   `(now - lastTime) / 1000` and stores `lastTime = now`.
3. Ensure `Game.update` owns updates for all entities (including the player)
   instead of updating in multiple places.

## 3) World and scene management
1. Decide on one scene object model (raw `THREE.Object3D` or `GameObject`) and
   apply it consistently in `engine/core/World.js` and prefabs.
2. Update `World.addObject` to accept only one type (game object or mesh) and
   always attach it to the scene in a single place.
3. Remove duplicate scene adds in `engine/core/World.js` (currently each box
   adds both the mesh and the outline group).

## 4) ECS consistency and component ownership
1. Initialize `GameObject.object3D` in `engine/core/GameObject.js` and use it as
   the parent for all child objects.
2. Update `engine/components/Camera.js` to add the camera to `object3D`
   instead of calling `GameObject.add` with a raw Three.js object.
3. Replace the standalone `engine/prefabs/Player.js` with a prefab based on
   `GameObject` and components (or remove the ECS code if you prefer the
   standalone style).
4. Remove `engine/prefabs/Player copy.js` to avoid confusion or ensure only one
   implementation exists.

## 5) Input and controller isolation
1. Remove the global `game` reference inside `engine/core/Controller.js`.
   Instead, pass callbacks or inject a reference when you need to toggle pause.
2. Centralize input handling so only one input system owns DOM listeners and
   provides state to player/controllers.
3. Add cleanup for event listeners on teardown to prevent leaks or duplicate
   handlers in hot reload.

## 6) Physics and movement correctness
1. Fix the `engine/components/PhysicsBody.js` property mismatch
   (`this.velocity` vs `this.vel`) and standardize on one name.
2. Keep movement and collision logic in a dedicated system or component instead
   of in the prefab constructor.
3. Use delta time in movement updates to make gameplay frame rate independent.

## 7) Asset loading and map data
1. Create a small asset loader utility that returns promises for textures and
   JSON, with error handling and caching.
2. Validate map JSON structure on load to catch missing fields early.
3. Normalize texture path usage so all paths are resolved from a single base.

## 8) Rendering and resize handling
1. Add a resize handler in `Game` so renderer and active camera update on
   window resize.
2. Ensure only the active camera is used for render and that all cameras are
   created consistently (avoid mixing global and component cameras).

## 9) Cleanup of factories and utilities
1. Merge `engine/core/Factory.js` and `engine/core/oldFactory.js` into one
   module and delete the unused copy to prevent drift.
2. Move constants like `directionMap` into a dedicated input or config module
   rather than `engine/utils.js`.
3. Remove unused exports and dead code paths to simplify the engine surface.

## 10) Quality tooling and documentation
1. Add ESLint and Prettier for consistent formatting and catch common mistakes.
2. Add a basic `README.md` explaining how to run the project and where key
   modules live.
3. Consider minimal automated tests for data validation and core utilities.

