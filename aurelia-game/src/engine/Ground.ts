import type { GameObject } from "./GameObject";

export const createGround = (): GameObject => ({
  x: 0,
  y: 550,
  width: 800,
  height: 50,
  velY: 0,
  grounded: true,
  facing: "right",
  isAttacking: false,
  attackCooldown: 0,
  attackTimer: 0,
  attackHitbox: null,

  update: (obj, dt) => {
    // Ground is static
  },

  draw: (obj, ctx) => {
    ctx.fillStyle = "#687019ff";
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
  },
});
