import { playerStates } from "./states/stateManager.js";

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

export const getFireBall = (
  k,
  pos,
  direction = "right",
  flipX = false,
  flipY = true
) => {
  return [
    k.sprite("assets", { anim: `fire-ball-${direction}`, flipX, flipY }),
    k.area({ shape: new k.Rect(k.vec2(1, 2), 6, 6) }),
    k.pos(pos),
    "fire-ball",
  ];
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

export const renderCenterText = async (
  k,
  text,
  offsetX = 330,
  offsetXSubtitle = 200,
  startGame = false
) => {
  colorizeBackground(k, 0, 0, 0);
  const textBox = k.add([
    k.text("", { size: 80, font: "gameboy", width: 900 }),
    k.pos(k.center().x - offsetX, k.center().y - 50),
  ]);

  for (const char of text) {
    textBox.text += char;
    await k.wait(0.1);
  }
  k.add([
    k.text("Press Space to Continue", { size: 20 }),
    k.pos(textBox.pos.x + offsetXSubtitle, textBox.pos.y + 300),
  ]);

  k.onKeyPress("space", () => {
    if (startGame) {
      k.go("prologue");
      return;
    }
    playerStates.setPlayerDamage = 0;
    k.go("overWorld");
  });
};

export const renderDialogue = (k, lines, pos, player = null, fontSize = 10) => {
  const dialogueBox = k.add([
    k.rect(1000, 115),
    k.pos(140, k.center().y + 240),
    k.fixed(),
  ]);
  let linesIndex = 0;
  const { x, y } = pos;
  const dialogueText = k.add([
    k.text(lines[linesIndex], {
      size: fontSize,
      width: 320,
      font: "sans-serif",
    }),
    k.color(20, 16, 19),
    k.pos(x, y),
  ]);
  console.log(dialogueText.text);

  if (player) player.frozen = true;
  const dialogueKeyBind = k.onKeyPress("space", () => {
    if (linesIndex === lines.length - 1) {
      dialogueKeyBind.cancel();
      dialogueBox.destroy();
      dialogueText.destroy();
      if (player) player.frozen = false;
    } else {
      linesIndex++;
      dialogueText.text = lines[linesIndex];
    }
  });
};

export const renderHealthbar = (k, heartType = "player-heart", pos, entity) => {
  if (!pos) pos = k.vec2(0, 0);
  for (let i = 0; i < entity.hp(); i++) {
    k.add([
      k.sprite("health-heart", { anim: heartType }),
      k.pos(pos.x + i * 27, pos.y),
      k.scale(3, 3),
      k.fixed(),
      k.z(2),
      heartType,
    ]);
  }
};

export const onAttacked = async (k, attacker, entity) => {
  if (entity.isAttacking || entity?.frozen) return;
  entity.hurt(attacker.attackPower);
  if (entity.is("demonKing")) {
    k.destroyAll("demon-heart");
    renderHealthbar(k, "demon-heart", k.vec2(k.width() - 150, 20), entity);
  }
  blinkEffect(k, entity);
  if (entity.hp() <= 0) {
    if (entity.is("mage")) {
      playerStates.setMageDefeated = true;
    }
    await k.wait(0.1);
    k.destroy(entity);
  }
};
