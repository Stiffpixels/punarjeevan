import { playerStates } from "../states/stateManager.js";
import {
  getFireBall,
  playAnimIfNotPlaying,
  renderHealthbar,
} from "../utils.js";

const getDemonKingComponent = (k, pos) => {
  return [
    k.sprite("demon-king", { anim: "demonKing-idle-down" }),
    k.area({ shape: new k.Rect(k.vec2(8, 11), 17, 18) }),
    k.body(),
    k.pos(pos),
    k.health(5),
    k.state("idle", ["idle", "attacking"]),
    "demonKing",
  ];
};

const setMovementAnimation = (player, demonKing) => {
  const distanceX = player.pos.x - demonKing.pos.x;
  const distanceY = player.pos.y - demonKing.pos.y;
  if (distanceY > -15 && distanceY < 15) {
    if (distanceX < 0) {
      demonKing.flipX = true;
      demonKing.direction = "left";
      playAnimIfNotPlaying(demonKing, "demonKing-move-right");
    } else {
      demonKing.flipX = false;
      demonKing.direction = "right";
      playAnimIfNotPlaying(demonKing, "demonKing-move-right");
    }
  } else if (distanceY < 0) {
    demonKing.direction = "up";
    playAnimIfNotPlaying(demonKing, "demonKing-move-up");
  } else if (distanceY > 0) {
    demonKing.direction = "down";
    playAnimIfNotPlaying(demonKing, "demonKing-move-down");
  }
};

const getdemonKingAttackAnimation = (
  k,
  direction,
  pos,
  flipValueX = false,
  flipValueY = false
) => {
  let boxX = 5;
  let boxY = 14;
  if (direction === "up" || direction === "down") {
    boxX = 14;
    boxY = 5;
  }
  return [
    k.sprite("assets", {
      anim: `skeleton-attack-${direction}`,
      flipX: flipValueX,
      flipY: flipValueY,
    }),
    k.pos(pos),
    k.area({ shape: new k.Rect(k.vec2(2, 2), boxX, boxY) }),
    k.z(2),
    "demonKing-attack",
  ];
};

const evadePlayer = async (k, demonKing, player) => {
  const coinToss = Math.floor(Math.random() * 2);

  const evadeToPos = k.vec2(
    player.pos.x + (coinToss === 1 ? 40 : 0),
    player.pos.y + (coinToss === 1 ? 0 : -40)
  );

  const prevdemonKingPos = demonKing.pos;
  let getBackToOriginalPos = false;
  const evade = k.tween(
    demonKing.pos,
    evadeToPos,
    1.2,
    (newPos) => {
      while (!demonKing.getCollisions().length === 0) {
        getBackToOriginalPos = true;
        continue;
      }
      demonKing.pos = newPos;
    },
    k.easings.linear
  );

  await k.wait(1);
  evade.cancel();
  if (getBackToOriginalPos) {
    k.tween(
      demonKing.pos,
      prevdemonKingPos,
      1.5,
      (newPos) => {
        demonKing.pos = newPos;
      },
      k.easings.linear
    );
  }
};

export const setDemonKingAI = (k, demonKing, player) => {
  let healthbarRendered = false;
  const idleState = demonKing.onStateEnter("idle", async () => {
    const distanceX = Math.abs(player.pos.x - demonKing.pos.x);
    const distanceY = Math.abs(player.pos.y - demonKing.pos.y);

    if (distanceX + distanceY < 100) {
      demonKing.enterState("attacking");
      if (k.get("demon-barrier").length === 0) {
        k.add([
          k.area({ shape: new k.Rect(k.vec2(0, 0), 50, 18) }),
          k.pos(335, 240),
          k.body({ isStatic: true }),
          "demon-barrier",
        ]);
      }
      return;
    }
    await k.wait(0.3);
    demonKing.enterState("idle");
  });

  const attackingState = demonKing.onStateEnter("attacking", async () => {
    const distanceX = Math.abs(player.pos.x - demonKing.pos.x);
    const distanceY = Math.abs(player.pos.y - demonKing.pos.y);
    const coinToss = Math.floor(Math.random() * 2);

    if (!healthbarRendered) {
      renderHealthbar(k, "demon-heart", k.vec2(k.width() - 150, 20), demonKing);
    }

    if (coinToss === 0) {
      setMovementAnimation(player, demonKing);
      if (Math.abs(distanceX) + Math.abs(distanceY) > 30) {
        await k.tween(
          demonKing.pos,
          k.vec2(player.pos.x - 10, player.pos.y - 10),
          1.5,
          (newPos) => {
            demonKing.pos = newPos;
          },
          k.easings.linear
        );
        demonKing.stop();
      }
      demonKing.isAttacking = true;
      if (k.get("demonKing-attack").length === 0 && demonKing.parent) {
        switch (demonKing.direction) {
          case "left":
            k.add(
              getdemonKingAttackAnimation(
                k,
                "right",
                k.vec2(demonKing.pos.x - 21, demonKing.pos.y + 10),
                true
              )
            );
            break;
          case "right":
            k.add(
              getdemonKingAttackAnimation(
                k,
                "right",
                k.vec2(demonKing.pos.x + 21, demonKing.pos.y + 10)
              )
            );
            break;
          case "up":
            k.add(
              getdemonKingAttackAnimation(
                k,
                "down",
                k.vec2(demonKing.pos.x + 7, demonKing.pos.y - 10)
              )
            );
            break;
          case "down":
            k.add(
              getdemonKingAttackAnimation(
                k,
                "down",
                k.vec2(demonKing.pos.x + 7, demonKing.pos.y + 28),
                false,
                true
              )
            );
            break;
        }
        await k.wait(0.3);
        k.destroyAll("demonKing-attack");
        demonKing.isAttacking = false;
      }
    }

    if (coinToss === 1) {
      setMovementAnimation(player, demonKing);
      await evadePlayer(k, demonKing, player);
      const fireballPositions = [
        k.vec2(demonKing.pos.x + 10, demonKing.pos.y - 15),
        k.vec2(demonKing.pos.x + 25, demonKing.pos.y),
        k.vec2(demonKing.pos.x + 10, demonKing.pos.y + 15),
        k.vec2(demonKing.pos.x - 5, demonKing.pos.y),
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
            fireball = k.add(
              getFireBall(k, fireballPositions[i], "right", true)
            );
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
    }

    demonKing.enterState("idle");
  });
  demonKing.onDestroy(() => {
    idleState.cancel();
    attackingState.cancel();
    playerStates.setDemonDefeated = true;
  });
};

export default getDemonKingComponent;
