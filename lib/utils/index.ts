export function debounce(fn: (...args: any[]) => void, delay = 100) {
  let timeout: number | null = null;
  return function(...args: any[]) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(fn, args);
    }, delay);
  };
}

export function throttle(fn: (...args: any[]) => void, delay = 100) {
  let timeout = 0;
  return function(...args: any[]) {
    const time = Date.now();
    console.log(time, timeout, time - timeout);
    if (timeout === 0 || time - timeout > delay) {
      fn.apply(fn, args);
      timeout = time;
    }
  };
}