# CatWars Bosses (Minecraft Bedrock Add-On)

Four-boss add-on for Minecraft Bedrock: Bastet (cat goddess), Fire Dragon,
Yeti, and the Water-Fire Knight.

## Structure

```
behavior_packs/cw_bosses_bp/   <- behavior (logic, abilities, loot, scripts)
resource_packs/cw_bosses_rp/   <- resources (textures, models)
```

## Dev workflow (Mac -> Windows)

1. Edit on Mac, commit, push to GitHub.
2. On the Windows PC, `git pull` into the dev pack folders (see below).
3. In Minecraft, run `/reload` (or leave & re-enter the world) to apply.

### Windows dev pack folders (Bedrock from Microsoft Store)

```
%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_behavior_packs
%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_resource_packs
```

The two pack folders (`cw_bosses_bp`, `cw_bosses_rp`) go into those two
`development_*` folders respectively.

## Stage 1 test

The script `scripts/main.js` posts a chat message on spawn/load. If you see
"Mód běží!" in chat, the whole chain works and we can start building bosses.

## Requirements in-world

- Create the world with **Beta APIs** experiment ON (needed for scripting).
