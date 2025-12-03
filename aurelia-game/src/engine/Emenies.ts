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
      // Update-logik för fienden
      // För tillfället kan vi låta den stå stilla
      // Senare kan du lägga till enkel AI eller rörelse fram och tillbaka
    },
    (obj, ctx) => {
      // Draw-fiende
      ctx.fillStyle = "red"; // Fienden är röd
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    }
  );

  // Initiera eventuella defaultvärden
  enemy.velY = 0;
  enemy.grounded = false;
  enemy.isAttacking = false;
  enemy.attackCooldown = 0;
  enemy.attackTimer = 0;
  enemy.spacePressedLastFrame = false;
  enemy.attackHitbox = null;

  return enemy;
};
