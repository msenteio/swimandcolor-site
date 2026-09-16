(function () {
  // Light catches the hero as the page scrolls. Skipped entirely for reduced motion,
  // which leaves the page exactly as it looks without this file.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var targets = [].slice.call(document.querySelectorAll('[data-glint]'));
  if (!targets.length) return;

  document.documentElement.classList.add('glint-on');

  var queued = false;

  function update() {
    queued = false;
    var y = window.scrollY;

    // read every position before writing any, so the browser lays out once per frame
    var progress = targets.map(function (el) {
      var r = el.getBoundingClientRect();
      // each piece finishes catching the light as it scrolls most of the way off the top
      var range = (r.top + y) + r.height * 0.65;
      return range > 0 ? Math.min(Math.max(y / range, 0), 1) : 1;
    });

    targets.forEach(function (el, i) {
      el.style.setProperty('--glint', (0.15 + 0.7 * progress[i]).toFixed(4));
    });
  }

  function queue() {
    if (!queued) {
      queued = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  window.addEventListener('load', queue);
  update();
})();
