import { onScopeDispose } from 'vue';
import { throttle } from '../utils';

export function useMouseMove(callbackFunc: (x: number, y: number) => void, delay = 50) {
  const throttleFunc: (x: number, y: number) => void = throttle(callbackFunc, delay);

  let activeCleanup: (() => void) | null = null;

  onScopeDispose(() => activeCleanup?.());

  return function(event: MouseEvent) {
    activeCleanup?.();
    activeCleanup = null;

    const { clientX, clientY } = event;
    event.preventDefault();

    let lastEvent: null | MouseEvent = null;

    function onMouseMove(e: MouseEvent) {
      throttleFunc(e.clientX - clientX, e.clientY - clientY);
      lastEvent = e;
    }

    function onMouseUp() {
      if (lastEvent) {
        throttleFunc(lastEvent.clientX - clientX, lastEvent.clientY - clientY);
        lastEvent = null;
      }
      cleanup();
    }

    function cleanup() {
      activeCleanup = null;
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    }

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    activeCleanup = cleanup;
  };
}
