import { throttle } from '../utils';

export function useMouseMove(callbackFunc: (moveX: number, moveY: number) => void, delay = 50) {

  const throttleFunc: (moveX: number, moveY: number) => void = throttle(callbackFunc, delay);

  return function(event: MouseEvent) {
    const { clientX, clientY } = event;

    let lestEvent: null | MouseEvent = null;

    function onMouseMove(event: MouseEvent) {
      throttleFunc(event.clientX - clientX, event.clientY - clientY);
      lestEvent = event;
    }

    function onMouseUp() {
      if (lestEvent) {
        callbackFunc(lestEvent.clientX - clientX, lestEvent.clientY - clientY);
        lestEvent = null;
      }
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    }

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
  };
}
