import type { GameObject } from "./GameObject";
import { createGameObject } from "./GameObject";

// Skapa en enkel fiende
export const createEnemy = (
  x: number,
  y: number,
  width: number,
  height: number
): GameObject => {
  const enemy = createGameObject(
    x,
    y,
    width,
    height,
    (obj, dt) => {
      // Timer for flashing
      if (obj.isHit) {
        obj.hitTimer -= dt;
        if (obj.hitTimer <= 0) {
          obj.isHit = false;
          obj.hitTimer = 0;
        }
      }
    },
    (obj, ctx) => {
      // if hited → white colour
      ctx.fillStyle = obj.isHit ? "white" : "red";

      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    }
  );

  // Initiate default values
  enemy.velY = 0;
  enemy.grounded = false;
  enemy.isAttacking = false;
  enemy.attackCooldown = 0;
  enemy.attackTimer = 0;
  enemy.attackHitbox = null;

  enemy.isEnemy = true;
  enemy.isHit = false;
  enemy.hitTimer = 0;

  return enemy;
};
