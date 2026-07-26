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
            loadWishes();

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

// ============================================
// GUESTBOOK (Google Sheets Backend)
// ============================================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbweGoDDjI60WHQz35XW5LcERYapWM-8OuC5RJZWdziN-4OlsSyosPFPmG-18YFIWzowaw/exec';
const WISH_KEY = 'kenzo_khitan_wishes';

let wishesData = [];

async function fetchGlobalWishes() {
    try {
        const res = await fetch(SCRIPT_URL);
        const data = await res.json();
        wishesData = data;
        localStorage.setItem(WISH_KEY, JSON.stringify(wishesData));
    } catch (e) {
        console.error('Failed fetching wishes:', e);
        wishesData = JSON.parse(localStorage.getItem(WISH_KEY)) || [];
    }
    renderWishesData();
}

async function submitWish(e) {
    e.preventDefault();
    const btn = document.querySelector('.btn-submit');
    const oldText = btn.textContent;
    btn.textContent = 'Mengirim...';
    btn.disabled = true;

    const name = document.getElementById('wish-name').value.trim();
    const msg = document.getElementById('wish-message').value.trim();
    const att = document.getElementById('wish-attendance').value;
    
    if (!name || !msg) {
        btn.textContent = oldText;
        btn.disabled = false;
        return;
    }

    // Optimistic UI update (langsung muncul di layar sendiri)
    const newWish = { name: name, message: msg, attendance: att, time: new Date().toISOString() };
    wishesData.unshift(newWish);
    renderWishesData();
    document.getElementById('wish-form').reset();

    // Kirim ke Google Sheets secara background
    try {
        let formData = new URLSearchParams();
        formData.append('name', name);
        formData.append('attendance', att);
        formData.append('message', msg);
        
        await fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // Hindari error CORS di browser
        });
        
        // Refresh data dari server 1 detik kemudian untuk sinkronisasi
        setTimeout(fetchGlobalWishes, 1000); 
    } catch (error) {
        console.error("Gagal mengirim ke server:", error);
    }

    // Feedback Sukses
    btn.textContent = '✅ Terkirim!';
    btn.style.background = '#2E7D32';
    setTimeout(() => { 
        btn.textContent = 'Kirim Ucapan ✉'; 
        btn.style.background = ''; 
        btn.disabled = false;
    }, 2000);
}

function renderWishesData() {
    const list = document.getElementById('wishes-list');
    document.getElementById('wishes-count-number').textContent = wishesData.length;

    list.querySelectorAll('.wish-card').forEach(c => c.remove());

    const labels = { hadir: 'Hadir', tidak: 'Tidak Hadir', ragu: 'Ragu-ragu' };

    wishesData.forEach(w => {
        const card = document.createElement('div');
        card.className = 'wish-card';
        card.innerHTML = `
            <div class="wish-header">
                <div class="wish-avatar">${esc(w.name).charAt(0).toUpperCase()}</div>
                <div class="wish-meta">
                    <div class="wish-name-text">${esc(w.name)}</div>
                    <div class="wish-time">${timeAgo(w.time)}</div>
                </div>
                <span class="wish-badge ${w.attendance}">${labels[w.attendance] || ''}</span>
            </div>
            <p class="wish-msg">${esc(w.message)}</p>
        `;
        list.appendChild(card);
    });
}

function loadWishes() { 
    // Tampilkan data lokal secepat kilat
    wishesData = JSON.parse(localStorage.getItem(WISH_KEY)) || [];
    renderWishesData();
    // Lalu tarik data global terbaru dari Google Sheets
    fetchGlobalWishes();
}

function timeAgo(d) {
    const diff = Date.now() - new Date(d).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Baru saja';
    if (m < 60) return m + ' menit lalu';
    const h = Math.floor(m / 60);
    if (h < 24) return h + ' jam lalu';
    const days = Math.floor(h / 24);
    if (days < 7) return days + ' hari lalu';
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function esc(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}

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
