import type { GameObject } from "./GameObject";

export const createGround = (): GameObject => ({
  x: 0,
  y: 550,
  width: 800,
  height: 50,
  update: (obj, dt) => {}, // marken är statisk
  draw: (obj, ctx) => {
    ctx.fillStyle = "#687019ff"; // mörk brun mark
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
  },
});
