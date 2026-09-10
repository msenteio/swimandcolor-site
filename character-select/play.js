(function () {
  var KEY = 'swimandcolor.character-select.v1';

  var FIELDS = ['brainstorm', 'belief', 'drafts', 'character',
                'can1', 'can2', 'can3',
                'cannot1', 'cannot2', 'cannot3', 'must'];

  var el = {};
  FIELDS.forEach(function (id) { el[id] = document.getElementById(id); });

  var card = {
    name:       document.getElementById('c-name'),
    can:        document.getElementById('c-can'),
    cannot:     document.getElementById('c-cannot'),
    must:       document.getElementById('c-must'),
    belief:     document.getElementById('c-belief'),
    days:       document.getElementById('c-days')
  };

  function dayInputs() {
    return Array.prototype.slice.call(document.querySelectorAll('input[name="days"]'));
  }

  function chosenDays() {
    var hit = dayInputs().filter(function (i) { return i.checked; })[0];
    return hit ? parseInt(hit.value, 10) : 3;
  }

  function val(id) {
    return el[id] && el[id].value ? el[id].value.trim() : '';
  }

  /* ---------- storage ---------- */

  function save() {
    var data = { days: chosenDays() };
    FIELDS.forEach(function (id) { data[id] = val(id); });
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      /* private mode, blocked storage — the page still works, just won't persist */
    }
  }

  function load() {
    var data;
    try {
      data = JSON.parse(localStorage.getItem(KEY) || 'null');
    } catch (e) {
      data = null;
    }
    if (!data) return;

    FIELDS.forEach(function (id) {
      if (el[id] && typeof data[id] === 'string') el[id].value = data[id];
    });

    if (data.days) {
      dayInputs().forEach(function (i) {
        i.checked = (parseInt(i.value, 10) === data.days);
      });
    }
  }

  /* ---------- rendering ---------- */

  function fillList(node, values) {
    node.innerHTML = '';
    var filled = values.filter(function (v) { return v; });

    if (!filled.length) {
      var ph = document.createElement('li');
      ph.className = 'ph-li';
      ph.textContent = '—';
      node.appendChild(ph);
      return;
    }

    filled.forEach(function (v) {
      var li = document.createElement('li');
      li.textContent = v;
      node.appendChild(li);
    });
  }

  function setText(node, text, placeholder) {
    if (text) {
      node.textContent = text;
      node.classList.remove('empty');
    } else {
      node.textContent = placeholder;
      node.classList.add('empty');
    }
  }

  function render() {
    setText(card.name, val('character').toUpperCase(), 'Your character');
    fillList(card.can,    [val('can1'), val('can2'), val('can3')]);
    fillList(card.cannot, [val('cannot1'), val('cannot2'), val('cannot3')]);
    setText(card.must,   val('must'),   '—');
    setText(card.belief, val('belief'), '—');

    card.days.innerHTML = '';
    for (var i = 0; i < chosenDays(); i++) {
      card.days.appendChild(document.createElement('i'));
    }
  }

  /* ---------- wiring ---------- */

  function onChange() {
    render();
    save();
  }

  FIELDS.forEach(function (id) {
    if (el[id]) el[id].addEventListener('input', onChange);
  });

  dayInputs().forEach(function (i) {
    i.addEventListener('change', onChange);
  });

  document.getElementById('print').addEventListener('click', function () {
    window.print();
  });

  document.getElementById('reset').addEventListener('click', function () {
    if (!window.confirm('Clear everything and start over? This cannot be undone.')) return;
    FIELDS.forEach(function (id) { if (el[id]) el[id].value = ''; });
    dayInputs().forEach(function (i) { i.checked = (i.value === '3'); });
    try { localStorage.removeItem(KEY); } catch (e) {}
    render();
    if (el.belief) el.belief.focus();
  });

  load();
  render();
})();
