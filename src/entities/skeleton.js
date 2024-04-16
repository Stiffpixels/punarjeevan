import { playAnimIfNotPlaying } from "../utils.js";

const getSkeletonComponent = (k, pos) => {
  return [
    k.sprite("assets", { anim: "skeleton-idle-down" }),
    k.area({ shape: new k.Rect(k.vec2(2, 2), 10, 14) }),
    k.body(),
    k.health(3),
    k.pos(pos),
    k.state("idle", ["idle", "left", "right", "up", "down", "attacking"]),
    {
      isAttacking: false,
      direction: "down",
      waitTime: 0.5,
      movementSpeed: 10,
    },
    "skeleton",
  ];
};

const getSkeletonAttackAnimation = (
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
    "skeleton-attack",
  ];
};

export const setSkeletonAI = (k, skeleton, player) => {
  const skeletonDirections = ["up", "down", "left", "right"];

  k.onUpdate(() => {
    switch (skeleton.state) {
      case "left":
        skeleton.move(-skeleton.movementSpeed, 0);
        break;
      case "right":
        skeleton.move(skeleton.movementSpeed, 0);
        break;
      case "up":
        skeleton.move(0, -skeleton.movementSpeed);
        break;
      case "down":
        skeleton.move(0, skeleton.movementSpeed);
        break;
    }
  });

  skeleton.onStateEnter("idle", async () => {
    skeleton.stop();
    switch (skeleton.direction) {
      case "left":
        skeleton.flipX = true;
        playAnimIfNotPlaying(skeleton, `skeleton-idle-right`);
        break;
      default:
        skeleton.flipX = false;
        playAnimIfNotPlaying(skeleton, `skeleton-idle-${skeleton.direction}`);
    }

    await k.wait(0.3);
    if (
      Math.abs(player.pos.x - skeleton.pos.x) +
        Math.abs(player.pos.y - skeleton.pos.y) <
        80 &&
      !skeleton.isAttacking
    ) {
      skeleton.enterState("attacking");
      return;
    }
    skeleton.enterState(
      skeletonDirections[Math.floor(Math.random() * skeletonDirections.length)]
    );
  });
  skeleton.onStateEnter("up", async () => {
    skeleton.direction = "up";
    playAnimIfNotPlaying(skeleton, "skeleton-move-up");
    await k.wait(skeleton.waitTime);
    skeleton.enterState("idle");
  });
  skeleton.onStateEnter("down", async () => {
    skeleton.direction = "down";
    playAnimIfNotPlaying(skeleton, "skeleton-move-down");
    await k.wait(skeleton.waitTime);
    skeleton.enterState("idle");
  });
  skeleton.onStateEnter("left", async () => {
    skeleton.direction = "left";
    skeleton.flipX = true;
    playAnimIfNotPlaying(skeleton, "skeleton-move-right");
    await k.wait(skeleton.waitTime);
    skeleton.enterState("idle");
  });
  skeleton.onStateEnter("right", async () => {
    skeleton.direction = "right";
    skeleton.flipX = false;
    playAnimIfNotPlaying(skeleton, "skeleton-move-right");
    await k.wait(skeleton.waitTime);
    skeleton.enterState("idle");
  });

  skeleton.onStateEnter("attacking", async () => {
    const directionX = player.pos.x - skeleton.pos.x;
    const directionY = player.pos.y - skeleton.pos.y;
    if (directionY > -15 && directionY < 15) {
      if (directionX < 0) {
        skeleton.flipX = true;
        skeleton.direction = "left";
        playAnimIfNotPlaying(skeleton, "skeleton-move-right");
      } else {
        skeleton.flipX = false;
        skeleton.direction = "right";
        playAnimIfNotPlaying(skeleton, "skeleton-move-right");
      }
    } else if (directionY < 0) {
      skeleton.direction = "up";
      playAnimIfNotPlaying(skeleton, "skeleton-move-up");
    } else if (directionY > 0) {
      skeleton.direction = "down";
      playAnimIfNotPlaying(skeleton, "skeleton-move-down");
    }
    if (Math.abs(directionX) + Math.abs(directionY) > 30) {
      await k.tween(
        skeleton.pos,
        k.vec2(player.pos.x - 10, player.pos.y - 10),
        1.5,
        (newPos) => {
          skeleton.pos = newPos;
        },
        k.easings.linear
      );
      skeleton.stop();
    }

    skeleton.isAttacking = true;
    if (k.get("skeleton-attack").length === 0 && skeleton.parent) {
      switch (skeleton.direction) {
        case "left":
          k.add(
            getSkeletonAttackAnimation(
              k,
              "right",
              k.vec2(skeleton.pos.x - 12, skeleton.pos.y),
              true
            )
          );
          break;
        case "right":
          k.add(
            getSkeletonAttackAnimation(
              k,
              "right",
              k.vec2(skeleton.pos.x + 12, skeleton.pos.y)
            )
          );
          break;
        case "up":
          k.add(
            getSkeletonAttackAnimation(
              k,
              "down",
              k.vec2(skeleton.pos.x, skeleton.pos.y - 12)
            )
          );
          break;
        case "down":
          k.add(
            getSkeletonAttackAnimation(
              k,
              "down",
              k.vec2(skeleton.pos.x, skeleton.pos.y + 12),
              false,
              true
            )
          );
          break;
      }
      await k.wait(0.3);
      k.destroyAll("skeleton-attack");
    }

    skeleton.isAttacking = false;
    skeleton.enterState("idle");
  });
};

export default getSkeletonComponent;
