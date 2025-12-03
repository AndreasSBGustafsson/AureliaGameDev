export type AttackHitbox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type GameObject = {
  isEnemy: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  velY?: number;
  grounded?: boolean;
  facing?: "left" | "right";
  isAttacking?: boolean;
  attackCooldown?: number;
  attackTimer?: number;
  attackHitbox?: AttackHitbox | null;
  attackPhase?: "forward" | "back" | "done";
  attackOffsetX?: number;
  attackPressedLastFrame?: boolean;
  isPlayer?: boolean;
  isHit?: boolean;
  hitTimer?: number;
  movementState?: "idle" | "stepback" | "roll" | "attack" | "heavyAttack";
  actionTimer?: number;
  dashDirection?: number;
  dashSpeed?: number;
  dashDistance?: number;
  stepbackPressedLastFrame?: boolean;

  update: (obj: GameObject, deltaTime: number) => void;
  draw: (obj: GameObject, ctx: CanvasRenderingContext2D) => void;
};

export const createGameObject = (
  x: number,
  y: number,
  width: number,
  height: number,
  update: (obj: GameObject, dt: number) => void,
  draw: (obj: GameObject, ctx: CanvasRenderingContext2D) => void
): GameObject => ({
  x,
  y,
  width,
  height,
  velY: 0,
  grounded: false,
  facing: "right",
  isAttacking: false,
  attackCooldown: 0,
  attackTimer: 0,
  attackHitbox: null,
  attackPhase: "done",
  attackOffsetX: 0,
  attackPressedLastFrame: false,
  isHit: false,
  hitTimer: 0,
  movementState: "idle",
  actionTimer: 0,
  dashSpeed: 0,
  dashDirection: 0,
  dashDistance: 0,
  stepbackPressedLastFrame: false,

  update,
  draw,
});
