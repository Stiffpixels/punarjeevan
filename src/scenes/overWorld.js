import fetchMapData, {
  drawTiles,
  colorizeBackground,
  drawBoundaries,
} from "../utils.js";
import generatePlayerComponent, { setPlayerStates } from "../entities/plato.js";
import slimeComponent, { setSlimeAI } from "../entities/slime.js";

const overWorld = async (k) => {
  colorizeBackground(k, 20, 16, 19);
  const mapData = await fetchMapData("./assets/maps/overworld.json");
  const map = k.add([k.pos(0, 0)]);
  const entities = { player: null, slimes: [] };
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
          setPlayerStates(k, entities.player, map);
        }
        if (object.name === "slime") {
          entities.slimes.push(
            map.add(slimeComponent(k, k.vec2(object.x, object.y)))
          );
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

  for (const slime of entities.slimes) {
    setSlimeAI(k, slime);
  }

  k.onUpdate(() => {
    if (entities.player.pos.x < 528) {
      entities.player.frozen = true;
      // for (const slime in entities.slimes) {
      //   slime.stop();
      // }
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

export default overWorld;
