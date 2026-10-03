(function () {
  'use strict';
  // ---- EDIT HERE (or use ?name=Anjali&age=28&from=Your%20little%20brother) ----
  var P = new URLSearchParams(location.search);
  var CFG = {
    name: P.get('name') || 'Dearest Sister',
    age: P.get('age') || '',
    from: P.get('from') || 'Your little brother',
    tag: 'Today belongs entirely to you.',
    wishes: [
      ['My first teacher', "Long before any school, you taught me how to stand up for myself and how to pretend I wasn't scared. I'm still learning from you."],
      ['My shield', 'Every time I got into trouble, you were somehow already standing in front of me. You never kept score, and I never thanked you enough.'],
      ['My loudest cheerleader', "When the world doubted me, you didn't. Your belief in me has carried me further than any talent I have."],
      ['My wish for you', "May this year give back everything you've quietly given to others: patience repaid, kindness returned, and more time for yourself."]
    ],
    stats: [
      [1000, '+', "Scoldings you took so I didn't have to"],
      [365, '', "Days a year I know you'd pick up"],
      [1, '', 'Irreplaceable big sister']
    ],
    memories: [
      ['The early years', 'You ruled the remote, the last slice, and every argument. I secretly loved every second of it.'],
      ['The late-night talks', 'Whispered conversations well past bedtime, where every problem felt smaller by morning.'],
      ['The quiet moments', 'The times you understood me without a single word. You always knew.']
    ],
    letter: "Happy Birthday, Didi.\n\nI don't say it often, so let me say it properly today. You have been my protector, my first friend, and the person I measure kindness against. You carried more than you ever let on, and you made it look easy so that I would never have to worry.\n\nWhatever I have become, a part of it is your doing: every piece of advice I pretended to ignore, every time you believed in me before I believed in myself.\n\nI hope this year is gentle with you, and generous. You have given so much to everyone else. May it all come back to you.\n\nI am proud to be your brother. Thank you for everything.",
    gift: ['One Free Wish', 'Redeemable anytime, anywhere, no questions asked. Valid for life.']
  };
  var $ = function (id) { return document.getElementById(id); };
  var el = function (t, h, c) { var e = document.createElement(t); e.innerHTML = h; if (c) e.className = c; return e; };
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover)').matches;

  // ---- fill content ----
  var nm = $('name');
  CFG.name.split('').forEach(function (c, i) {
    var s = document.createElement('span'); s.textContent = c; s.style.setProperty('--i', i); nm.appendChild(s);
  });
  nm.setAttribute('aria-label', CFG.name);
  $('tag').textContent = CFG.age ? 'Here is to ' + CFG.age + ' years of you.' : CFG.tag;
  CFG.wishes.forEach(function (w) { $('wishes').appendChild(el('div', '<b>' + w[0] + '</b>' + w[1], 'glass tilt')); });
  CFG.stats.forEach(function (s) {
    $('stats').appendChild(el('div', '<strong class="num" data-n="' + s[0] + '" data-x="' + s[1] + '">0</strong><span>' + s[2] + '</span>', 'glass tilt'));
  });
  CFG.memories.forEach(function (m) { var l = el('li', '<b>' + m[0] + '</b><br>' + m[1]); l.setAttribute('data-r', ''); $('mem').appendChild(l); });
  var wi = 0;
  CFG.letter.split('\n\n').forEach(function (p) {
    $('letter').appendChild(el('p', p.split(' ').map(function (w) { return '<span class="w" style="--w:' + (wi++) + '">' + w + ' </span>'; }).join('')));
  });
  $('sign').textContent = '- ' + CFG.from;
  $('cb').textContent = CFG.gift[0]; $('cp').textContent = CFG.gift[1];

  // ---- reveal + count-up ----
  function count(n) {
    var to = +n.dataset.n, x = n.dataset.x, t0 = performance.now();
    if (still) { n.textContent = to + x; return; }
    (function f(t) {
      var k = Math.min(1, (t - t0) / 1800), e = 1 - Math.pow(1 - k, 3);
      n.textContent = Math.round(to * e) + (k === 1 ? x : '');
      if (k < 1) requestAnimationFrame(f);
    })(t0);
  }
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (en) {
    en.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); io.unobserve(e.target);
      [].forEach.call(e.target.querySelectorAll('.num'), count);
    });
  }, { threshold: .15 }) : null;
  [].forEach.call(document.querySelectorAll('[data-r]'), function (n) {
    if (io) io.observe(n); else { n.classList.add('in'); [].forEach.call(n.querySelectorAll('.num'), count); }
  });

  // ---- scroll progress ----
  var pr = $('prog'), tk = 0;
  addEventListener('scroll', function () {
    if (tk) return;
    tk = requestAnimationFrame(function () {
      tk = 0; var m = document.documentElement.scrollHeight - innerHeight;
      pr.style.transform = 'scaleX(' + (m > 0 ? scrollY / m : 0) + ')';
    });
  }, { passive: true });

  // ---- glass tilt (fine pointers) ----
  if (fine && !still) {
    var tr = 0, te;
    document.addEventListener('pointermove', function (e) {
      var c = e.target.closest && e.target.closest('.tilt'); if (!c) return;
      te = e; if (tr) return;
      tr = requestAnimationFrame(function () {
        tr = 0; var r = c.getBoundingClientRect();
        c.style.setProperty('--ry', ((te.clientX - r.left) / r.width - .5) * 10 + 'deg');
        c.style.setProperty('--rx', ((te.clientY - r.top) / r.height - .5) * -10 + 'deg');
      });
    }, { passive: true });
    document.addEventListener('pointerout', function (e) {
      var c = e.target.closest && e.target.closest('.tilt');
      if (c) { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); }
    });
  }

  // ---- melody (WebAudio music-box, no assets) ----
  var ac, M = [[392,.75],[392,.25],[440,1],[392,1],[523.25,1],[493.88,2],[392,.75],[392,.25],[440,1],[392,1],[587.33,1],[523.25,2],
    [392,.75],[392,.25],[783.99,1],[659.25,1],[523.25,1],[493.88,1],[440,1],[698.46,.75],[698.46,.25],[659.25,1],[523.25,1],[587.33,1],[523.25,2]];
  function melody() {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      var t = ac.currentTime + .1;
      M.forEach(function (n) {
        [1, 2].forEach(function (h) {
          var o = ac.createOscillator(), g = ac.createGain();
          o.type = 'sine'; o.frequency.value = n[0] * h;
          g.gain.setValueAtTime(.001, t); g.gain.linearRampToValueAtTime(.11 / h / h, t + .02);
          g.gain.exponentialRampToValueAtTime(.0001, t + n[1] * .5 + .5);
          o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + n[1] * .5 + .6);
        });
        t += n[1] * .5;
      });
    } catch (e) {}
  }
  $('mel').onclick = melody;

  // ---- fx canvas: gold dust + confetti ----
  var cv = $('fx'), cx = cv.getContext('2d'), W, H, dpr = Math.min(devicePixelRatio || 1, 1.5), dust = [], conf = [], on = false;
    function size() { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  size(); addEventListener('resize', size);
  for (var i = 0; i < 34; i++) dust.push({ x: Math.random() * W, y: Math.random() * H, r: .6 + Math.random() * 1.8, v: .15 + Math.random() * .4, p: Math.random() * 6 });
  var cols = ['#ff6fae', '#f6cf7a', '#ffc2dc', '#c9972e', '#ffffff', '#b0235a'];
  function burst() {
    if (still) return;
    for (var k = 0; k < 150; k++) {
      var a = Math.random() * 6.283, s = 4 + Math.random() * 9;
      conf.push({ x: W / 2, y: H * .55, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6, w: 5 + Math.random() * 6, h: 3 + Math.random() * 4, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: cols[k % 6], l: 1 });
    }
    loop();
  }
  function loop() {
    if (on || document.hidden) return; on = true;
    (function f() {
      if (document.hidden) { on = false; return; }
      cx.clearRect(0, 0, W, H);
      cx.fillStyle = '#f6cf7a';
      dust.forEach(function (d) {
        d.y -= d.v; d.p += .02; d.x += Math.sin(d.p) * .3;
        if (d.y < -5) { d.y = H + 5; d.x = Math.random() * W; }
        cx.globalAlpha = .35 + Math.sin(d.p * 2) * .25; cx.beginPath(); cx.arc(d.x, d.y, d.r, 0, 6.283); cx.fill();
      });
      for (var j = conf.length - 1; j >= 0; j--) {
        var c = conf[j]; c.vy += .28; c.vx *= .99; c.x += c.vx; c.y += c.vy; c.r += c.vr; c.l -= .008;
        if (c.l <= 0) { conf.splice(j, 1); continue; }
        cx.globalAlpha = Math.min(1, c.l * 1.5); cx.fillStyle = c.c;
        cx.save(); cx.translate(c.x, c.y); cx.rotate(c.r); cx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h); cx.restore();
      }
      still && !conf.length ? (on = false) : requestAnimationFrame(f);
    })();
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden && !still) loop(); });

  // ---- actions ----
  document.body.style.overflow = 'hidden';
  $('begin').onclick = function () {
    document.body.classList.add('go'); document.body.style.overflow = '';
    melody(); loop(); burst();
  };
  $('blow').onclick = function () {
    $('cake').classList.add('out'); this.hidden = true; burst();
    $('after').textContent = 'Wish accepted. The universe has been notified.';
    setTimeout(burst, 700);
  };
  $('open').onclick = function () {
    document.body.classList.add('opened'); this.hidden = true; burst(); setTimeout(burst, 600);
  };
})();
