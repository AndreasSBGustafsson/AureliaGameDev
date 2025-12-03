import "./style.css";
import { createPlayer } from "./engine/Player";
import { createGround } from "./engine/Ground";
import { createGame } from "./engine/Game";
import type { GameObject } from "./engine/GameObject";
import { keys, setupInputListeners } from "./utils/Input";

setupInputListeners();

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  if (!canvas) return;

  canvas.width = 800;
  canvas.height = 600;

  const objects: GameObject[] = [createGround(), createPlayer()];

  createGame(canvas, objects, keys);
});
