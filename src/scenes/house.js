import generatePlayerComponent, { setPlayerStates } from "../entities/plato.js";
import { playerStates } from "../states/stateManager.js";
import fetchMapData, {
  colorizeBackground,
  drawBoundaries,
  drawTiles,
  playAnimIfNotPlaying,
  renderDialogue,
} from "../utils.js";

const house = async (k) => {
  colorizeBackground(k, 20, 16, 19);
  const mapData = await fetchMapData("./assets/maps/house.json");
  const map = k.add([k.pos(0, 0)]);
  const entities = {
    player: null,
    jamie: null,
    maya: null,
  };
  const mayaLines1 = [
    "Welcome, I live here with my dad. ",
    "Please go talk with him, he might know a solution for your situation.[press space]",
  ];

  const jamieLines1 = [
    "Greetings, outsider my name is Jamie and I live as I am on a mission from the kingdom.",
    "I was defeated but there is still hope for you.",
    "Take this sword and head south into the dungeon.",
    "We are also trapped here as a very evil presence has made the dungeon its home.",
    "Defeat the evil and you can live a happy life in the kingdom.",
    "Also, press the left mouse button to use the sword.",
  ];
  for (const layer of mapData.layers) {
    if (layer.name === "spawnPoints") {
      for (const object of layer.objects) {
        if (object.name === "player") {
          if (entities.player !== null) {
            map.add(entities.player);

            continue;
          }

          entities.player = map.add(
            generatePlayerComponent(k, k.vec2(object.x, object.y))
          );
          entities.player.direction = "up";
          continue;
        }
        if (object.name === "jamie") {
          entities.jamie = map.add([
            k.sprite("assets", { anim: "jamie-idle-down" }),
            k.pos(k.vec2(object.x, object.y)),
            k.area({ shape: new k.Rect(k.vec2(3, 3), 10, 10) }),
            k.body({ isStatic: true }),
            "jamie",
          ]);
          continue;
        }
        if (object.name === "maya") {
          entities.maya = map.add([
            k.sprite("assets", { anim: "maya-idle-down" }),
            k.pos(k.vec2(object.x, object.y)),
            k.area({ shape: new k.Rect(k.vec2(3, 3), 10, 10) }),
            k.body({ isStatic: true }),
            "maya",
          ]);
        }
      }
      continue;
    }
    if (layer.name === "objectBounds") {
      drawBoundaries(k, map, layer);
      continue;
    }
    drawTiles(k, map, layer, mapData.tilewidth, mapData.tileheight);
  }
  entities.player.onCollide("houseExit", () => {
    if (playerStates.swordEquipped) {
      playerStates.prevScene = "house";
      k.go("overWorld");
    }
  });
  setPlayerStates(k, entities.player, map);

  entities.player.onCollide("maya", () => {
    entities.maya.flipX = false;
    playAnimIfNotPlaying(entities.maya, "maya-idle-down");
    if (entities.player.direction === "right") {
      entities.maya.flipX = true;
      playAnimIfNotPlaying(entities.maya, "maya-right-idle");
    }
    if (playerStates.swordEquipped) {
      renderDialogue(
        k,
        [
          "Oh sweet! you have a sword now. Hopefully you know how to use it.[press space to continue]",
        ],
        k.vec2(k.center().x - 360, k.center().y + 105),
        entities.player,
        5.5
      );
      return;
    }

    renderDialogue(
      k,
      mayaLines1,
      k.vec2(k.center().x - 360, k.center().y + 105),
      entities.player,
      6
    );
  });
  entities.player.onCollide("jamie", () => {
    playAnimIfNotPlaying(entities.jamie, "jamie-idle-down");
    if (entities.player.direction === "left") {
      playAnimIfNotPlaying(entities.jamie, "jamie-idle-right");
    }
    if (playerStates.swordEquipped) {
      renderDialogue(
        k,
        [
          "Forgotten how to use the sword have you? Click the left mouse button to use the sword.",
        ],
        k.vec2(k.center().x - 360, k.center().y + 105),
        entities.player,
        6
      );
      return;
    }

    renderDialogue(
      k,
      jamieLines1,
      k.vec2(k.center().x - 360, k.center().y + 105),
      entities.player,
      6
    );
    playerStates.swordEquipped = true;
  });

  k.camPos(k.vec2(k.center().x - 238, k.center().y + 40));
  k.camScale(4);
};

export default house;
