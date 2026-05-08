/* ===========================
   ARTEMIS — script.js
   =========================== */

// ---- STARFIELD ----
(function () {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  const STAR_COUNT = 220;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.2,
        alpha: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.15 + 0.03,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      s.alpha += s.twinkleSpeed * s.twinkleDir;
      if (s.alpha > 0.9 || s.alpha < 0.1) s.twinkleDir *= -1;
      s.y -= s.speed;
      if (s.y < -2) { s.y = canvas.height + 2; s.x = Math.random() * canvas.width; }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168, 200, 255, ${s.alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', () => { resize(); initStars(); });
  resize();
  initStars();
  drawStars();
})();


// ---- NAV SCROLL ----
(function () {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
})();


// ---- HAMBURGER ----
(function () {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('open'));
  });
})();


// ---- COUNT-UP STATS ----
(function () {
  const stats = document.querySelectorAll('.stat-num');
  let triggered = false;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();
    function frame(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(easeOut(progress) * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(frame);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(frame);
  }

  const observer = new IntersectionObserver((entries) => {
    if (triggered) return;
    const visible = entries.some(e => e.isIntersecting);
    if (visible) {
      triggered = true;
      stats.forEach(el => animateCount(el));
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) observer.observe(heroStats);
})();


// ---- REVEAL ON SCROLL ----
(function () {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => observer.observe(el));
})();


// ---- MODULE DATA & GRID ----
(function () {
  const modules = [
    { name: 'KillAura',      cat: 'combat'   },
    { name: 'AimAssist',     cat: 'combat'   },
    { name: 'AutoClicker',   cat: 'combat'   },
    { name: 'Reach',         cat: 'combat'   },
    { name: 'Criticals',     cat: 'combat'   },
    { name: 'Velocity',      cat: 'combat'   },
    { name: 'AntiKnockback', cat: 'combat'   },
    { name: 'TriggerBot',    cat: 'combat'   },
    { name: 'Backtrack',     cat: 'combat'   },
    { name: 'HitBox',        cat: 'combat'   },
    { name: 'Speed',         cat: 'movement' },
    { name: 'Fly',           cat: 'movement' },
    { name: 'Scaffold',      cat: 'movement' },
    { name: 'Sprint',        cat: 'movement' },
    { name: 'Step',          cat: 'movement' },
    { name: 'NoFall',        cat: 'movement' },
    { name: 'LongJump',      cat: 'movement' },
    { name: 'Strafe',        cat: 'movement' },
    { name: 'FastLadder',    cat: 'movement' },
    { name: 'Phase',         cat: 'movement' },
    { name: 'ESP',           cat: 'visual'   },
    { name: 'Tracers',       cat: 'visual'   },
    { name: 'ChestESP',      cat: 'visual'   },
    { name: 'Fullbright',    cat: 'visual'   },
    { name: 'NameTags',      cat: 'visual'   },
    { name: 'HUD',           cat: 'visual'   },
    { name: 'Xray',          cat: 'visual'   },
    { name: 'NoHurtCam',     cat: 'visual'   },
    { name: 'Ambience',      cat: 'visual'   },
    { name: 'HealthBar',     cat: 'visual'   },
    { name: 'AutoTotem',     cat: 'utility'  },
    { name: 'AutoArmor',     cat: 'utility'  },
    { name: 'FastPlace',     cat: 'utility'  },
    { name: 'Nuker',         cat: 'utility'  },
    { name: 'Timer',         cat: 'utility'  },
    { name: 'ChestStealer',  cat: 'utility'  },
    { name: 'AutoSoup',      cat: 'utility'  },
    { name: 'FastEat',       cat: 'utility'  },
    { name: 'MiddleClick',   cat: 'utility'  },
    { name: 'Freecam',       cat: 'utility'  },
    { name: 'NoRotate',      cat: 'utility'  },
    { name: 'AntiAFK',       cat: 'utility'  },
    { name: 'ChatFilter',    cat: 'utility'  },
    { name: 'ItemESP',       cat: 'utility'  },
    { name: 'Panic',         cat: 'utility'  },
    { name: 'AutoSneak',     cat: 'movement' },
    { name: 'BunnyHop',      cat: 'movement' },
    { name: 'WaterSpeed',    cat: 'movement' },
  ];

  const grid = document.getElementById('module-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  function render(filter) {
    grid.innerHTML = '';
    const list = filter === 'all' ? modules : modules.filter(m => m.cat === filter);
    list.forEach((m, i) => {
      const chip = document.createElement('div');
      chip.className = 'module-chip';
      chip.style.animationDelay = `${i * 0.025}s`;
      chip.innerHTML = `
        <span class="module-chip-name">${m.name}</span>
        <span class="module-chip-cat">${m.cat.toUpperCase()}</span>
      `;
      grid.appendChild(chip);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.filter);
    });
  });

  render('all');
})();


// ---- DOWNLOAD BUTTON RIPPLE ----
(function () {
  const btn = document.getElementById('download-btn');
  if (!btn) return;
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.cssText = `
      position:absolute;
      width:${size}px;height:${size}px;
      border-radius:50%;
      background:rgba(255,255,255,0.15);
      top:${e.clientY - rect.top - size / 2}px;
      left:${e.clientX - rect.left - size / 2}px;
      transform:scale(0);
      animation:ripple-anim 0.5s ease forwards;
      pointer-events:none;
    `;
    const style = document.createElement('style');
    style.textContent = `@keyframes ripple-anim{to{transform:scale(1);opacity:0}}`;
    document.head.appendChild(style);
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
})();
