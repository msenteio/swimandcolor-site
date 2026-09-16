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

(function () {
  // The hero is the whole first screen. A downward scroll, swipe, or key from anywhere in it
  // glides straight to the content; scrolling back up is left alone. Skipped for reduced motion.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var content = document.querySelector('main');
  if (!content || !document.querySelector('header.hero')) return;

  var holding = false;
  var lastInput = 0;
  var touchY = null;

  // where the content starts, or as far as the page can scroll if the screen is very tall
  function stop() {
    var top = content.getBoundingClientRect().top + window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    return Math.round(Math.min(top, max));
  }

  function inHero() {
    return window.scrollY < stop() - 2;
  }

  function ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function glide() {
    var from = window.scrollY;
    var to = stop();
    var ms = Math.min(1100, Math.max(700, (to - from) * 0.9));
    var start = null;
    holding = true;

    function frame(now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / ms, 1);
      window.scrollTo(0, from + (to - from) * ease(t));
      if (t < 1) window.requestAnimationFrame(frame);
      else release(now);
    }

    window.requestAnimationFrame(frame);
  }

  // trackpads keep firing momentum after the glide lands; swallow it until input goes quiet
  // so the page doesn't overshoot the content, then hand scrolling back
  function release(landed) {
    var now = performance.now();
    if (now - lastInput > 150 || now - landed > 700) holding = false;
    else window.setTimeout(function () { release(landed); }, 50);
  }

  function swallow(e) {
    if (!holding) return false;
    if (e.cancelable) e.preventDefault();
    return true;
  }

  var arrow = document.querySelector('.hero-arrow');
  if (arrow) {
    arrow.addEventListener('click', function (e) {
      e.preventDefault();
      if (!holding) glide();
    });
  }

  window.addEventListener('wheel', function (e) {
    lastInput = performance.now();
    if (swallow(e) || e.ctrlKey) return; // ctrl + wheel is pinch-zoom
    if (e.deltaY > 0 && Math.abs(e.deltaY) >= Math.abs(e.deltaX) && inHero()) {
      e.preventDefault();
      glide();
    }
  }, { passive: false });

  window.addEventListener('touchstart', function (e) {
    lastInput = performance.now();
    touchY = e.touches.length === 1 ? e.touches[0].clientY : null;
  }, { passive: true });

  window.addEventListener('touchmove', function (e) {
    lastInput = performance.now();
    if (swallow(e) || touchY === null || !inHero()) return;
    var pulled = touchY - e.touches[0].clientY; // positive when the finger moves up the screen
    if (pulled > 0 && e.cancelable) e.preventDefault();
    if (pulled > 10) {
      touchY = null;
      glide();
    }
  }, { passive: false });

  window.addEventListener('keydown', function (e) {
    var down = e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey);
    if (!down || e.altKey || e.ctrlKey || e.metaKey) return;
    var el = e.target;
    if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(el.tagName))) return;
    lastInput = performance.now();
    if (swallow(e)) return;
    if (inHero()) {
      e.preventDefault();
      glide();
    }
  });
})();
