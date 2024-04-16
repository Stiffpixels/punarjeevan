import { playerStates } from "../states/stateManager.js";
import {
  blinkEffect,
  onAttacked,
  playAnimIfNotPlaying,
  renderHealthbar,
} from "../utils.js";

const generatePlayerComponent = (k, pos) => {
  return [
    k.sprite("assets", { anim: "player-idle-down" }),
    k.area({ shape: new k.Rect(k.vec2(3, 3), 10, 13) }),
    k.pos(pos),
    k.body(),
    k.opacity(),
    k.state("idle", ["idle", "moving", "attacking", "gettingAttacked"]),
    k.z(1),
    k.health(5),
    {
      speed: 60,
      isAttacking: false,
      direction: "down",
      attackPower: 1,
      frozen: false,
    },
    "plato",
  ];
};

export const setPlayerStates = (k, player, map) => {
  k.onMousePress("left", () => {
    if (
      player.state !== "attacking" &&
      player.frozen !== true &&
      playerStates.swordEquipped
    )
      player.enterState("attacking", map, player);
  });
  k.onKeyDown((key) => {
    if (
      (key === "w" || key === "a" || key === "s" || key === "d") &&
      player.frozen !== true
    ) {
      player.enterState("moving", key);
    }
  });

  k.onKeyRelease((key) => {
    if (key === "w" || key === "a" || key === "s" || key === "d") {
      player.enterState("idle");
    }
  });

  player.onCollide("slime", (slime) => {
    player.enterState("gettingAttacked", slime);
  });
  player.onCollide("skeleton-attack", () => {
    player.enterState("gettingAttacked", { attackPower: 1 });
  });
  player.onCollide("fire-ball", () => {
    player.enterState("gettingAttacked", { attackPower: 2 });
  });
  player.onCollide("demonKing-attack", () => {
    player.enterState("gettingAttacked", { attackPower: 2 });
  });

  player.onStateEnter("idle", () => {
    switch (player.direction) {
      case "down":
        playAnimIfNotPlaying(player, "player-idle-down");
        break;
      case "up":
        playAnimIfNotPlaying(player, "player-idle-up");
        break;
      case "left":
        playAnimIfNotPlaying(player, "player-idle-right");
        player.flipX = true;
        break;
      case "right":
        playAnimIfNotPlaying(player, "player-idle-right");
        player.flipX = false;
        break;
    }
  });

  player.onStateEnter("moving", (key) => {
    if (k.isKeyDown("w") && k.isKeyDown("a") && k.isKeyDown("d")) {
      player.enterState("idle");
      return;
    }
    if (k.isKeyDown("a") && k.isKeyDown("s") && k.isKeyDown("d")) {
      player.enterState("idle");
      return;
    }
    if (k.isKeyDown("w") && k.isKeyDown("a")) {
      playAnimIfNotPlaying(player, "player-move-up");
      player.move(-player.speed / 3, -player.speed / 3);
      player.direction = "up";
      return;
    }
    if (k.isKeyDown("d") && k.isKeyDown("s")) {
      playAnimIfNotPlaying(player, "player-move-down");
      player.move(player.speed / 3, player.speed / 3);
      player.direction = "down";
      return;
    }
    if (k.isKeyDown("w") && k.isKeyDown("d")) {
      playAnimIfNotPlaying(player, "player-move-up");
      player.move(player.speed / 3, -player.speed / 3);
      player.direction = "up";
      return;
    }
    if (k.isKeyDown("s") && k.isKeyDown("a")) {
      playAnimIfNotPlaying(player, "player-move-down");
      player.move(-player.speed / 3, player.speed / 3);
      player.direction = "down";
      return;
    }
    switch (key) {
      case "s":
        player.flipX = false;
        playAnimIfNotPlaying(player, "player-move-down");
        player.move(0, player.speed);
        player.direction = "down";
        break;
      case "w":
        player.flipX = false;
        playAnimIfNotPlaying(player, "player-move-up");
        player.move(0, -player.speed);
        player.direction = "up";
        break;
      case "a":
        playAnimIfNotPlaying(player, "player-move-right");
        player.flipX = true;
        player.direction = "left";
        player.move(-player.speed, 0);
        break;
      case "d":
        playAnimIfNotPlaying(player, "player-move-right");
        player.flipX = false;
        player.direction = "right";
        player.move(player.speed, 0);
    }
  });

  player.onStateEnter("attacking", async () => {
    player.frozen = true;

    const playerAttackProperties = {
      pos: k.pos(player.worldPos().x - 9, player.worldPos().y),
      area: k.area({ shape: new k.Rect(k.vec2(6, 17), 22, 9) }),
    };

    switch (player.direction) {
      case "up":
        playerAttackProperties.pos = k.pos(
          player.worldPos().x - 9,
          player.worldPos().y - 16
        );
        playerAttackProperties.area = k.area({
          shape: new k.Rect(k.vec2(6, 9), 22, 9),
        });
        break;
      case "left":
        playerAttackProperties.pos = k.pos(
          player.worldPos().x - 16,
          player.worldPos().y
        );
        playerAttackProperties.area = k.area({
          shape: new k.Rect(k.vec2(0, 7), 16, 9),
        });
        break;
      case "right":
        playerAttackProperties.pos = k.pos(
          player.worldPos().x,
          player.worldPos().y
        );
        playerAttackProperties.area = k.area({
          shape: new k.Rect(k.vec2(16, 7), 16, 9),
        });
        break;
    }

    const playerAttack = map.add([
      k.sprite(`plato-Attacking-${player.direction}`, {
        anim: "player-attack-idle",
      }),
      playerAttackProperties.area,
      playerAttackProperties.pos,
      "player-Attack",
    ]);
    player.opacity = 0;
    playerAttack.play("player-attack");
    playerAttack.onCollide("slime", (slime) => {
      onAttacked(k, player, slime);
    });
    playerAttack.onCollide("skeleton", (skeleton) => {
      onAttacked(k, player, skeleton);
    });
    playerAttack.onCollide("mage", (mage) => {
      onAttacked(k, player, mage);
    });
    playerAttack.onCollide("demonKing", (demonKing) => {
      onAttacked(k, player, demonKing);
    });
    await k.wait(0.5, () => {
      player.opacity = 1;
      k.destroy(playerAttack);
    });
    player.frozen = false;
    player.enterState("idle");
  });

  player.onStateEnter("gettingAttacked", async (entity) => {
    if (player.isAttacking) return;
    player.hurt(entity.attackPower);
    blinkEffect(k, player);
    await k.wait(0.1);
    k.destroyAll("player-heart");
    renderHealthbar(k, "player-heart", k.vec2(20, 20), player);
    if (player.hp() <= 0) {
      playerStates.setDemonDefeated = false;
      k.go("gameOver");
    }
  });
};

export default generatePlayerComponent;
