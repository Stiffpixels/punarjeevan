import { playAnimIfNotPlaying } from "../utils.js";

const slimeComponent = (k, pos) => {
  return [
    k.sprite("assets", { anim: "slime-idle-down" }),
    k.area({ shape: new k.Rect(k.vec2(0, 8), 16, 8) }),
    k.body(),
    k.pos(pos),
    k.offscreen({ hide: true }),
    k.health(3),
    k.state("idle", ["idle", "left", "right", "up", "down"]),
    k.opacity(),
    {
      isAttacking: false,
      waitingTime: ((Math.random() * 10) % 3) + 1,
      movementSpeed: 20,
      direction: "down",
    },
    "slime",
  ];
};

export const setSlimeAI = (k, slime) => {
  k.onUpdate(() => {
    switch (slime.state) {
      case "left":
        slime.move(-slime.movementSpeed, 0);
        break;
      case "right":
        slime.move(slime.movementSpeed, 0);
        break;
      case "down":
        slime.move(0, slime.movementSpeed);
        break;
      case "up":
        slime.move(0, -slime.movementSpeed);
        break;
      default:
    }
  });

  const slimeDirections = ["left", "right", "down", "up"];

  slime.onStateEnter("idle", async () => {
    slime.stop();
    switch (slime.direction) {
      case "left":
        slime.flipX = true;
        break;
      default:
        slime.flipX = false;
    }
    playAnimIfNotPlaying(slime, `slime-idle-${slime.direction}`);
    await k.wait(1);
    slime.enterState(slimeDirections[Math.floor((Math.random() * 10) % 4)]);
  });
  slime.onStateEnter("left", async () => {
    slime.flipX = true;
    slime.direction = "left";
    playAnimIfNotPlaying(slime, "slime-move-horizontal");
    await k.wait(slime.waitingTime);
    slime.enterState("idle");
  });
  slime.onStateEnter("right", async () => {
    slime.flipX = false;
    slime.direction = "right";
    playAnimIfNotPlaying(slime, "slime-move-horizontal");
    await k.wait(slime.waitingTime);
    slime.enterState("idle");
  });
  slime.onStateEnter("down", async () => {
    slime.flipX = false;
    slime.direction = "down";
    playAnimIfNotPlaying(slime, "slime-move-down");
    await k.wait(slime.waitingTime);
    slime.enterState("idle");
  });
  slime.onStateEnter("up", async () => {
    slime.flipX = false;
    slime.direction = "up";
    playAnimIfNotPlaying(slime, "slime-move-up");
    await k.wait(slime.waitingTime);
    slime.enterState("idle");
  });
};

export default slimeComponent;
