// ===================================
// THEME TOGGLE WITH LOCALSTORAGE
// ===================================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ===================================
// MOBILE NAVIGATION TOGGLE
// ===================================
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.querySelector('.nav-menu');

mobileToggle.addEventListener('click', () => {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
});

// ===================================
// PARALLAX HERO EFFECT
// ===================================
const parallaxLayers = document.querySelectorAll('.parallax-layer');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    parallaxLayers.forEach((layer, index) => {
        const speed = (index + 1) * 0.3;
        layer.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===================================
// SCROLL REVEAL ANIMATIONS
// ===================================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    },
    {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
    }
);

revealElements.forEach((el) => revealObserver.observe(el));

// ===================================
// 3D TILT EFFECT FOR PROJECT CARDS
// ===================================
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// ===================================
// 3D SKILLS CUBE ROTATION
// ===================================
const skillsCube = document.getElementById('skillsCube');
let currentRotationX = -20;
let currentRotationY = 30;
let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;

// Keyboard controls
window.addEventListener('keydown', (e) => {
    const rotationStep = 15;
    
    switch (e.key) {
        case 'ArrowUp':
            currentRotationX += rotationStep;
            break;
        case 'ArrowDown':
            currentRotationX -= rotationStep;
            break;
        case 'ArrowLeft':
            currentRotationY -= rotationStep;
            break;
        case 'ArrowRight':
            currentRotationY += rotationStep;
            break;
        default:
            return;
    }
    
    updateCubeRotation();
});

// Mouse drag controls
skillsCube.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
    skillsCube.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - previousMouseX;
    const deltaY = e.clientY - previousMouseY;
    
    currentRotationY += deltaX * 0.5;
    currentRotationX -= deltaY * 0.5;
    
    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
    
    updateCubeRotation();
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    skillsCube.style.cursor = 'grab';
});

// Touch controls for mobile
let previousTouchX = 0;
let previousTouchY = 0;

skillsCube.addEventListener('touchstart', (e) => {
    previousTouchX = e.touches[0].clientX;
    previousTouchY = e.touches[0].clientY;
});

skillsCube.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.clientX - previousTouchX;
    const deltaY = touch.clientY - previousTouchY;
    
    currentRotationY += deltaX * 0.5;
    currentRotationX -= deltaY * 0.5;
    
    previousTouchX = touch.clientX;
    previousTouchY = touch.clientY;
    
    updateCubeRotation();
});

function updateCubeRotation() {
    skillsCube.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;
}

// ===================================
// PROGRESSIVE CONTACT FORM
// ===================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const BACKEND_API = '/api/contact'; // FastAPI endpoint when available
const FALLBACK_EMAIL = 'youremail@example.com';

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
    };
    
    // Try backend first
    try {
        const response = await fetch(BACKEND_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        
        if (response.ok) {
            showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        } else {
            throw new Error('Backend unavailable');
        }
    } catch (error) {
        // Fallback to mailto
        console.log('Backend unavailable, using mailto fallback');
        const mailtoLink = `mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        )}`;
        window.location.href = mailtoLink;
        showFormStatus('Opening your email client...', 'success');
    }
});

function showFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';
    
    setTimeout(() => {
        formStatus.style.display = 'none';
    }, 5000);
}

// ===================================
// SMOOTH SCROLL FOR NAVIGATION LINKS
// ===================================
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth',
            });
        }
        
        // Close mobile menu if open
        if (window.innerWidth <= 768) {
            navMenu.style.display = 'none';
        }
    });
});

// ===================================
// ACTIVE NAV LINK ON SCROLL
// ===================================
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach((section) => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach((link) => link.style.color = '');
            if (correspondingLink) {
                correspondingLink.style.color = 'var(--gradient-start)';
            }
        }
    });
});

// ===================================
// INITIALIZE SKILL BAR ANIMATIONS
// ===================================
const skillBars = document.querySelectorAll('.skill-progress');

const skillBarObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
            }
        });
    },
    { threshold: 0.5 }
);

skillBars.forEach((bar) => skillBarObserver.observe(bar));

console.log('🚀 Digital Marketing Portfolio loaded successfully!');
console.log('💡 Tip: Use arrow keys to rotate the skills cube');
console.log('🎨 Tip: Click the theme toggle button to switch between light and dark modes');


