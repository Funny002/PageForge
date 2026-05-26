!((win, lib) => {
  lib.base = 100;
  lib.design = 1920;

  var doc = win.document;
  var docHtml = doc.documentElement;

  function setRem() {
    const { width } = docHtml.getBoundingClientRect();
    docHtml.style.fontSize = (width / lib.design) * lib.base + 'px';
  }

  function setViewport() {
    var metaEl = doc.querySelector('meta[name="viewport"]');
    if (metaEl) {
      metaEl.setAttribute('content', 'width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no');
    } else {
      metaEl = doc.createElement('meta');
      metaEl.setAttribute('name', 'viewport');
    }
  }

  function debounce(func, delay) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(func, delay);
    };
  }

  lib.setRem = debounce(setRem, 100);

  lib.init = function () {
    setRem();
    setViewport();
    win.addEventListener('resize', lib.setRem);
    win.addEventListener('pageshow', function (e) {
      if (e.persisted) setRem();
    });
  };

  lib.init();
  doc.addEventListener('DOMContentLoaded', setRem, { once: true });
})(window, window.adaptive || (window.adaptive = {}));
