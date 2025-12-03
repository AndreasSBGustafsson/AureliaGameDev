import type { GameObject } from "./GameObject";

export const createPlayer = (keys: Record<string, boolean>): GameObject => {
  const player: GameObject = {
    x: 100,
    y: 500,
    width: 50,
    height: 100,
    velY: 0,
    grounded: false,
    update: (obj, dt) => {
      // rörelse
      if (keys["ArrowLeft"]) obj.x -= 200 * dt;
      if (keys["ArrowRight"]) obj.x += 200 * dt;

      // gravitation
      obj.velY = (obj.velY ?? 0) + 800 * dt;
      obj.y += obj.velY * dt;

      // markkontroll
      if (obj.y + obj.height >= 550) {
        obj.y = 550 - obj.height;
        obj.velY = 0;
        obj.grounded = true;
      } else {
        obj.grounded = false;
      }

      // hopp
      if (keys["ArrowUp"] && obj.grounded) {
        obj.velY = -400;
        obj.grounded = false;
      }

      // debug: logga position
      // console.log('Player y:', obj.y, 'velY:', obj.velY);
    },
    draw: (obj, ctx) => {
      ctx.fillStyle = "cyan";
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    },
  };

  console.log("Player created:", player);
  return player;
};
