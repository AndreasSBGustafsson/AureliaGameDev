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
        obj.velY = -500;
        obj.grounded = false;
      }

      // 5. Attack start
      if (
        spacePressed &&
        !obj.spacePressedLastFrame &&
        !obj.isAttacking &&
        obj.attackCooldown <= 0
      ) {
        obj.isAttacking = true;
        obj.attackCooldown = 0.5;
        obj.attackPhase = "forward";
        obj.attackOffsetX = 0;

        const hw = 20;
        const maxRange = 60;

        // Initialize hitbox at player edge
        if (obj.facing === "right") {
          obj.attackHitbox = {
            x: obj.x + obj.width,
            y: obj.y + obj.height / 2 - hw,
            width: 0,
            height: hw * 2,
          };
        } else {
          obj.attackHitbox = {
            x: obj.x - maxRange,
            y: obj.y + obj.height / 2 - hw,
            width: 0,
            height: hw * 2,
          };
        }
      }

      // 6. Swipe update
      if (obj.isAttacking && obj.attackHitbox) {
        const swipeSpeed = 600;
        const maxRange = 60;
        const backRange = 20;
        const hw = obj.attackHitbox.height / 2;

        // Update offset
        if (obj.attackPhase === "forward") {
          obj.attackOffsetX += swipeSpeed * dt;
          if (obj.attackOffsetX >= maxRange) obj.attackPhase = "back";
        } else if (obj.attackPhase === "back") {
          obj.attackOffsetX -= swipeSpeed * dt;
          if (obj.attackOffsetX <= 0) obj.attackPhase = "done";
        }

        // Update hitbox position and width
        if (obj.facing === "right") {
          if (obj.attackPhase === "forward") {
            obj.attackHitbox.x = obj.x + obj.width;
            obj.attackHitbox.width = obj.attackOffsetX;
          } else if (obj.attackPhase === "back") {
            obj.attackHitbox.x =
              obj.x + obj.width + (maxRange - obj.attackOffsetX) - maxRange;
            obj.attackHitbox.width = obj.attackOffsetX;
          }
        } else {
          if (obj.attackPhase === "forward") {
            obj.attackHitbox.x = obj.x - maxRange + obj.attackOffsetX;
            obj.attackHitbox.width = obj.attackOffsetX;
          } else if (obj.attackPhase === "back") {
            obj.attackHitbox.x = obj.x - obj.attackOffsetX;
            obj.attackHitbox.width = obj.attackOffsetX;
          }
        }

        obj.attackHitbox.y = obj.y + obj.height / 2 - hw;

        if (obj.attackPhase === "done") {
          obj.isAttacking = false;
          obj.attackHitbox = null;
        }
      }

      // 7. Cooldown
      if (obj.attackCooldown > 0) obj.attackCooldown -= dt;

      // 8. Update previous space state
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

  // Defaults
  player.attackCooldown = 0;
  player.attackTimer = 0;
  player.velY = 0;
  player.grounded = false;
  player.isAttacking = false;
  player.spacePressedLastFrame = false;
  player.attackPhase = "done";
  player.attackOffsetX = 0;

  return player;
};
