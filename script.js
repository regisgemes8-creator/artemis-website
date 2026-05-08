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


// ---- PONG GAME ----
(function () {
  const canvas = document.getElementById('pong-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const W = 700;
  const H = 280;
  canvas.width = W;
  canvas.height = H;

  // Responsive scale
  function scaleCanvas() {
    const maxW = Math.min(window.innerWidth - 32, 700);
    canvas.style.width = maxW + 'px';
    canvas.style.height = (maxW * H / W) + 'px';
  }
  scaleCanvas();
  window.addEventListener('resize', scaleCanvas);

  const PADDLE_W = 10;
  const PADDLE_H = 70;
  const BALL_R = 7;
  const WALL_W = 14;
  const SPEED_INIT = 4.5;

  let playerY = H / 2 - PADDLE_H / 2;
  let mouseY = H / 2;

  let ball = { x: W / 2, y: H / 2, vx: -SPEED_INIT, vy: (Math.random() * 2 - 1) * 3 };
  let score = 0;
  let misses = 0;
  let gameOver = false;

  // Track mouse relative to canvas
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleY = H / rect.height;
    mouseY = (e.clientY - rect.top) * scaleY;
  });

  function resetBall(toRight) {
    ball.x = W / 2;
    ball.y = H / 2;
    const dir = toRight ? 1 : -1;
    ball.vx = SPEED_INIT * dir;
    ball.vy = (Math.random() * 2 - 1) * 3;
  }

  function draw() {
    // Background
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(4, 7, 15, 0.95)';
    ctx.fillRect(0, 0, W, H);

    // Dashed center line
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = 'rgba(59,130,246,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();
    ctx.setLineDash([]);

    // Static wall (right side)
    const wallX = W - WALL_W;
    ctx.fillStyle = 'rgba(59,130,246,0.5)';
    ctx.beginPath();
    roundRect(ctx, wallX, 0, WALL_W, H, 4);
    ctx.fill();

    // Player paddle (left side)
    const px = 20;
    playerY += (mouseY - PADDLE_H / 2 - playerY) * 0.18;
    playerY = Math.max(0, Math.min(H - PADDLE_H, playerY));

    ctx.fillStyle = '#3b82f6';
    ctx.shadowColor = 'rgba(59,130,246,0.6)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    roundRect(ctx, px, playerY, PADDLE_W, PADDLE_H, 4);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Ball
    ctx.fillStyle = '#a8c8ff';
    ctx.shadowColor = 'rgba(168,200,255,0.7)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Score
    ctx.fillStyle = 'rgba(168,200,255,0.5)';
    ctx.font = '500 13px "DM Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('score: ' + score, W / 2, 20);

    if (gameOver) {
      ctx.fillStyle = 'rgba(4,7,15,0.7)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#a8c8ff';
      ctx.font = '700 22px "Syne", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', W / 2, H / 2 - 16);
      ctx.font = '400 13px "DM Mono", monospace';
      ctx.fillStyle = 'rgba(168,200,255,0.6)';
      ctx.fillText('score: ' + score + '   —   move mouse to restart', W / 2, H / 2 + 14);
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function update() {
    if (gameOver) return;

    ball.x += ball.vx;
    ball.y += ball.vy;

    // Top / bottom bounce
    if (ball.y - BALL_R < 0) { ball.y = BALL_R; ball.vy *= -1; }
    if (ball.y + BALL_R > H) { ball.y = H - BALL_R; ball.vy *= -1; }

    // Right wall bounce
    const wallX = W - WALL_W;
    if (ball.x + BALL_R >= wallX) {
      ball.x = wallX - BALL_R;
      ball.vx *= -1;
    }

    // Player paddle hit
    const px = 20;
    if (
      ball.vx < 0 &&
      ball.x - BALL_R <= px + PADDLE_W &&
      ball.x - BALL_R >= px &&
      ball.y >= playerY &&
      ball.y <= playerY + PADDLE_H
    ) {
      ball.x = px + PADDLE_W + BALL_R;
      const hitPos = (ball.y - playerY) / PADDLE_H - 0.5; // -0.5 to 0.5
      ball.vy = hitPos * 8;
      // Slight speed increase
      const speed = Math.min(Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy) + 0.2, 12);
      const angle = Math.atan2(ball.vy, Math.abs(ball.vx));
      ball.vx = speed * Math.cos(angle);
      ball.vy = speed * Math.sin(angle);
      score++;
    }

    // Ball exits left — miss
    if (ball.x + BALL_R < 0) {
      misses++;
      if (misses >= 3) {
        gameOver = true;
      } else {
        resetBall(false);
      }
    }
  }

  // Restart on mouse move after game over
  canvas.addEventListener('mousemove', () => {
    if (gameOver) {
      gameOver = false;
      score = 0;
      misses = 0;
      resetBall(false);
    }
  });

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  loop();
})();
