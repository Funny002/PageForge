import { onScopeDispose } from 'vue';
import { throttle } from '../utils';

export function usePointerMove(callbackFunc: (x: number, y: number) => void, delay = 50) {
  const throttleFunc: (x: number, y: number) => void = throttle(callbackFunc, delay);

  let activeCleanup: (() => void) | null = null;

  onScopeDispose(() => activeCleanup?.());

  return function (event: PointerEvent) {
    activeCleanup?.();
    activeCleanup = null;

    const { clientX, clientY } = event;
    event.preventDefault();

    let lastEvent: null | PointerEvent = null;

    function onPointerMove(e: PointerEvent) {
      throttleFunc(e.clientX - clientX, e.clientY - clientY);
      lastEvent = e;
    }

    function onPointerUp() {
      if (lastEvent) {
        throttleFunc(lastEvent.clientX - clientX, lastEvent.clientY - clientY);
        lastEvent = null;
      }
      cleanup();
    }

    function cleanup() {
      activeCleanup = null;
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointermove', onPointerMove);
    }

    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointermove', onPointerMove);

    activeCleanup = cleanup;
  };
}
