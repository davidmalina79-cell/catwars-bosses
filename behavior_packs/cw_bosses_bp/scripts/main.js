import { world, system } from "@minecraft/server";

// ============================================================
//  CatWars Bosses - main script
//  @minecraft/server 2.x (Minecraft 1.26.x)
// ============================================================

// --- Test hlaska: potvrdi, ze skript bezi ---
world.afterEvents.playerSpawn.subscribe((event) => {
  if (event.initialSpawn) {
    world.sendMessage("\u00A76[CatWars]\u00A7r M\u00F3d b\u011B\u017E\u00ED! Bastet je p\u0159ipraven\u00E1. \uD83D\uDC3E");
  }
});

// ============================================================
//  BASTET - MEGA SKOK
//  Kazde ~4 sekundy: kazda Bastet, ktera ma pobliz hrace,
//  na nej vyskoci. Pri dopadu udela plosne zraneni v okoli.
// ============================================================

const JUMP_INTERVAL_TICKS = 80;   // jak casto skace (80 = 4 s)
const JUMP_TRIGGER_RANGE = 14;    // na jakou vzdalenost skoci
const SLAM_RADIUS = 5;            // polomer plosneho zraneni
const SLAM_DAMAGE = 12;           // zraneni z dopadu
const JUMP_UP = 0.55;             // sila skoku nahoru
const JUMP_FORWARD = 1.4;         // sila skoku k hraci

const airborne = new Set();

function dims() {
  return [
    world.getDimension("overworld"),
    world.getDimension("nether"),
    world.getDimension("the_end")
  ];
}

system.runInterval(() => {
  for (const dim of dims()) {
    let bastets;
    try { bastets = dim.getEntities({ type: "cw:bastet" }); }
    catch (e) { continue; }

    for (const boss of bastets) {
      if (!boss || !boss.isValid) continue;
      if (!boss.isOnGround) continue;
      if (airborne.has(boss.id)) continue;

      const players = dim.getPlayers({
        location: boss.location,
        maxDistance: JUMP_TRIGGER_RANGE
      });
      if (players.length === 0) continue;

      let target = players[0];
      let best = Infinity;
      for (const p of players) {
        const dx = p.location.x - boss.location.x;
        const dz = p.location.z - boss.location.z;
        const d = dx * dx + dz * dz;
        if (d < best) { best = d; target = p; }
      }

      const dx = target.location.x - boss.location.x;
      const dz = target.location.z - boss.location.z;
      const len = Math.hypot(dx, dz) || 1;

      try {
        boss.applyKnockback(dx / len, dz / len, JUMP_FORWARD, JUMP_UP);
      } catch (e) {
        try {
          boss.applyImpulse({
            x: (dx / len) * JUMP_FORWARD,
            y: JUMP_UP,
            z: (dz / len) * JUMP_FORWARD
          });
        } catch (e2) {}
      }

      airborne.add(boss.id);
      try { boss.dimension.playSound("mob.ravager.roar", boss.location); } catch (e) {}
    }
  }
}, JUMP_INTERVAL_TICKS);

// --- kontrola dopadu kazdy tick ---
system.runInterval(() => {
  if (airborne.size === 0) return;

  for (const dim of dims()) {
    let bastets;
    try { bastets = dim.getEntities({ type: "cw:bastet" }); }
    catch (e) { continue; }

    for (const boss of bastets) {
      if (!boss || !boss.isValid) continue;
      if (!airborne.has(boss.id)) continue;
      if (!boss.isOnGround) continue;

      airborne.delete(boss.id);
      try { boss.dimension.playSound("mob.irongolem.crack", boss.location); } catch (e) {}

      const victims = dim.getPlayers({
        location: boss.location,
        maxDistance: SLAM_RADIUS
      });
      for (const v of victims) {
        try {
          v.applyDamage(SLAM_DAMAGE, { cause: "entityAttack", damagingEntity: boss });
          const vx = v.location.x - boss.location.x;
          const vz = v.location.z - boss.location.z;
          const vl = Math.hypot(vx, vz) || 1;
          v.applyKnockback(vx / vl, vz / vl, 1.5, 0.6);
        } catch (e) {}
      }
    }
  }
}, 1);

// ============================================================
//  YETI - LEDOVA AURA
//  Kazde pul sekundy: kazdy Yeti, ktery ma pobliz hrace,
//  na nej uvali Slowness + lehky odhoz od sebe.
// ============================================================

const YETI_PULSE_TICKS = 10;     // jak casto aura pulsuje (10 = 0.5 s)
const YETI_RANGE = 6;            // dosah ledove aury
const SLOW_DURATION_TICKS = 80;  // delka Slowness (80 = 4 s)
const SLOW_AMPLIFIER = 1;        // sila zpomaleni (0 = I, 1 = II)
const YETI_PUSH = 0.45;          // sila odhozeni hrace
const YETI_PUSH_UP = 0.25;       // mirne nadhozeni

system.runInterval(() => {
  for (const dim of dims()) {
    let yetis;
    try { yetis = dim.getEntities({ type: "cw:yeti" }); }
    catch (e) { continue; }

    for (const boss of yetis) {
      if (!boss || !boss.isValid) continue;

      const victims = dim.getPlayers({
        location: boss.location,
        maxDistance: YETI_RANGE
      });
      if (victims.length === 0) continue;

      for (const v of victims) {
        try {
          v.addEffect("slowness", SLOW_DURATION_TICKS, { amplifier: SLOW_AMPLIFIER, showParticles: true });
          const vx = v.location.x - boss.location.x;
          const vz = v.location.z - boss.location.z;
          const vl = Math.hypot(vx, vz) || 1;
          v.applyKnockback(vx / vl, vz / vl, YETI_PUSH, YETI_PUSH_UP);
        } catch (e) {}
      }
      try { boss.dimension.playSound("mob.wolf.shake", boss.location); } catch (e) {}
    }
  }
}, YETI_PULSE_TICKS);
