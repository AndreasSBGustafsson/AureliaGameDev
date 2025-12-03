import { isColliding } from "./Colision";
import type { GameObject } from "./GameObject";

export type Game = {
  objects: GameObject[];
  lastTime: number;
};

export const createGame = (
  canvas: HTMLCanvasElement,
  objects: GameObject[]
) => {
  const ctx = canvas.getContext("2d")!;
  const game: Game = {
    objects,
    lastTime: 0,
  };

  const loop = (timestamp: number) => {
    const deltaTime = (timestamp - game.lastTime) / 500;
    game.lastTime = timestamp;

    // --- UPDATE ALL OBJECTS ---
    game.objects.forEach((obj) => obj.update(obj, deltaTime));

    // --- COLLISION: PLAYER ATTACK VS ENEMIES ---
    const player = game.objects.find((o) => o.isPlayer);

    if (player && player.attackHitbox) {
      game.objects.forEach((target) => {
        if (target !== player && target.isEnemy) {
          if (isColliding(player.attackHitbox!, target)) {
            target.isHit = true;
            target.hitTimer = 0.15;
            console.log("Fiende träffad!", target);
            // Här kan du minska HP etc.
          }
        }
      });
    }

    // --- CLEAR ---
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- DRAW ---
    game.objects.forEach((obj) => obj.draw(obj, ctx));

    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
  return game;
};
