/* ===== Preloader ===== */
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('preloader').classList.add('hidden'), 800);
});

/* ===== Custom Cursor ===== */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
if (cursorDot && cursorRing) {
    document.addEventListener('mousemove', e => {
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
        cursorRing.style.left = e.clientX + 'px';
        cursorRing.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, button, .skill-tab, .filter-btn').forEach(el => {
        el.addEventListener('mouseenter', () => { cursorRing.style.transform = 'translate(-50%,-50%) scale(1.5)'; cursorRing.style.borderColor = 'var(--accent)'; });
        el.addEventListener('mouseleave', () => { cursorRing.style.transform = 'translate(-50%,-50%) scale(1)'; cursorRing.style.borderColor = 'var(--accent3)'; });
    });
}

/* ===== Particle Background ===== */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${this.opacity})`;
        ctx.fill();
    }
}
for (let i = 0; i < 80; i++) particles.push(new Particle());
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(124, 58, 237, ${0.08 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

/* ===== Navbar Scroll ===== */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 50;
    navbar.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('visible', window.scrollY > 400);
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== Mobile Menu ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => { hamburger.classList.remove('active'); navLinks.classList.remove('open'); });
});

/* ===== Active Nav Link on Scroll ===== */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');
const observerNav = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinkEls.forEach(l => l.classList.remove('active'));
            const active = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}, { threshold: 0.3 });
sections.forEach(s => observerNav.observe(s));

/* ===== Typing Animation ===== */
const typingEl = document.getElementById('typingText');
const words = ['web applications.', 'user experiences.', 'AI-powered tools.', 'beautiful UIs.', 'creative solutions.'];
let wordIdx = 0, charIdx = 0, isDeleting = false;
function typeEffect() {
    const current = words[wordIdx];
    typingEl.textContent = isDeleting ? current.substring(0, charIdx--) : current.substring(0, charIdx++);
    let delay = isDeleting ? 40 : 80;
    if (!isDeleting && charIdx > current.length) { delay = 2000; isDeleting = true; }
    if (isDeleting && charIdx < 0) { isDeleting = false; wordIdx = (wordIdx + 1) % words.length; delay = 400; }
    setTimeout(typeEffect, delay);
}
typeEffect();

/* ===== Counter Animation ===== */
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        const target = +counter.dataset.target;
        const duration = 2000;
        const start = performance.now();
        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}
const heroObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateCounters(); heroObserver.disconnect(); }
}, { threshold: 0.3 });
heroObserver.observe(document.getElementById('hero'));

/* ===== Scroll Animations ===== */
const animObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('[data-animate]').forEach(el => animObserver.observe(el));

/* ===== Skill Bars Animation ===== */
const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.skill-fill').forEach(bar => bar.classList.add('animated'));
        }
    });
}, { threshold: 0.3 });
document.querySelectorAll('.skills-panel').forEach(p => skillObserver.observe(p));

/* ===== Skill Tabs ===== */
document.querySelectorAll('.skill-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.skills-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = document.getElementById('panel-' + tab.dataset.tab);
        panel.classList.add('active');
        panel.querySelectorAll('.skill-fill').forEach(bar => bar.classList.add('animated'));
    });
});

/* ===== Project Filter ===== */
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.project-card').forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeUp 0.4s ease forwards';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

/* ===== Contact Form ===== */
document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const status = document.getElementById('formStatus');
    btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;
    setTimeout(() => {
        status.className = 'form-status success';
        status.textContent = '✅ Message sent successfully! I\'ll get back to you soon.';
        btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
        btn.disabled = false;
        e.target.reset();
        setTimeout(() => { status.className = 'form-status'; }, 5000);
    }, 1500);
});

/* ===== Theme Toggle (Light Mode support) ===== */
document.getElementById('themeToggle').addEventListener('click', function () {
    document.body.classList.toggle('light-mode');
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});
