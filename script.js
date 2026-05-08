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
    // ---- COMBAT ----
    { name: 'Aim Assist',         cat: 'combat'      },
    { name: 'Anchor Macro',       cat: 'combat'      },
    { name: 'Auto Double Hand',   cat: 'combat'      },
    { name: 'Auto Crystal',       cat: 'combat'      },
    { name: 'Auto Hit Crystal',   cat: 'combat'      },
    { name: 'Auto Inv Totem',     cat: 'combat'      },
    { name: 'Auto Jump Reset',    cat: 'combat'      },
    { name: 'Auto Totem',         cat: 'combat'      },
    { name: 'Crystal Optimizer',  cat: 'combat'      },
    { name: 'Double Anchor',      cat: 'combat'      },
    { name: 'Elytra Swap',        cat: 'combat'      },
    { name: 'HitBox',             cat: 'combat'      },
    { name: 'Hover Totem',        cat: 'combat'      },
    { name: 'Totem Offhand',      cat: 'combat'      },
    { name: 'Mace Swap',          cat: 'combat'      },
    { name: 'Spear Swap',         cat: 'combat'      },
    { name: 'No Hit Delay',       cat: 'combat'      },
    { name: 'Shield Breaker',     cat: 'combat'      },
    { name: 'Static Hitboxes',    cat: 'combat'      },
    { name: 'Trigger Bot',        cat: 'combat'      },
    { name: 'Mace Bomber',        cat: 'combat'      },
    { name: 'Anti Miss',          cat: 'combat'      },
    // ---- MISC ----
    { name: 'Auto Clicker',       cat: 'misc'        },
    { name: 'Auto Eat',           cat: 'misc'        },
    { name: 'Auto Firework',      cat: 'misc'        },
    { name: 'Auto Log',           cat: 'misc'        },
    { name: 'Auto Loot',          cat: 'misc'        },
    { name: 'Auto Mine',          cat: 'misc'        },
    { name: 'Auto Tool',          cat: 'misc'        },
    { name: 'Auto TPA',           cat: 'misc'        },
    { name: 'Cord Snapper',       cat: 'misc'        },
    { name: 'Elytra Glide',       cat: 'misc'        },
    { name: 'Fast Place',         cat: 'misc'        },
    { name: 'Freecam',            cat: 'misc'        },
    { name: 'Key Pearl',          cat: 'misc'        },
    { name: 'Key Wind Charge',    cat: 'misc'        },
    { name: 'Name Protect',       cat: 'misc'        },
    { name: 'Sprint',             cat: 'misc'        },
    { name: 'Skin Protect',       cat: 'misc'        },
    { name: 'Auto Reconnect',     cat: 'misc'        },
    // ---- DONUT ----
    { name: 'Anti Trap',          cat: 'donut'       },
    { name: 'Auction Sniper',     cat: 'donut'       },
    { name: 'Auto Sell',          cat: 'donut'       },
    { name: 'Auto Spawner Sell',  cat: 'donut'       },
    { name: 'Item Dropper',       cat: 'donut'       },
    { name: 'Netherite Finder',   cat: 'donut'       },
    { name: 'RTP Base Finder',    cat: 'donut'       },
    { name: 'Auto Shulker Buy',   cat: 'donut'       },
    { name: 'Tunnel Base Finder', cat: 'donut'       },
    { name: 'Fake Stats',         cat: 'donut'       },
    { name: 'Spawner Protect',    cat: 'donut'       },
    { name: 'Chunk Finder',       cat: 'donut'       },
    { name: 'Sus Chunk Finder',   cat: 'donut'       },
    // ---- BASEFINDING ----
    { name: 'Seed Chunk Finder',  cat: 'basefinding' },
    { name: 'Hole ESP',           cat: 'basefinding' },
    { name: 'Light Finder',       cat: 'basefinding' },
    { name: 'Jungle Finder',      cat: 'basefinding' },
    { name: 'Suspicious ESP',     cat: 'basefinding' },
    { name: 'Stash Finder',       cat: 'basefinding' },
    { name: 'Coords Logger',      cat: 'basefinding' },
    { name: 'Player Radar',       cat: 'basefinding' },
    // ---- RENDER ----
    { name: 'Ore Sim',            cat: 'render'      },
    { name: 'Fullbright',         cat: 'render'      },
    { name: 'Swing Speed',        cat: 'render'      },
    { name: 'Jump Circles',       cat: 'render'      },
    { name: 'HUD',                cat: 'render'      },
    { name: 'Player ESP',         cat: 'render'      },
    { name: 'Storage ESP',        cat: 'render'      },
    { name: 'Block ESP',          cat: 'render'      },
    { name: 'Target HUD',         cat: 'render'      },
    { name: 'RealHitBox',         cat: 'render'      },
    { name: 'Free Look',          cat: 'render'      },
    { name: 'Crystal ESP',        cat: 'render'      },
    { name: 'Xray',               cat: 'render'      },
  ];

  const grid = document.getElementById('module-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  function render(filter) {
    grid.innerHTML = '';
    const list = filter === 'all' ? modules : modules.filter(m => m.cat === filter);
    list.forEach((m, i) => {
      const chip = document.createElement('div');
      chip.className = 'module-chip';
      chip.dataset.cat = m.cat;
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
