/* ════════════════════════════════════════════════════
   VISHWANATHAN R — PORTFOLIO JAVASCRIPT
   Features: Loader · Canvas Grid · Custom Cursor
             Typed Text · Scroll Reveal · Skill Bars
             Counters · Navbar · Magnetic Buttons
             Mobile Menu · Parallax
════════════════════════════════════════════════════ */

"use strict";

/* ══════════════════════════════════════════
   1. LOADER
══════════════════════════════════════════ */
(function initLoader() {
  const loader  = document.getElementById("loader");
  const fill    = loader.querySelector(".loader-fill");
  const percent = document.getElementById("loaderPercent");

  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 12 + 3;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);

      fill.style.width = "100%";
      percent.textContent = "100%";

      setTimeout(() => {
        loader.classList.add("hidden");
        document.body.style.overflow = "";
        startAll();
      }, 500);
    } else {
      fill.style.width = progress + "%";
      percent.textContent = Math.floor(progress) + "%";
    }
  }, 60);

  document.body.style.overflow = "hidden";
})();

/* ══════════════════════════════════════════
   2. BACKGROUND CANVAS — GRID + PARTICLES
══════════════════════════════════════════ */
function initCanvas() {
  const canvas = document.getElementById("bgCanvas");
  const ctx    = canvas.getContext("2d");
  let W, H;

  const GRID_SIZE  = 60;
  const DOT_RADIUS = 1;
  let   particles  = [];
  let   mouse      = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles(n = 60) {
    particles = [];
    for (let i = 0; i < n; i++) {
      particles.push({
        x:   Math.random() * W,
        y:   Math.random() * H,
        vx:  (Math.random() - 0.5) * 0.4,
        vy:  (Math.random() - 0.5) * 0.4,
        r:   Math.random() * 1.2 + 0.3,
        a:   Math.random() * 0.4 + 0.05,
      });
    }
  }

  function drawGrid() {
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth   = 0.5;

    for (let x = 0; x < W; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // dots at intersections
    for (let x = 0; x <= W; x += GRID_SIZE) {
      for (let y = 0; y <= H; y += GRID_SIZE) {
        const dist = Math.hypot(x - mouse.x, y - mouse.y);
        const glow = Math.max(0, 1 - dist / 200);
        ctx.beginPath();
        ctx.arc(x, y, DOT_RADIUS + glow * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,160,${0.06 + glow * 0.4})`;
        ctx.fill();
      }
    }
  }

  function drawParticles() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      const dist     = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      const mouseAlpha = Math.max(0, 1 - dist / 150) * 0.4;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,229,160,${p.a + mouseAlpha})`;
      ctx.fill();
    });

    // connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x,
                                particles[i].y - particles[j].y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,229,160,${(1 - dist / 120) * 0.08})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    drawParticles();
    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", () => { resize(); createParticles(); });
  window.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  resize();
  createParticles();
  loop();
}

/* ══════════════════════════════════════════
   3. CUSTOM CURSOR
══════════════════════════════════════════ */
function initCursor() {
  const dot  = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  let   rx = 0, ry = 0;

  window.addEventListener("mousemove", e => {
    dot.style.left = e.clientX + "px";
    dot.style.top  = e.clientY + "px";
    rx += (e.clientX - rx) * 0.12;
    ry += (e.clientY - ry) * 0.12;
    ring.style.left = rx + "px";
    ring.style.top  = ry + "px";
  });

  function smoothRing() {
    requestAnimationFrame(smoothRing);
    const ex = parseFloat(dot.style.left) || 0;
    const ey = parseFloat(dot.style.top)  || 0;
    rx += (ex - rx) * 0.12;
    ry += (ey - ry) * 0.12;
    ring.style.left = rx + "px";
    ring.style.top  = ry + "px";
  }
  smoothRing();

  // Hover effect on interactive elements
  const hoverEls = document.querySelectorAll(
    "a, button, .cert-card, .contact-card, .tl-card, .skill-item, .pill"
  );
  hoverEls.forEach(el => {
    el.addEventListener("mouseenter", () => ring.classList.add("hovering"));
    el.addEventListener("mouseleave", () => ring.classList.remove("hovering"));
  });
}

/* ══════════════════════════════════════════
   4. NAVBAR — scroll shrink + active link
══════════════════════════════════════════ */
function initNavbar() {
  const navbar  = document.getElementById("navbar");
  const links   = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Active link highlight
    let current = "";
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 150) {
        current = sec.id;
      }
    });

    links.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  }, { passive: true });
}

/* ══════════════════════════════════════════
   5. MOBILE MENU
══════════════════════════════════════════ */
function initMobileMenu() {
  const btn  = document.getElementById("hamburger");
  const menu = document.getElementById("mobileMenu");
  const links = menu.querySelectorAll(".mob-link");

  btn.addEventListener("click", () => {
    btn.classList.toggle("open");
    menu.classList.toggle("open");
    document.body.style.overflow = menu.classList.contains("open") ? "hidden" : "";
  });

  links.forEach(link => {
    link.addEventListener("click", () => {
      btn.classList.remove("open");
      menu.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
}

/* ══════════════════════════════════════════
   6. TYPED TEXT
══════════════════════════════════════════ */
function initTyped() {
  const el    = document.getElementById("typedOutput");
  const roles = [
    "Python Developer",
    "RPA Automation Engineer",
    "Web Developer",
    "Database Enthusiast",
    "Tech Learner",
  ];

  let ri = 0, ci = 0, deleting = false;

  function type() {
    const role = roles[ri];
    el.textContent = deleting ? role.slice(0, ci--) : role.slice(0, ci++);

    if (!deleting && ci > role.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }

    if (deleting && ci < 0) {
      deleting = false;
      ri = (ri + 1) % roles.length;
      ci = 0;
      setTimeout(type, 300);
      return;
    }

    setTimeout(type, deleting ? 40 : 85);
  }

  setTimeout(type, 2000);
}

/* ══════════════════════════════════════════
   7. SCROLL REVEAL  (Intersection Observer)
══════════════════════════════════════════ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    ".reveal-up, .reveal-left, .reveal-right, .tl-item, .cert-card"
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;

        setTimeout(() => {
          el.classList.add("visible");
          triggerSkillBars(el);
        }, delay);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
}

/* ── Skill bar fill helper ── */
function triggerSkillBars(el) {
  // If the element itself is a skill-fill parent
  el.querySelectorAll(".skill-fill").forEach(bar => {
    const pct = bar.closest(".skill-item")?.dataset.pct;
    if (pct) bar.style.width = pct + "%";
  });
}

/* ── Also observe skill columns directly ── */
function initSkillBars() {
  const cols = document.querySelectorAll(".skills-col");
  const obs  = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".skill-item").forEach((item, i) => {
          const bar = item.querySelector(".skill-fill");
          const pct = item.dataset.pct;
          if (bar && pct) {
            setTimeout(() => {
              bar.style.width = pct + "%";
            }, i * 120);
          }
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  cols.forEach(col => obs.observe(col));
}

/* ══════════════════════════════════════════
   8. ANIMATED COUNTERS
══════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll(".stat-num[data-count]");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el     = entry.target;
      const target = parseInt(el.dataset.count);
      const isYear = target > 100;
      const dur    = isYear ? 1200 : 900;
      const start  = isYear ? target - 30 : 0;
      const startTime = performance.now();

      function update(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / dur, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        const value    = Math.floor(start + (target - start) * eased);

        el.textContent = value.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target.toLocaleString();
        }
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ══════════════════════════════════════════
   9. MAGNETIC BUTTON EFFECT
══════════════════════════════════════════ */
function initMagneticButtons() {
  const btns = document.querySelectorAll(".magnetic");

  btns.forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const rect   = btn.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) * 0.3;
      const dy     = (e.clientY - cy) * 0.3;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
      btn.style.transition = "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)";
      setTimeout(() => { btn.style.transition = ""; }, 500);
    });
  });
}

/* ══════════════════════════════════════════
   10. PARALLAX — hero bg text
══════════════════════════════════════════ */
function initParallax() {
  const bgText = document.querySelector(".hero-bg-text");
  if (!bgText) return;

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    bgText.style.transform = `translateY(calc(-50% + ${scrolled * 0.25}px))`;
  }, { passive: true });
}

/* ══════════════════════════════════════════
   11. GLITCH HOVER on name lines
══════════════════════════════════════════ */
function initGlitch() {
  const lines = document.querySelectorAll(".name-line");

  lines.forEach(line => {
    line.addEventListener("mouseenter", () => {
      line.style.animation = "nameGlitch 0.4s steps(2) forwards";
    });
    line.addEventListener("animationend", () => {
      line.style.animation = "";
    });
  });

  // Inject @keyframes dynamically
  const style = document.createElement("style");
  style.textContent = `
    @keyframes nameGlitch {
      0%   { clip-path: inset(0 0 100% 0); transform: translateX(0); }
      20%  { clip-path: inset(20% 0 40% 0); transform: translateX(-4px); }
      40%  { clip-path: inset(60% 0 20% 0); transform: translateX(4px); }
      60%  { clip-path: inset(10% 0 70% 0); transform: translateX(-2px); }
      80%  { clip-path: inset(80% 0 5% 0);  transform: translateX(2px); }
      100% { clip-path: inset(0 0 0 0);      transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);
}

/* ══════════════════════════════════════════
   12. ACTIVE SECTION PROGRESS LINE
══════════════════════════════════════════ */
function initProgressLine() {
  const progressEl = document.createElement("div");
  progressEl.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    background: linear-gradient(to right, #00e5a0, #00bcd4);
    box-shadow: 0 0 8px rgba(0,229,160,0.5);
    z-index: 600;
    width: 0%;
    transition: width 0.1s linear;
  `;
  document.body.appendChild(progressEl);

  window.addEventListener("scroll", () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const progress   = (scrollTop / docHeight) * 100;
    progressEl.style.width = progress + "%";
  }, { passive: true });
}

/* ══════════════════════════════════════════
   13. CERT CARD TILT
══════════════════════════════════════════ */
function initTilt() {
  const cards = document.querySelectorAll(".cert-card");

  cards.forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `
        translateY(-6px)
        rotateX(${-dy * 6}deg)
        rotateY(${dx * 6}deg)
      `;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* ══════════════════════════════════════════
   BOOT — called after loader finishes
══════════════════════════════════════════ */
function startAll() {
  initCanvas();
  initCursor();
  initNavbar();
  initMobileMenu();
  initTyped();
  initScrollReveal();
  initSkillBars();
  initCounters();
  initMagneticButtons();
  initParallax();
  initGlitch();
  initProgressLine();
  initTilt();
}
