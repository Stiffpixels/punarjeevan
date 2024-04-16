import { getFireBall, playAnimIfNotPlaying } from "../utils.js";

const getMageComponent = (k, pos) => {
  return [
    k.sprite("assets", { anim: "mage-idle-right" }),
    k.area({ shape: new k.Rect(k.vec2(3, 4), 10, 14) }),
    k.body(),
    k.pos(pos),
    k.health(3),
    { isAttacking: false, attackPower: 2 },
    k.state("idle", ["idle", "attack", "evade"]),
    "mage",
  ];
};

export const setMageAI = (k, mage, player) => {
  const idleState = mage.onStateEnter("idle", async () => {
    mage.stop();
    const distanceX = Math.abs(player.pos.x - mage.pos.x);
    const distanceY = Math.abs(player.pos.y - mage.pos.y);
    if (
      distanceX + distanceY < 100 &&
      (mage.state !== "attack" || mage.state !== "evade")
    ) {
      mage.enterState("attack");
      return;
    }
    await k.wait(1);
    mage.enterState("idle");
  });

  const attackingState = mage.onStateEnter("attack", async () => {
    const fireballPositions = [
      k.vec2(mage.pos.x, mage.pos.y - 20),
      k.vec2(mage.pos.x + 20, mage.pos.y),
      k.vec2(mage.pos.x, mage.pos.y + 20),
      k.vec2(mage.pos.x - 20, mage.pos.y),
    ];

    for (let i = 0; i < 4; i++) {
      let fireball;
      switch (i) {
        case 0:
          fireball = k.add(
            getFireBall(k, fireballPositions[i], "down", false, true)
          );
          k.tween(
            fireball.pos,
            k.vec2(fireballPositions[i].x, fireballPositions[i].y - 40),
            0.2,
            (newPos) => (fireball.pos = newPos)
          );
          break;
        case 1:
          fireball = k.add(getFireBall(k, fireballPositions[i], "right"));
          k.tween(
            fireball.pos,
            k.vec2(fireballPositions[i].x + 40, fireballPositions[i].y),
            0.2,
            (newPos) => (fireball.pos = newPos)
          );
          break;
        case 2:
          fireball = k.add(getFireBall(k, fireballPositions[i], "down"));
          k.tween(
            fireball.pos,
            k.vec2(fireballPositions[i].x, fireballPositions[i].y + 40),
            0.2,
            (newPos) => (fireball.pos = newPos)
          );
          break;
        case 3:
          fireball = k.add(getFireBall(k, fireballPositions[i], "right", true));
          k.tween(
            fireball.pos,
            k.vec2(fireballPositions[i].x - 40, fireballPositions[i].y),
            0.2,
            (newPos) => {
              fireball.pos = newPos;
            }
          );
          break;
      }
    }
    await k.wait(0.5);
    k.destroyAll("fire-ball");
    mage.enterState("evade");
  });

  const evadeState = mage.onStateEnter("evade", async () => {
    const directionX = player.pos.x - mage.pos.x;
    const directionY = player.pos.y - mage.pos.y;
    if (directionY > -15 && directionY < 15) {
      if (directionX < 0) {
        mage.flipX = true;
        mage.direction = "left";
        playAnimIfNotPlaying(mage, "mage-move-right");
      } else {
        mage.flipX = false;
        mage.direction = "right";
        playAnimIfNotPlaying(mage, "mage-move-right");
      }
    } else if (directionY < 0) {
      mage.direction = "up";
      playAnimIfNotPlaying(mage, "mage-move-up");
    } else if (directionY > 0) {
      mage.direction = "down";
      playAnimIfNotPlaying(mage, "mage-move-down");
    }
    const coinToss = Math.floor(Math.random() * 2);
    const evadeToPos = k.vec2(
      player.pos.x + (coinToss === 1 ? 40 : 0),
      player.pos.y + (coinToss === 1 ? 0 : -40)
    );

    const prevMagePos = mage.pos;
    let getBackToOriginalPos = false;
    const evade = k.tween(
      mage.pos,
      evadeToPos,
      1,
      (newPos) => {
        while (!mage.getCollisions().length === 0) {
          getBackToOriginalPos = true;
          continue;
        }
        mage.pos = newPos;
      },
      k.easings.linear
    );

    await k.wait(1);
    evade.cancel();
    if (getBackToOriginalPos) {
      k.tween(
        mage.pos,
        prevMagePos,
        1.5,
        (newPos) => {
          mage.pos = newPos;
        },
        k.easings.linear
      );
    }

    mage.enterState("idle");
  });

  mage.onDestroy(() => {
    idleState.cancel();
    attackingState.cancel();
    evadeState.cancel();
  });
};

export default getMageComponent;
