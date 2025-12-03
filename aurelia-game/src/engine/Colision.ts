import type { AttackHitbox, GameObject } from "./GameObject";

export const isColliding = (hitbox: AttackHitbox, obj: GameObject) => {
  if (!hitbox) return false;
  return (
    hitbox.x < obj.x + obj.width &&
    hitbox.x + hitbox.width > obj.x &&
    hitbox.y < obj.y + obj.height &&
    hitbox.y + hitbox.height > obj.y
  );
};
