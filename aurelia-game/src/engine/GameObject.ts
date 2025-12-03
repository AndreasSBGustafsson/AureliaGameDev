export type GameObject = {
  x: number;
  y: number;
  width: number;
  height: number;
  velY?: number;
  grounded?: boolean;
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
  update,
  draw,
});
