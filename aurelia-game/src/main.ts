import "./style.css";
import { createPlayer } from "./engine/Player";
import { createGround } from "./engine/Ground";
import { createGame } from "./engine/Game";
import type { GameObject } from "./engine/GameObject";
import { keys, setupInputListeners } from "./utils/Input";
import { createEnemy } from "./engine/Emenies";

setupInputListeners();

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  if (!canvas) return;

  canvas.width = 800;
  canvas.height = 600;
  const player = createPlayer(); // Skapa spelare
  player.isPlayer = true;

  const enemy = createEnemy(400, 450, 50, 100);
  enemy.isEnemy = true;

  const objects: GameObject[] = [createGround(), player, enemy];

  createGame(canvas, objects, keys);
});
