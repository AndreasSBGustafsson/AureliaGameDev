import { keys } from "../utils/Input";
import type { GameObject } from "./GameObject";
import { createGameObject } from "./GameObject";

export type AttackHitbox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const createPlayer = (): GameObject => {
  const player = createGameObject(
    100,
    500,
    50,
    100,
    (obj, dt) => {
      // Track spacebar press
      const spacePressed = keys[" "];

      // 1. Movement
      if (keys["ArrowLeft"]) {
        obj.x -= 200 * dt;
        obj.facing = "left";
      }
      if (keys["ArrowRight"]) {
        obj.x += 200 * dt;
        obj.facing = "right";
      }

      // 2. Gravity
      obj.velY += 800 * dt;
      obj.y += obj.velY * dt;

      // 3. Ground collision
      if (obj.y + obj.height >= 550) {
        obj.y = 550 - obj.height;
        obj.velY = 0;
        obj.grounded = true;
      } else {
        obj.grounded = false;
      }

      // 4. Jump
      if (keys["ArrowUp"] && obj.grounded) {
        obj.velY = -400;
        obj.grounded = false;
      }

      // 5. Attack start - only once per press
      if (
        spacePressed &&
        !obj.spacePressedLastFrame &&
        !obj.isAttacking &&
        obj.attackCooldown <= 0
      ) {
        obj.isAttacking = true;
        obj.attackCooldown = 0.3;
        obj.attackTimer = 0.12;

        const range = 40;
        const hw = 20;

        if (obj.facing === "right") {
          obj.attackHitbox = {
            x: obj.x + obj.width,
            y: obj.y + obj.height / 2 - hw,
            width: range,
            height: hw * 2,
          };
        } else {
          obj.attackHitbox = {
            x: obj.x - range,
            y: obj.y + obj.height / 2 - hw,
            width: range,
            height: hw * 2,
          };
        }
      }

      // 6. Update attack hitbox to follow player
      if (obj.isAttacking && obj.attackHitbox) {
        const hw = obj.attackHitbox.height / 2;
        const range = obj.attackHitbox.width;
        if (obj.facing === "right") {
          obj.attackHitbox.x = obj.x + obj.width;
          obj.attackHitbox.y = obj.y + obj.height / 2 - hw;
        } else {
          obj.attackHitbox.x = obj.x - range;
          obj.attackHitbox.y = obj.y + obj.height / 2 - hw;
        }
      }

      // 7. Attack timer
      if (obj.isAttacking) {
        obj.attackTimer -= dt;
        if (obj.attackTimer <= 0) {
          obj.isAttacking = false;
          obj.attackHitbox = null;
        }
      }

      // 8. Cooldown
      if (obj.attackCooldown > 0) obj.attackCooldown -= dt;

      // 9. Update previous space state
      obj.spacePressedLastFrame = spacePressed;
    },
    (obj, ctx) => {
      ctx.fillStyle = "cyan";
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
      if (obj.attackHitbox) {
        ctx.fillStyle = "orange";
        ctx.fillRect(
          obj.attackHitbox.x,
          obj.attackHitbox.y,
          obj.attackHitbox.width,
          obj.attackHitbox.height
        );
      }
    }
  );

  // Ensure numeric defaults
  player.attackCooldown = 0;
  player.attackTimer = 0;
  player.velY = 0;
  player.grounded = false;
  player.isAttacking = false;
  player.spacePressedLastFrame = false;

  return player;
};
