import { keys } from "../utils/Input";
import type { GameObject } from "./GameObject";
import { createGameObject } from "./GameObject";

export type AttackHitbox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const createPlayer = (): GameObject => {
  const player = createGameObject(
    100,
    500,
    50,
    100,
    (obj, dt) => {
      const attackPressed = keys["x"];
      const shiftPressed = keys["c"];

      // ===============================
      // 0. STATE UPDATE & ACTION TIMER
      // ===============================
      if (obj.movementState !== "idle") {
        obj.actionTimer -= dt;

        if (obj.actionTimer <= 0) {
          obj.movementState = "idle";
          obj.dashSpeed = 0;
          obj.dashDirection = 0;
          obj.dashDistance = 0;
          obj.invincible = false;
        }
      }

      // ===============================
      // 1. Stepback / Roll
      // ===============================
      if (
        shiftPressed &&
        !obj.stepbackPressedLastFrame &&
        obj.movementState === "idle"
      ) {
        const facingDirectionPressed =
          (obj.facing === "right" && keys["ArrowRight"]) ||
          (obj.facing === "left" && keys["ArrowLeft"]);

        if (facingDirectionPressed) {
          // Roll framåt
          obj.movementState = "roll";
          obj.actionTimer = 0.5;
          const rollDistance = 300;
          obj.dashDirection = obj.facing === "right" ? 1 : -1;
          obj.dashDistance = rollDistance;
          obj.dashSpeed = obj.dashDirection * (rollDistance / obj.actionTimer);
          obj.invincible = true;
        } else {
          // Stepback bakåt
          obj.movementState = "stepback";
          const lockTime = 0.5;
          obj.actionTimer = lockTime;
          const stepbackDistance = 200;
          obj.dashDirection = obj.facing === "right" ? -1 : 1;
          obj.dashDistance = stepbackDistance;
          obj.dashSpeed =
            obj.dashDirection * (stepbackDistance / obj.actionTimer);
          obj.invincible = true;
        }
      }

      // ===============================
      // 2. Dash per-frame
      // ===============================
      if (obj.movementState === "stepback" || obj.movementState === "roll") {
        obj.x += obj.dashSpeed * dt;
        obj.velY = 0; // lås Y-rörelse
        obj.actionTimer -= dt;

        if (obj.actionTimer <= 0) {
          obj.movementState = "idle";
          obj.dashSpeed = 0;
          obj.dashDirection = 0;
          obj.dashDistance = 0;
          obj.invincible = false;
        }

        obj.stepbackPressedLastFrame = shiftPressed;
        return; // hoppa över vanlig movement
      }

      // Update previous state för Shift
      obj.stepbackPressedLastFrame = shiftPressed;

      // ===============================
      // 3. Normal movement
      // ===============================
      if (keys["ArrowLeft"]) {
        obj.x -= 200 * dt;
        obj.facing = "left";
      }
      if (keys["ArrowRight"]) {
        obj.x += 200 * dt;
        obj.facing = "right";
      }

      // ===============================
      // 4. Gravity & Jump
      // ===============================
      obj.velY += 800 * dt;
      obj.y += obj.velY * dt;

      if (obj.y + obj.height >= 550) {
        obj.y = 550 - obj.height;
        obj.velY = 0;
        obj.grounded = true;
      } else {
        obj.grounded = false;
      }

      if (keys["z"] && obj.grounded) {
        obj.velY = -500;
        obj.grounded = false;
      }

      // ===============================
      // 5. Attack logic (X) - swipe
      // ===============================
      if (
        attackPressed &&
        !obj.attackPressedLastFrame &&
        !obj.isAttacking &&
        obj.attackCooldown <= 0
      ) {
        obj.isAttacking = true;
        obj.attackCooldown = 0.5;
        obj.attackPhase = "forward";
        obj.attackOffsetX = 0;

        const hw = 20;
        const maxRange = 60;

        if (obj.facing === "right") {
          obj.attackHitbox = {
            x: obj.x + obj.width,
            y: obj.y + obj.height / 2 - hw,
            width: 0,
            height: hw * 2,
          };
        } else {
          obj.attackHitbox = {
            x: obj.x - maxRange,
            y: obj.y + obj.height / 2 - hw,
            width: 0,
            height: hw * 2,
          };
        }
      }

      // ===============================
      // 6. Swipe update
      // ===============================
      if (obj.isAttacking && obj.attackHitbox) {
        const swipeSpeed = 600;
        const maxRange = 60;
        const hw = obj.attackHitbox.height / 2;

        if (obj.attackPhase === "forward") {
          obj.attackOffsetX += swipeSpeed * dt;
          if (obj.attackOffsetX >= maxRange) obj.attackPhase = "back";
        } else if (obj.attackPhase === "back") {
          obj.attackOffsetX -= swipeSpeed * dt;
          if (obj.attackOffsetX <= 0) obj.attackPhase = "done";
        }

        // Update hitbox position
        if (obj.facing === "right") {
          obj.attackHitbox.x =
            obj.x +
            obj.width +
            (obj.attackPhase === "back" ? -obj.attackOffsetX : 0);
          obj.attackHitbox.width =
            obj.attackPhase === "forward"
              ? obj.attackOffsetX
              : obj.attackOffsetX;
        } else {
          obj.attackHitbox.x =
            obj.x -
            (obj.attackPhase === "forward"
              ? maxRange - obj.attackOffsetX
              : obj.attackOffsetX);
          obj.attackHitbox.width = obj.attackOffsetX;
        }

        obj.attackHitbox.y = obj.y + obj.height / 2 - hw;

        if (obj.attackPhase === "done") {
          obj.isAttacking = false;
          obj.attackHitbox = null;
        }
      }

      // ===============================
      // 7. Cooldown & previous input
      // ===============================
      if (obj.attackCooldown > 0) obj.attackCooldown -= dt;
      obj.attackPressedLastFrame = attackPressed;
    },
    (obj, ctx) => {
      ctx.fillStyle = "cyan";
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);

      if (obj.attackHitbox) {
        ctx.fillStyle = "orange";
        ctx.fillRect(
          obj.attackHitbox.x,
          obj.attackHitbox.y,
          obj.attackHitbox.width,
          obj.attackHitbox.height
        );
      }
    }
  );

  // ===============================
  // Defaults
  // ===============================
  player.attackCooldown = 0;
  player.attackTimer = 0;
  player.velY = 0;
  player.grounded = false;
  player.isAttacking = false;
  player.attackPressedLastFrame = false;
  player.attackPhase = "done";
  player.attackOffsetX = 0;
  player.stepbackPressedLastFrame = false;
  player.movementState = "idle";
  player.actionTimer = 0;
  player.dashSpeed = 0;
  player.dashDirection = 0;
  player.dashDistance = 0;
  player.invincible = false;

  return player;
};
