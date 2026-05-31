export function debounce(fn: (...args: any[]) => void, delay = 100) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function(this: any, ...args: any[]) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

export function throttle(fn: (...args: any[]) => void, delay = 100) {
  let lastTime = 0;
  return function(this: any, ...args: any[]) {
    const now = Date.now();
    if (lastTime === 0 || now - lastTime > delay) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}