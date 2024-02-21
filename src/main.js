import k from "./kaboomContext.js";
import overWorld from "./scenes/overWorld.js";
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
};

for (const sceneName in scenes) {
  k.scene(sceneName, () => scenes[sceneName](k));
}

k.go("overWorld");
