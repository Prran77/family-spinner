/**
 * particles.js
 * Confetti explosion + disco background particles
 */

const Particles = (() => {

  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return { explode: function() {} };
  const ctx    = canvas.getContext('2d');
  if (!ctx) return { explode: function() {} };
  let particles = [];
  let bgParticles = [];
  let animId = null;
  let isExploding = false;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // ── Confetti particle ──────────────────────────────────────────────────────
  class Confetti {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 18;
      this.vy = -(Math.random() * 14 + 6);
      this.gravity = 0.4;
      this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      this.size = Math.random() * 10 + 5;
      this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.3;
      this.opacity = 1;
      this.drag = 0.97;
      this.wobble = Math.random() * 10;
      this.wobbleSpeed = Math.random() * 0.1 + 0.05;
      this.wobblePhase = Math.random() * Math.PI * 2;
      this.life = 1;
      this.decay = Math.random() * 0.008 + 0.008;
    }

    update() {
      this.vy += this.gravity;
      this.vx *= this.drag;
      this.vy *= this.drag;
      this.wobblePhase += this.wobbleSpeed;
      this.x += this.vx + Math.sin(this.wobblePhase) * 0.5;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.life -= this.decay;
      this.opacity = Math.max(0, this.life);
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 6;

      if (this.shape === 'rect') {
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    isDead() { return this.life <= 0 || this.y > canvas.height + 50; }
  }

  // ── Background ambient particles ─────────────────────────────────────────
  class BgParticle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.vx = (Math.random() - 0.5) * 0.2;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
    }
    update() {
      this.y += this.vy;
      this.x += this.vx;
      this.pulse += this.pulseSpeed;
      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) this.reset();
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity * (0.6 + Math.sin(this.pulse) * 0.4);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Init background particles
  for (let i = 0; i < 40; i++) bgParticles.push(new BgParticle());

  // ── Explosion ─────────────────────────────────────────────────────────────
  function explode(ownerColor) {
    if (isExploding) return;
    isExploding = true;
    canvas.classList.add('active');

    const cx = window.innerWidth / 2;
    if (ownerColor) CONFETTI_COLORS.unshift(ownerColor, ownerColor);
    const cy = window.innerHeight / 2;

    // Burst from centre
    for (let i = 0; i < 120; i++) {
      particles.push(new Confetti(cx + (Math.random() - 0.5) * 40, cy + (Math.random() - 0.5) * 40));
    }
    // Side bursts
    for (let i = 0; i < 30; i++) {
      particles.push(new Confetti(0, cy));
      particles.push(new Confetti(window.innerWidth, cy));
    }

    // Stop explosion after 4 seconds
    setTimeout(() => {
      isExploding = false;
    }, 4000);

    if (!animId) animate();
  }

  // ── Animation loop ────────────────────────────────────────────────────────
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bg particles
    bgParticles.forEach(p => { p.update(); p.draw(ctx); });

    // Confetti
    particles = particles.filter(p => !p.isDead());
    particles.forEach(p => { p.update(); p.draw(ctx); });

    if (particles.length === 0 && !isExploding) {
      canvas.classList.remove('active');
      animId = null;
      return;
    }

    animId = requestAnimationFrame(animate);
  }

  // Start ambient loop
  animate();

  return { explode };
})();
