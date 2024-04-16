import fetchMapData, {
  drawTiles,
  colorizeBackground,
  drawBoundaries,
  renderDialogue,
  renderHealthbar,
} from "../utils.js";
import generatePlayerComponent, { setPlayerStates } from "../entities/plato.js";
import { playerStates } from "../states/stateManager.js";
import getSkeletonComponent, { setSkeletonAI } from "../entities/skeleton.js";
import getDemonKingComponent, {
  setDemonKingAI,
} from "../entities/demonKing.js";

const dungeon = async (k) => {
  colorizeBackground(k, 139, 147, 175);
  const mapData = await fetchMapData("./assets/maps/dungeon.json");
  const map = k.add([k.pos(0, 0)]);
  const entities = { player: null, skeletons: [], demonKing: null };
  for (const layer of mapData.layers) {
    if (layer.name === "objectBounds") {
      drawBoundaries(k, map, layer);
      continue;
    }
    if (layer.name === "spawnPoints") {
      for (const object of layer.objects) {
        if (object.name === "player") {
          entities.player = map.add(
            generatePlayerComponent(k, k.vec2(object.x, object.y))
          );
          setPlayerStates(k, entities.player, map);
          entities.player.hurt(playerStates.getPlayerDamage);
          renderHealthbar(k, "player-heart", k.vec2(20, 20), entities.player);
        }
        if (object.name === "skeleton") {
          entities.skeletons.push(
            map.add(getSkeletonComponent(k, k.vec2(object.x, object.y)))
          );
        }
        if (object.name === "demonKing") {
          entities.demonKing = map.add(
            getDemonKingComponent(k, k.vec2(object.x, object.y))
          );
          setDemonKingAI(k, entities.demonKing, entities.player);
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

  k.camScale(3);
  k.camPos(entities.player.worldPos());

  for (const skeleton of entities.skeletons) {
    setSkeletonAI(k, skeleton, entities.player, map);
  }

  entities.player.onCollide("demon-barrier", (demonBarrier) => {
    if (playerStates.getDemonDefeated) {
      demonBarrier.unuse("body");
      demonBarrier.unuse("area");
    }
  });

  k.onUpdate(async () => {
    if (playerStates.getDemonDefeated) {
      entities.player.frozen = true;
      await k.wait(0.5);
      k.go("thankyou");
    }
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

export default dungeon;
