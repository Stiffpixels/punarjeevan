import fetchMapData, {
  drawTiles,
  colorizeBackground,
  drawBoundaries,
  renderDialogue,
  renderHealthbar,
} from "../utils.js";
import generatePlayerComponent, { setPlayerStates } from "../entities/plato.js";
import slimeComponent, { setSlimeAI } from "../entities/slime.js";
import { playerStates } from "../states/stateManager.js";
import getMageComponent, { setMageAI } from "../entities/mage.js";

const overWorld = async (k) => {
  colorizeBackground(k, 20, 16, 19);
  const mapData = await fetchMapData("./assets/maps/overworld.json");
  const map = k.add([k.pos(0, 0)]);
  const entities = { player: null, slimes: [], mage: null };
  for (const layer of mapData.layers) {
    if (layer.name === "ObjectBounds") {
      drawBoundaries(k, map, layer);
      continue;
    }
    if (layer.name === "SpawnPoints") {
      for (const object of layer.objects) {
        if (object.name === "player") {
          entities.player = map.add(
            generatePlayerComponent(k, k.vec2(object.x, object.y))
          );
          entities.player.hurt(playerStates.getPlayerDamage);
          setPlayerStates(k, entities.player, map);
          renderHealthbar(k, "player-heart", k.vec2(20, 20), entities.player);
        }
        if (object.name === "slime" && playerStates.swordEquipped) {
          entities.slimes.push(
            map.add(slimeComponent(k, k.vec2(object.x, object.y)))
          );
        }
        if (object.name === "mage") {
          entities.mage = map.add(getMageComponent(k, [object.x, object.y]));
          setMageAI(k, entities.mage, entities.player);
        }
      }
      continue;
    }
    if (layer.name === "Top Layer") {
      drawTiles(k, map, layer, mapData.tilewidth, mapData.tileheight, 2);
      continue;
    }
    drawTiles(k, map, layer, mapData.tilewidth, mapData.tileheight);
  }
  if (!playerStates.swordEquipped)
    map.add([
      k.sprite("assets", { anim: "maya-right-idle" }),
      k.pos(entities.player.pos.x - 300, entities.player.pos.y + 50),
      k.area({ shape: new k.Rect(k.vec2(3, 3), 10, 12) }),
      k.body({ isStatic: true }),
    ]);
  k.camScale(3);
  k.camPos(entities.player.worldPos());

  for (const slime of entities.slimes) {
    setSlimeAI(k, slime);
  }

  const wakeUpLines = [
    "wha.. where is this place, am I in heaven?[press space to continue]",
    "In anycase I must look around to find out myself",
  ];
  const convoWithMayaLines = [
    "Lady: Hey! you what are you doing in these parts? Don't you know this area is restricted and dangerous for common folk?",
    "Plato: I don't know myself I've never been to this place either, I just woke up here near that house.",
    "Lady: How can that be possible? Anyways come with me thats my father's house its too dangerous to talk here.",
    "Plato: Sure I don't perticularly want to get eaten by slime monsters.",
  ];
  if (!playerStates.swordEquipped) {
    renderDialogue(k, wakeUpLines, { x: 624, y: 295 }, entities.player);
  }

  const convoWithMaya = async () => {
    renderDialogue(
      k,
      convoWithMayaLines,
      {
        x: entities.player.worldPos().x - 160,
        y: entities.player.worldPos().y + 90,
      },
      entities.player
    );
    const trackSpaceCount = k.onKeyPress("space", () => {
      convoWithMayaCount++;
      if (convoWithMayaCount === convoWithMayaLines.length) {
        trackSpaceCount.cancel();
        k.go("house");
      }
    });
  };

  let convoWithMayaCount = 1;
  const checkPlayerPos = k.onUpdate(async () => {
    if (entities.player.pos.x < 528 && !playerStates.swordEquipped) {
      entities.player.frozen = true;
      await convoWithMaya();
      checkPlayerPos.cancel();
    }
  });

  entities.player.onCollide("houseEntrance", () => {
    if (playerStates.swordEquipped) {
      playerStates.setPlayerDamage = 5 - entities.player.hp();
      k.go("house");
      return;
    }
    renderDialogue(
      k,
      ["You knock on the door.......no response."],
      {
        x: 624,
        y: 288,
      },
      entities.player
    );
  });

  entities.player.onCollide("mage-gate", (mageGate) => {
    if (playerStates.getMageDefeated) {
      mageGate.unuse("body");
      mageGate.unuse("area");
      return;
    }
    renderDialogue(
      k,
      ["Defeat the mage first!"],
      {
        x: entities.player.worldPos().x - 160,
        y: entities.player.worldPos().y + 90,
      },
      entities.player
    );
  });

  entities.player.onCollide("dungeonEntrance", () => {
    playerStates.setPlayerDamage = 5 - entities.player.hp();
    k.go("dungeon");
  });

  k.onUpdate(() => {
    if (entities.player.pos.dist(k.camPos()) && !entities.player.frozen) {
      k.tween(
        k.camPos(),
        entities.player.worldPos(),
        0.1,
        (newPos) => k.camPos(newPos),
        k.easings.linear()
      );
    }
  });
};

export default overWorld;
