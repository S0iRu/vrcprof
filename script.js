

// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // Simple animation for menu items
    if (navLinks.classList.contains('active')) {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '70px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'rgba(10, 10, 18, 0.95)';
        navLinks.style.padding = '2rem';
        navLinks.style.backdropFilter = 'blur(10px)';
    } else {
        navLinks.style.display = '';
    }
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            navLinks.style.display = '';
        }

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(13, 17, 23, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
    } else {
        navbar.style.background = 'rgba(13, 17, 23, 0.8)';
        navbar.style.boxShadow = 'none';
    }
});

// Scroll Reveal Animation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('hidden');
        } else {
            entry.target.classList.add('hidden');
        }
    });
}, observerOptions);

// Initialize: Hide elements and start observing
document.querySelectorAll('.scroll-reveal').forEach(el => {
    el.classList.add('hidden'); // Hide initially via JS
    observer.observe(el);
});

// Particle Background System
const canvas = document.getElementById('bg-particles');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 50;
const connectionDistance = 150;
const moveSpeed = 0.5;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * moveSpeed;
        this.vy = (Math.random() - 0.5) * moveSpeed;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.fillStyle = 'rgba(88, 166, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();


    }
    // requestAnimationFrame(animateParticles);
}

// initParticles();
// animateParticles();

// --- Reference Site Cursor Implementation ---

const cursorGlow = document.querySelector('.cursor-glow');
const interactables = document.querySelectorAll('a, button, .gallery-item, .world-card');

// Cursor State
let mouse = { x: -100, y: -100 }; // Start off-screen
let cursor = { x: -100, y: -100 };
let hue = 0;

// Update mouse position
document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Create trail particles on move
    if (Math.random() < 0.8) { // Increased density
        createParticle(mouse.x, mouse.y);
    }
});

// Animation Loop
function updateCursor() {
    // Smooth follow (Lerp)
    cursor.x += (mouse.x - cursor.x) * 0.04;
    cursor.y += (mouse.y - cursor.y) * 0.04;

    // Update color (Hue Cycle)
    hue = (hue + 1) % 360;
    const color = `hsla(${hue}, 80%, 60%, 0.5)`;

    // Apply styles
    cursorGlow.style.left = cursor.x + 'px';
    cursorGlow.style.top = cursor.y + 'px';
    cursorGlow.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;

    requestAnimationFrame(updateCursor);
}
updateCursor();

// Particle System
function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    document.body.appendChild(particle);

    // Randomize particle props
    const size = Math.random() * 4 + 2;
    const color = `hsl(${hue}, 100%, 70%)`;
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 30 + 10;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;

    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.background = color;
    particle.style.setProperty('--tx', tx + 'px');
    particle.style.setProperty('--ty', ty + 'px');

    // Remove after animation
    setTimeout(() => {
        particle.remove();
    }, 1000);
}

// Click Effect
document.addEventListener('click', (e) => {
    // Burst particles
    for (let i = 0; i < 12; i++) {
        createParticle(e.clientX, e.clientY);
    }

    // Scale effect
    cursorGlow.style.transform = 'translate(-50%, -50%) scale(0.8)';
    setTimeout(() => {
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
});

// Hover Interactions
interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorGlow.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
        cursorGlow.classList.remove('active');
    });
});
