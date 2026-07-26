import './style.css'

// Play Music on first click
document.body.addEventListener('click', () => {
  const audio = document.getElementById('bg-music');
  if(audio && audio.paused) {
    audio.play().catch(e => console.log('Autoplay prevented'));
  }
}, { once: true });

// Countdown Timer (Set to some date in the future for demo)
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 30); // 30 days from now

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days.toString().padStart(2, '0');
  document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
  document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
  document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();
