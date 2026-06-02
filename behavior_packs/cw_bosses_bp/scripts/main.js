import { world, system } from "@minecraft/server";

// --- CatWars Bosses :: Stage 1 test ---
// Purpose: prove the whole chain works (git pull -> reload -> see it in game).
// When a player spawns/joins, say hello in chat. If you see this message,
// the script API, the behavior pack, and your transfer workflow all work.

world.afterEvents.playerSpawn.subscribe((event) => {
  if (event.initialSpawn) {
    world.sendMessage("§6[CatWars]§r Mód běží! Boss addon je načtený. 🐾");
  }
});

// Also announce once when the world finishes loading, so you get feedback
// even if you're already in the world when you /reload.
system.run(() => {
  world.sendMessage("§6[CatWars]§r Skript naběhl. (Stage 1 test)");
});
