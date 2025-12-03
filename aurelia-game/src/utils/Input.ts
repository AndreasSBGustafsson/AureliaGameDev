export const keys: Record<string, boolean> = {};

export const setupInputListeners = () => {
  window.addEventListener("keydown", (e) => {
    e.defaultPrevented;
    keys[e.key] = true;
    console.log("keyinput", e.key);
  });

  window.addEventListener("keyup", (e) => {
    e.defaultPrevented;
    keys[e.key] = false;
  });
};
