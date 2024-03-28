import k from "./kaboomContext.js";
import overWorld from "./scenes/overWorld.js";
import prologue from "./scenes/prologue.js";
import house from "./scenes/house.js";
k.loadSprite("assets", "./assets/punarjeevan.png", {
  sliceX: 31,
  sliceY: 31,
  anims: {
    "player-idle-down": 65,
    "player-idle-up": 128,
    "player-idle-right": 66,
    "player-move-down": { from: 96, to: 98 },
    "player-move-up": { from: 127, to: 129 },
    "player-move-right": { from: 66, to: 69 },
    "slime-idle-down": 279,
    "slime-idle-up": 310,
    "slime-idle-left": 249,
    "slime-idle-right": 249,
    "slime-move-horizontal": { from: 249, to: 252, loop: true },
    "slime-move-down": { from: 279, to: 282, loop: true },
    "slime-move-up": { from: 310, to: 313, loop: true },
    "maya-right-idle": 42,
    "maya-idle-down": 223,
    "jamie-idle-down": 255,
    "jamie-idle-right": 256,
  },
});

k.loadSprite("cityCutscene", "./assets/cityScene1Anim.png", {
  sliceX: 6,
  sliceY: 2,
  anims: {
    "city-scene-idle": 0,
    "city-scene-end": 11,
    "city-scene1": { from: 0, to: 4 },
    "city-scene2": { from: 6, to: 11 },
  },
});

k.loadSpriteAtlas("./assets/punarjeevan.png", {
  "plato-Attacking-down": {
    x: 96,
    y: 48,
    width: 128,
    height: 32,
    sliceX: 4,
    anims: {
      "player-attack-idle": 0,
      "player-attack": { from: 0, to: 3 },
    },
  },
  "plato-Attacking-up": {
    x: 48,
    y: 80,
    width: 128,
    height: 32,
    sliceX: 4,
    anims: {
      "player-attack-idle": 0,
      "player-attack": { from: 0, to: 3 },
    },
  },
  "plato-Attacking-left": {
    x: 224,
    y: 48,
    width: 128,
    height: 16,
    sliceX: 4,
    anims: {
      "player-attack-idle": 0,
      "player-attack": { from: 0, to: 3 },
    },
  },
  "plato-Attacking-right": {
    x: 128,
    y: 32,
    width: 128,
    height: 16,
    sliceX: 4,
    anims: {
      "player-attack-idle": 0,
      "player-attack": { from: 0, to: 3 },
    },
  },
});

const scenes = {
  overWorld,
  prologue,
  house,
};

for (const sceneName in scenes) {
  k.scene(sceneName, () => scenes[sceneName](k));
}

k.go("house");
