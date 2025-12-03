import "./style.css";
import { createPlayer } from "./engine/Player";
import { createGround } from "./engine/Ground";
import { createGame } from "./engine/Game";
import type { GameObject } from "./engine/GameObject";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
canvas.width = 800;
canvas.height = 600;

const keys: Record<string, boolean> = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

const objects: GameObject[] = [createGround(), createPlayer(keys)];

// Starta spelet med Game.ts
createGame(canvas, objects, keys);
