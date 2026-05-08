/* ═══════════════════════════════════════
   ARTEMIS — script.js
   ═══════════════════════════════════════ */

/* ── CANVAS BACKGROUND ── */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, stars = [], grid = [], mouse = { x: -9999, y: -9999 };
  const STAR_N = 260;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildGrid();
  }

  function buildGrid() {
    grid = [];
    const spacing = 60;
    const cols = Math.ceil(W / spacing) + 1;
    const rows = Math.ceil(H / spacing) + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        grid.push({ x: c * spacing, y: r * spacing });
      }
    }
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < STAR_N; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.3 + 0.2,
        a: Math.random() * 0.7 + 0.15,
        spd: Math.random() * 0.12 + 0.025,
        td: Math.random() * 0.012 + 0.004,
        tdir: Math.random() > 0.5 ? 1 : -1,
      });
    }
  }

  function draw(now) {
    ctx.clearRect(0, 0, W, H);

    /* dot grid */
    for (const p of grid) {
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const intensity = Math.max(0, 1 - dist / 220);
      const base = 0.06;
      const alpha = base + intensity * 0.28;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59,120,255,${alpha})`;
      ctx.fill();
    }

    /* stars */
    for (const s of stars) {
      s.a += s.td * s.tdir;
      if (s.a > 0.85 || s.a < 0.08) s.tdir *= -1;
      s.y -= s.spd;
      if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,210,255,${s.a})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); initStars(); }, { passive: true });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });

  resize();
  initStars();
  requestAnimationFrame(draw);
})();


/* ── NAVBAR ── */
(function () {
  const nav = document.getElementById('navbar');
  const onScroll = () => nav.classList.toggle('stuck', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ── HAMBURGER ── */
(function () {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-nav');
  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
    btn.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { menu.classList.remove('open'); btn.classList.remove('open'); });
  });
})();


/* ── STAT COUNT-UP ── */
(function () {
  const els = document.querySelectorAll('.stat-n');
  let done = false;

  function ease(t) { return 1 - Math.pow(1 - t, 3); }

  function run(el) {
    const target = parseInt(el.dataset.to, 10);
    const dur = 1600;
    const t0 = performance.now();
    function frame(now) {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.floor(ease(p) * target);
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = target;
    }
    requestAnimationFrame(frame);
  }

  const obs = new IntersectionObserver(entries => {
    if (done) return;
    if (entries.some(e => e.isIntersecting)) {
      done = true;
      els.forEach(el => run(el));
      obs.disconnect();
    }
  }, { threshold: 0.3 });

  const stats = document.querySelector('.hero-stats');
  if (stats) obs.observe(stats);
})();


/* ── SCROLL REVEAL ── */
(function () {
  const items = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(el => obs.observe(el));
})();


/* ── MODULE DATA ── */
const MODULES = [
  /* ── COMBAT ── */
  { name: 'AnchorMacro',    cat: 'combat',  type: 'macro',  desc: 'Automates full respawn anchor placement and activation sequence for consistent crystal PvP setups.' },
  { name: 'DoubleAnchor',   cat: 'combat',  type: 'macro',  desc: 'Executes the double-anchor technique to maximise explosion damage output in crystal PvP.' },
  { name: 'SafeAnchor',     cat: 'combat',  type: 'macro',  desc: 'Places and activates anchors without dealing self-damage — ideal for risky combat situations.' },
  { name: 'CrystalMacro',   cat: 'combat',  type: 'macro',  desc: 'Automatically places end crystals at optimal positions and detonates them against targets.' },
  { name: 'CrystalAura',    cat: 'combat',  type: 'toggle', desc: 'Full crystal aura with intelligent target-selection logic, placement distance control, and swing timing.' },
  { name: 'AutoEat',        cat: 'combat',  type: 'toggle', desc: 'Monitors hunger level and automatically consumes food from inventory to maintain saturation.' },
  { name: 'AutoTotem',      cat: 'combat',  type: 'toggle', desc: 'Detects near-death situations and instantly swaps totem of undying into the offhand slot.' },
  { name: 'AutoLog',        cat: 'combat',  type: 'toggle', desc: 'Automatically disconnects from the server the moment health drops below a configurable threshold.' },
  { name: 'ItemSwap',       cat: 'combat',  type: 'toggle', desc: 'Intelligently manages hotbar layout — swaps weapons, tools, and gear for the active combat situation.' },
  { name: 'MaceSwap',       cat: 'combat',  type: 'toggle', desc: 'Automatically equips the mace for wind-charge combo attacks and re-equips sword afterward.' },
  { name: 'HoleFill',       cat: 'combat',  type: 'toggle', desc: 'Detects when enemies step into safety holes and places obsidian to block their escape.' },
  { name: 'SurroundHold',   cat: 'combat',  type: 'toggle', desc: 'Maintains an obsidian surround block structure around your feet during crystal PvP engagements.' },
  { name: 'PearlTimer',     cat: 'combat',  type: 'hud',    desc: 'Displays a live countdown HUD element tracking the ender pearl usage cooldown.' },
  { name: 'ArmorAlert',     cat: 'combat',  type: 'toggle', desc: 'Fires a screen notification when any equipped armor piece drops below critical durability.' },
  { name: 'NoFall',         cat: 'combat',  type: 'toggle', desc: 'Prevents fall damage by placing a block under the player just before landing impact.' },
  { name: 'Velocity',       cat: 'combat',  type: 'toggle', desc: 'Reduces incoming knockback by a configurable percentage — stay in position during fights.' },
  { name: 'KillAura',       cat: 'combat',  type: 'toggle', desc: 'Automatically attacks the nearest hostile target within a configurable reach range.' },
  { name: 'TPSDisplay',     cat: 'combat',  type: 'hud',    desc: "Shows the server's current TPS as a HUD element for precise crystal timing." },
  { name: 'CombatLog',      cat: 'combat',  type: 'toggle', desc: 'Logs all combat engagements, kills, and deaths to a persistent session history.' },
  { name: 'AntiKB',         cat: 'combat',  type: 'toggle', desc: 'Cancels or significantly reduces knockback received from enemy attacks and explosions.' },
  { name: 'AutoGapple',     cat: 'combat',  type: 'toggle', desc: 'Detects low health and automatically eats a golden apple from inventory without manual input.' },
  { name: 'ItemDrop',       cat: 'combat',  type: 'toggle', desc: 'Drops specified item types from inventory instantly — useful for clearing bags mid-fight.' },
  { name: 'FastPlace',      cat: 'combat',  type: 'toggle', desc: 'Removes the vanilla block placement delay restriction for crystal and anchor spam.' },
  { name: 'TimerMacro',     cat: 'combat',  type: 'macro',  desc: 'Adjusts client-side game tick speed to gain a timing advantage in crystal PvP scenarios.' },
  { name: 'BowAimbot',      cat: 'combat',  type: 'toggle', desc: 'Assists with bow and crossbow aim using predictive trajectory calculation for moving targets.' },

  /* ── VISUAL & ESP ── */
  { name: 'PlayerESP',      cat: 'visual',  type: 'esp',    desc: 'Renders coloured outlines or boxes around all players visible through terrain and structures.' },
  { name: 'BaseESP',        cat: 'visual',  type: 'esp',    desc: 'Detects active chunk loading patterns to identify and highlight enemy base locations.' },
  { name: 'MobESP',         cat: 'visual',  type: 'esp',    desc: 'Renders ESP overlays on hostile and passive mobs through walls and obstacles.' },
  { name: 'CrystalESP',     cat: 'visual',  type: 'esp',    desc: 'Highlights all placed end crystals in the world — never miss a placed crystal in a fight.' },
  { name: 'HoleESP',        cat: 'visual',  type: 'esp',    desc: 'Identifies and marks bedrock and obsidian holes you can stand in safely during crystal PvP.' },
  { name: 'ChunkFinder',    cat: 'visual',  type: 'esp',    desc: 'Visually highlights loaded and recently rendered chunks to identify active player areas.' },
  { name: 'StorageESP',     cat: 'visual',  type: 'esp',    desc: 'Renders ESP highlights on all container blocks — chests, shulker boxes, barrels, and hoppers.' },
  { name: 'FullBright',     cat: 'visual',  type: 'toggle', desc: 'Forces maximum client-side brightness — complete visibility in caves, nether, and deep underground.' },
  { name: 'TotemOverlay',   cat: 'visual',  type: 'hud',    desc: 'Persistent HUD showing current totem count, offhand slot status, and totem pops.' },
  { name: 'LightDebug',     cat: 'visual',  type: 'toggle', desc: 'Overlays light level values on blocks to identify mob spawn-eligible surfaces.' },
  { name: 'EntityESP',      cat: 'visual',  type: 'esp',    desc: 'General-purpose ESP renderer for all entity types with configurable colours per entity class.' },
  { name: 'ItemESP',        cat: 'visual',  type: 'esp',    desc: 'Highlights item entities dropped on the ground — spot loot from a distance.' },
  { name: 'XRay',           cat: 'visual',  type: 'toggle', desc: 'Hides non-valuable blocks to reveal ores, containers, and configurable block types through terrain.' },
  { name: 'Tracers',        cat: 'visual',  type: 'esp',    desc: 'Draws directional lines from the screen centre to tracked players for real-time position tracking.' },
  { name: 'Nametags',       cat: 'visual',  type: 'toggle', desc: 'Replaces vanilla nametags with enhanced versions showing health, distance, armour, and ping.' },
  { name: 'HitColor',       cat: 'visual',  type: 'toggle', desc: 'Flashes a customisable colour on entities when you land a hit — configurable intensity.' },
  { name: 'NoHurtCam',      cat: 'visual',  type: 'toggle', desc: 'Disables the camera shake and tilt effect that triggers when you take any damage.' },
  { name: 'CleanView',      cat: 'visual',  type: 'toggle', desc: 'Removes first-person particle effects (hit splashes, potion clouds) for a cleaner view.' },
  { name: 'TimeChanger',    cat: 'visual',  type: 'toggle', desc: "Forces a specific client-side time of day regardless of the server's current time." },
  { name: 'Ambience',       cat: 'visual',  type: 'toggle', desc: 'Custom sky colour, fog density, and ambient atmosphere visual effects for a personalised look.' },

  /* ── UTILITY & AUTOMATION ── */
  { name: 'AutoMiner',      cat: 'utility', type: 'auto',   desc: 'Scans for and mines specified ore types or all ores in a configurable radius automatically.' },
  { name: 'AutoTreeFarmer', cat: 'utility', type: 'auto',   desc: 'Chops trees from base to crown and automatically replants saplings for continuous farming.' },
  { name: 'AutoTool',       cat: 'utility', type: 'auto',   desc: 'Selects and equips the highest-efficiency tool for the block you are currently mining.' },
  { name: 'BaseDigger',     cat: 'utility', type: 'auto',   desc: 'Automates the process of digging into enemy bases using loaded schematics and path logic.' },
  { name: 'AutoReconnect',  cat: 'utility', type: 'auto',   desc: 'Automatically reconnects to the last server after any disconnect, kick, or timeout.' },
  { name: 'StashFinder',    cat: 'utility', type: 'auto',   desc: 'Actively searches nearby terrain for player-placed storage containers and logs GPS coordinates.' },
  { name: 'PlayerDetect',   cat: 'utility', type: 'toggle', desc: 'Fires a configurable alert — sound, chat, or HUD flash — whenever a player enters detection range.' },
  { name: 'TabDetector',    cat: 'utility', type: 'toggle', desc: 'Monitors the server tab list in real time and notifies on every player join and leave event.' },
  { name: 'AutoFisher',     cat: 'utility', type: 'auto',   desc: 'Detects fishing rod float movement and automatically reels and re-casts for AFK fishing.' },
  { name: 'AutoFarm',       cat: 'utility', type: 'auto',   desc: 'Harvests all mature crops in range and replants seeds — supports wheat, carrot, potato, and more.' },
  { name: 'AutoBuild',      cat: 'utility', type: 'auto',   desc: 'Constructs loaded schematic blueprints block by block with automatic material sourcing.' },
  { name: 'SchematicBuilder',cat:'utility', type: 'auto',   desc: 'Imports external schematic files and manages paste operations directly in the game world.' },
  { name: 'PathFinder',     cat: 'utility', type: 'auto',   desc: 'Calculates and navigates automatically to any saved waypoint using A* pathfinding.' },
  { name: 'ElytraFly',      cat: 'utility', type: 'toggle', desc: 'Enhanced elytra flight controller with altitude hold, automatic firework usage, and boost modes.' },
  { name: 'FireworksHelper', cat:'utility', type: 'auto',   desc: 'Monitors elytra flight speed and automatically uses fireworks to maintain optimal altitude.' },
  { name: 'ChestStealer',   cat: 'utility', type: 'auto',   desc: 'Automatically transfers all items from opened containers into your inventory.' },
  { name: 'AntiAFK',        cat: 'utility', type: 'toggle', desc: 'Prevents AFK kick timers using randomised small movements, head turns, and jump intervals.' },
  { name: 'AutoWalk',       cat: 'utility', type: 'toggle', desc: 'Moves the player continuously in a direction without requiring any key to be held.' },
  { name: 'Sprint',         cat: 'utility', type: 'toggle', desc: 'Keeps sprint state active permanently without holding any key — never stop sprinting.' },
  { name: 'AutoDrop',       cat: 'utility', type: 'auto',   desc: 'Automatically drops specified item types from inventory when they are picked up.' },
  { name: 'InventoryManager',cat:'utility', type: 'toggle', desc: 'Sorts inventory contents into a configurable order on demand or on a timer.' },
  { name: 'AutoSprint',     cat: 'utility', type: 'toggle', desc: 'Engages sprint mode automatically when moving without needing the double-tap or hold.' },
  { name: 'FastBreak',      cat: 'utility', type: 'toggle', desc: 'Removes the server-imposed mining animation delay for faster block destruction speed.' },
  { name: 'Scaffold',       cat: 'utility', type: 'toggle', desc: 'Automatically places blocks beneath the player while moving — bridge over gaps effortlessly.' },
  { name: 'Nuker',          cat: 'utility', type: 'toggle', desc: 'Mines and destroys all blocks within a configurable sphere radius at maximum speed.' },

  /* ── DONUT SMP ── */
  { name: 'AhSell',         cat: 'donut',   type: 'donut',  desc: 'Automates the full auction house listing workflow — price, list, and manage items without manual input.' },
  { name: 'AutoSell',       cat: 'donut',   type: 'donut',  desc: 'Sells a configured inventory list to DonutSMP player shops instantly on command or interval.' },
  { name: 'AuctionSniper',  cat: 'donut',   type: 'donut',  desc: 'Monitors auction house listings in real time and auto-buys underpriced items below your threshold.' },
  { name: 'AutoBoneOrder',  cat: 'donut',   type: 'donut',  desc: 'Automates the bone meal order fulfilment loop on DonutSMP — sell orders, collect payment, repeat.' },
  { name: 'LegitTridentFly',cat: 'donut',   type: 'donut',  desc: 'Flies using the trident riptide mechanic in a way that appears natural to avoid detection.' },
  { name: 'RTPBaseFinder',  cat: 'donut',   type: 'donut',  desc: 'Uses random teleport commands to scout new regions and automatically logs base coordinate candidates.' },
  { name: 'HomeSpoof',      cat: 'donut',   type: 'donut',  desc: 'Sets home locations silently without broadcasting coordinates in chat or triggering server alerts.' },
  { name: 'ScoreboardHider',cat: 'donut',   type: 'donut',  desc: "Hides or spoofs the DonutSMP scoreboard display to prevent onlookers from reading your stats." },
  { name: 'AutoShop',       cat: 'donut',   type: 'donut',  desc: 'Automates buying and selling at DonutSMP player chest shops with configurable item lists.' },
  { name: 'CrateOpener',    cat: 'donut',   type: 'donut',  desc: 'Opens DonutSMP crates automatically and collects all rewards without any manual clicking.' },
  { name: 'MobCoinFarm',    cat: 'donut',   type: 'donut',  desc: 'Runs a complete automated mob coin farming loop — kill, collect, and bank coins continuously.' },
  { name: 'ShulkerPeek',    cat: 'donut',   type: 'donut',  desc: 'Previews shulker box inventory contents by hovering over them without opening the box.' },
  { name: 'AutoMessage',    cat: 'donut',   type: 'donut',  desc: 'Sends configurable chat messages on a timer or in response to specific server events.' },
  { name: 'IslandFinder',   cat: 'donut',   type: 'donut',  desc: 'Identifies and logs coordinate data for active player islands in the DonutSMP world.' },
  { name: 'BalanceCheck',   cat: 'donut',   type: 'hud',    desc: 'Fetches and displays your current DonutSMP economy balance as a persistent HUD element.' },

  /* ── CLIENT & HUD ── */
  { name: 'HUD Editor',     cat: 'client',  type: 'hud',    desc: 'Full drag-and-drop editor for all HUD elements — reposition, resize, and toggle any HUD component.' },
  { name: 'Discord RPC',    cat: 'client',  type: 'toggle', desc: 'Updates your Discord rich presence to show Artemis, your current server, and session stats.' },
  { name: 'Friends List',   cat: 'client',  type: 'toggle', desc: 'Mark players as trusted friends — they receive unique ESP colours and bypass hostile module targeting.' },
  { name: 'Keybind Manager',cat: 'client',  type: 'toggle', desc: 'Assign any keyboard key to toggle any module — supports multiple modules per key and modifiers.' },
  { name: 'Config Manager', cat: 'client',  type: 'toggle', desc: 'Save complete module configurations as named profiles and load them instantly for different play styles.' },
  { name: 'ModuleSearch',   cat: 'client',  type: 'toggle', desc: 'Type-to-search interface to find, toggle, and jump to settings for any module by name.' },
  { name: 'ClickGUI',       cat: 'client',  type: 'toggle', desc: 'Full graphical module management interface with category panels, sliders, toggles, and real-time preview.' },
  { name: 'TabGUI',         cat: 'client',  type: 'toggle', desc: 'Compact tab-based quick-access module panel for players who prefer minimal screen space usage.' },
  { name: 'Waypoints',      cat: 'client',  type: 'toggle', desc: 'Save named coordinates and navigate to them with directional HUD indicators and distance readouts.' },
  { name: 'Notifications',  cat: 'client',  type: 'hud',    desc: 'In-game toast-style notifications for module state changes, alerts, and player detection events.' },
  { name: 'Announcements',  cat: 'client',  type: 'toggle', desc: 'Displays Artemis news, changelogs, and update announcements automatically on server join.' },
];

const TYPE_LABEL = {
  toggle: 'TOGGLE',
  macro:  'MACRO',
  esp:    'ESP',
  hud:    'HUD',
  auto:   'AUTO',
  donut:  'DONUT',
};

/* ── MODULE GRID RENDER ── */
(function () {
  const grid   = document.getElementById('mod-grid');
  const empty  = document.getElementById('mod-empty');
  const search = document.getElementById('mod-search');
  const fltBtns= document.querySelectorAll('.flt');

  let currentCat = 'all';
  let currentQ   = '';

  function render() {
    grid.innerHTML = '';
    const q = currentQ.toLowerCase().trim();
    const list = MODULES.filter(m => {
      const catOk = currentCat === 'all' || m.cat === currentCat;
      const qOk   = !q || m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q);
      return catOk && qOk;
    });

    if (list.length === 0) {
      empty.classList.remove('hidden');
    } else {
      empty.classList.add('hidden');
      list.forEach((m, i) => {
        const card = document.createElement('div');
        card.className = 'mod-card';
        card.style.animationDelay = `${Math.min(i * 0.018, 0.5)}s`;
        card.innerHTML = `
          <div class="mod-cat-stripe cat-${m.cat}"></div>
          <div class="mod-card-top">
            <span class="mod-name">${m.name}</span>
            <span class="mod-type type-${m.type}">${TYPE_LABEL[m.type]}</span>
          </div>
          <p class="mod-desc">${m.desc}</p>
        `;
        grid.appendChild(card);
      });
    }
  }

  fltBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      fltBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.dataset.cat;
      render();
    });
  });

  let debounceTimer;
  search.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      currentQ = search.value;
      render();
    }, 120);
  });

  render();
})();


/* ── DOWNLOAD BUTTON RIPPLE ── */
(function () {
  const btn = document.getElementById('dl-btn');
  if (!btn) return;

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.2;
    const ripple = document.createElement('span');
    Object.assign(ripple.style, {
      position: 'absolute',
      width: size + 'px', height: size + 'px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,.14)',
      top: (e.clientY - rect.top - size / 2) + 'px',
      left: (e.clientX - rect.left - size / 2) + 'px',
      transform: 'scale(0)',
      animation: '_ripple .55s ease forwards',
      pointerEvents: 'none',
    });
    if (!document.getElementById('_ripple-style')) {
      const s = document.createElement('style');
      s.id = '_ripple-style';
      s.textContent = '@keyframes _ripple{to{transform:scale(1);opacity:0}}';
      document.head.appendChild(s);
    }
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
})();


/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
