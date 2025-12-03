import "./style.css";
import { createPlayer } from "./engine/Player";
import { createGround } from "./engine/Ground";
import type { GameObject } from "./engine/GameObject";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
canvas.width = 800;
canvas.height = 600;

const keys: Record<string, boolean> = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

const objects: GameObject[] = [createGround(), createPlayer(keys)];

let lastTime = 0;

const loop = (timestamp: number) => {
  const deltaTime = (timestamp - lastTime) / 500;
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  objects.forEach((obj) => obj.update(obj, deltaTime));
  objects.forEach((obj) => obj.draw(obj, ctx));

  requestAnimationFrame(loop);
};

requestAnimationFrame(loop);

console.log("Objects:", objects);
