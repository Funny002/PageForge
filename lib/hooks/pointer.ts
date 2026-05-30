import { throttle } from '../utils';

export function usePointerMove(callbackFunc: (x: number, y: number) => void, delay = 50) {
  const throttleFunc: (x: number, y: number) => void = throttle(callbackFunc, delay);
  return function(event: PointerEvent) {
    const { clientX, clientY } = event;
    event.preventDefault();

    let lastEvent: null | PointerEvent = null;

    function onMouseMove(event: PointerEvent) {
      throttleFunc(event.clientX - clientX, event.clientY - clientY);
      lastEvent = event;
    }

    function onMouseUp() {
      if (lastEvent) {
        throttleFunc(lastEvent.clientX - clientX, lastEvent.clientY - clientY);
        lastEvent = null;
      }
      document.removeEventListener('pointerup', onMouseUp);
      document.removeEventListener('pointermove', onMouseMove);
    }

    document.addEventListener('pointerup', onMouseUp);
    document.addEventListener('pointermove', onMouseMove);
  };
}
