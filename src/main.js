import k from "./kaboomContext.js";
import overWorld from "./scenes/overWorld.js";
import prologue from "./scenes/prologue.js";
import house from "./scenes/house.js";
import dungeon from "./scenes/dungeon.js";
import gameOver from "./scenes/GameOver.js";
import thankyou from "./scenes/thankyou.js";
import startScreen from "./scenes/startScreen.js";
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
    "skeleton-idle-down": 10,
    "skeleton-idle-up": 14,
    "skeleton-idle-right": 43,
    "skeleton-move-up": { from: 14, to: 17, loop: true },
    "skeleton-move-down": { from: 10, to: 13, loop: true },
    "skeleton-move-right": { from: 43, to: 46, loop: true },
    "skeleton-attack-right": { from: 47, to: 50, loop: true },
    "skeleton-attack-down": { from: 78, to: 81, loop: true },
    "mage-idle-right": 39,
    "fire-ball-right": { from: 236, to: 239, loop: true },
    "fire-ball-down": { from: 267, to: 270 },
    "mage-move-right": { from: 39, to: 40, loop: true },
    "mage-move-up": { from: 8, to: 9, loop: true },
    "mage-move-down": { from: 37, to: 38, loop: true },
  },
});

k.loadFont("gameboy", "./assets/gb.ttf");

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
  "health-heart": {
    x: 224,
    y: 64,
    width: 16,
    height: 6,
    sliceX: 2,
    anims: {
      "player-heart": 0,
      "demon-heart": 1,
    },
  },
  "demon-king": {
    x: 176,
    y: 80,
    width: 256,
    height: 64,
    sliceX: 8,
    sliceY: 2,
    anims: {
      "demonKing-idle-down": 0,
      "demonKing-move-right": { from: 8, to: 11, loop: true },
      "demonKing-move-up": { from: 4, to: 7, loop: true },
      "demonKing-move-down": { from: 0, to: 3, loop: true },
    },
  },
});

const scenes = {
  overWorld,
  prologue,
  house,
  dungeon,
  gameOver,
  thankyou,
  startScreen,
};

for (const sceneName in scenes) {
  k.scene(sceneName, () => scenes[sceneName](k));
}

k.go("startScreen");
