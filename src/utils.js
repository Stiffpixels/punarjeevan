export const colorizeBackground = (k, r, g, b) => {
  return k.add([
    k.rect(k.canvas.width, k.canvas.height),
    k.color(r, g, b),
    k.fixed(),
  ]);
};

export default async function fetchMapData(mapPath) {
  return await (await fetch(mapPath)).json();
}

export const playAnimIfNotPlaying = (gameObj, animName) => {
  if (gameObj.curAnim() !== animName) gameObj.play(animName);
};

const drawCollider = (k, objectWidth, objectHeight, pos, tag) => {
  return [
    k.area({ shape: new k.Rect(k.vec2(0), objectWidth, objectHeight) }),
    k.pos(pos),
    k.body({ isStatic: true }),
    k.offscreen({ hide: true }),
    tag,
  ];
};

export const drawBoundaries = (k, map, layer) => {
  for (const object of layer.objects) {
    map.add(
      drawCollider(
        k,
        object.width,
        object.height,
        k.vec2(object.x, object.y + 16),
        object.name
      )
    );
  }
};

export const drawTiles = (k, map, layer, tileWidth, tileHeight, zIndex) => {
  let numOfTilesDrawn = 0;
  const tilePos = k.vec2(0, 0);
  for (const tile of layer.data) {
    if (numOfTilesDrawn % layer.width === 0) {
      tilePos.x = 0;
      tilePos.y += tileHeight;
    } else {
      tilePos.x += tileWidth;
    }
    numOfTilesDrawn++;
    if (tile === 0) continue;
    if (zIndex) {
      map.add([
        k.sprite("assets", { frame: tile - 1 }),
        k.pos(tilePos),
        k.offscreen({ hide: true }),
        k.z(zIndex),
      ]);
      continue;
    }
    map.add([
      k.sprite("assets", { frame: tile - 1 }),
      k.pos(tilePos),
      k.offscreen({ hide: true }),
    ]);
  }
};

export const blinkEffect = async (k, entity) => {
  k.tween(
    0,
    1,
    0.1,
    (newOpacity) => {
      entity.opacity = newOpacity;
    },
    k.easings.linear()
  );
};

export const onAttacked = async (k, attacker, entity) => {
  if (entity.isAttacking) return;
  entity.hurt(attacker.attackPower);
  blinkEffect(k, entity);
  if (entity.hp() <= 0) {
    await k.wait(0.1);
    k.destroy(entity);
  }
};
