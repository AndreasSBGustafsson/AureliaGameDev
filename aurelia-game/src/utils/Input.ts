export const keys: Record<string, boolean> = {};

export const setupInputListeners = () => {
  window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    console.log("keyinput", e.key);
  });

  window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
  });
};
