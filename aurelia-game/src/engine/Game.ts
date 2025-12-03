import type { GameObject } from "./GameObject";

export type Game = {
  objects: GameObject[];
  lastTime: number;
};

export const createGame = (
  canvas: HTMLCanvasElement,
  objects: GameObject[],
  keys: Record<string, boolean>
) => {
  const ctx = canvas.getContext("2d")!;
  const game: Game = {
    objects,
    lastTime: 0,
  };

  const loop = (timestamp: number) => {
    const deltaTime = (timestamp - game.lastTime) / 500;
    game.lastTime = timestamp;

    // Uppdatera alla objekt
    game.objects.forEach((obj) => obj.update(obj, deltaTime));

    // Rensa canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rita alla objekt
    game.objects.forEach((obj) => obj.draw(obj, ctx));

    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
  return game;
};
