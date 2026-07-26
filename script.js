/* ============================================
   WALIMATUL KHITAN - Clean & Elegant JS
   ============================================ */

// ============================================
// OPEN INVITATION + DOOR ANIMATION
// ============================================
function openInvitation() {
    const splashSection = document.getElementById('splash');
    const openingSection = document.getElementById('opening');
    const doorSection = document.getElementById('door-section');
    const mainContent = document.getElementById('main-content');
    const musicBtn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');

    // Hide splash & opening
    splashSection.style.display = 'none';
    openingSection.style.display = 'none';

    // Show door animation
    doorSection.style.display = 'flex';

    // Start music (Skip intro)
    if (audio) {
        audio.volume = 0.4;
        audio.currentTime = 14; // Skip intro 14 detik agar langsung masuk bagian bagus
        audio.play().then(() => {
            isMusicPlaying = true;
            musicBtn.classList.add('playing');
        }).catch(() => {});
    }
    musicBtn.classList.add('visible');

    // Open doors after brief pause
    setTimeout(() => {
        const doors = doorSection.querySelectorAll('.door');
        doors.forEach(d => d.classList.add('open'));

        // After doors open, show main content
        setTimeout(() => {
            doorSection.style.display = 'none';
            mainContent.style.display = 'block';

            // Trigger animations
            initScrollAnimations();
            initCountdown();
            // loadWishes(); // Removed guestbook

            // Smooth scroll to first section
            setTimeout(() => {
                document.getElementById('title-section').scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }, 1600);
    }, 500);
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.15 });

    document.querySelectorAll('.scroll-anim').forEach(el => observer.observe(el));
}

// ============================================
// PHOTO CAROUSEL
// ============================================
let currentSlide = 0;
const totalSlides = 5;
let autoSlideTimer = null;

function updateSlide() {
    document.querySelectorAll('.gallery-slide').forEach((s, i) => s.classList.toggle('active', i === currentSlide));
    document.querySelectorAll('.gal-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

function nextSlide() { currentSlide = (currentSlide + 1) % totalSlides; updateSlide(); resetAuto(); }
function prevSlide() { currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; updateSlide(); resetAuto(); }
function goToSlide(i) { currentSlide = i; updateSlide(); resetAuto(); }

function startAuto() { autoSlideTimer = setInterval(() => { currentSlide = (currentSlide + 1) % totalSlides; updateSlide(); }, 4000); }
function resetAuto() { clearInterval(autoSlideTimer); startAuto(); }

// Touch swipe
let touchX = 0;
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('gallery-carousel');
    if (carousel) {
        carousel.addEventListener('touchstart', e => { touchX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            const diff = touchX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
        }, { passive: true });
    }
    startAuto();
});

// Keyboard
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
});

// ============================================
// COUNTDOWN
// ============================================
function initCountdown() {
    const target = new Date('2026-08-01T11:00:00+07:00').getTime();

    function tick() {
        const now = Date.now();
        const diff = target - now;
        if (diff < 0) return;

        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        setNum('days', d);
        setNum('hours', h);
        setNum('minutes', m);
        setNum('seconds', s);
    }

    function setNum(id, val) {
        const el = document.getElementById(id);
        const str = val.toString().padStart(2, '0');
        if (el.textContent !== str) {
            el.style.transform = 'scale(0.8)';
            el.style.opacity = '0.3';
            setTimeout(() => {
                el.textContent = str;
                el.style.transform = 'scale(1)';
                el.style.opacity = '1';
            }, 150);
        }
    }

    tick();
    setInterval(tick, 1000);
}

// Guestbook logic removed

// ============================================
// MUSIC
// ============================================
let isMusicPlaying = false;
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    if (btn && audio) {
        btn.addEventListener('click', () => {
            isMusicPlaying = !isMusicPlaying;
            if (isMusicPlaying) {
                audio.play();
                btn.classList.add('playing');
            } else {
                audio.pause();
                btn.classList.remove('playing');
            }
        });
    }
});

// ============================================
// SCROLL TO TOP
// ============================================
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
window.addEventListener('scroll', () => {
    document.getElementById('scroll-top').classList.toggle('visible', window.scrollY > 600);
});

// ============================================
// AUTO-SCROLL SPLASH → OPENING
// ============================================
window.addEventListener('load', () => {
    setTimeout(() => {
        const opening = document.getElementById('opening');
        if (opening && opening.style.display !== 'none') {
            opening.scrollIntoView({ behavior: 'smooth' });
        }
    }, 3000);
});

console.log('🌹 Undangan Walimatul Khitan - Muhammad Kenzo Al Barra');

// Handle URL Parameter for Guest Name
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    
    if (guestName) {
        const nameBox = document.getElementById('guest-name');
        const boxContainer = document.getElementById('guest-box');
        if (nameBox && boxContainer) {
            nameBox.textContent = guestName;
            boxContainer.style.display = 'block';
        }
        
        // Auto-fill guestbook name if param exists
        const wishNameInput = document.getElementById('wish-name');
        if (wishNameInput) {
            wishNameInput.value = guestName;
        }
    }
});
import './style.css';

// Export functions to global scope for module usage
window.openInvitation = openInvitation;
window.prevSlide = prevSlide;
window.nextSlide = nextSlide;
window.goToSlide = goToSlide;
window.submitWish = submitWish;
window.scrollToTop = scrollToTop;
