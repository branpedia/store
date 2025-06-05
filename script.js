// script.js
// Fungsi Debounce untuk mengoptimalkan performa scroll
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Scroll Animation
function handleScrollAnimation() {
  const elements = document.querySelectorAll('.profile-container > *');
  const windowHeight = window.innerHeight;

  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    if (elementTop < windowHeight * 0.8) {
      element.classList.add('visible');
    }
  });
}

// Trigger notification show on page load
function showNotification() {
  const notification = document.getElementById('notification');
  const title = document.getElementById('notification-title');
  const content = document.getElementById('notification-content');
  const btn = document.getElementById('notification-btn');

  title.textContent = settings.notification.title;
  content.textContent = settings.notification.content;
  btn.href = settings.notification.link;
  btn.textContent = 'Kunjungi ' + settings.notification.link.split('/')[2];

  setTimeout(() => {
    notification.classList.add('show');
  }, 500);
}

// Dark/Light Mode Toggle
function setupThemeToggle() {
  const modeToggle = document.querySelector('.mode-toggle');
  const body = document.body;
  const modeIcon = modeToggle.querySelector('i');

  const savedTheme = localStorage.getItem('theme') || settings.defaultTheme;
  if (savedTheme === 'light') {
    body.classList.remove('dark-mode');
    modeIcon.classList.remove('fa-sun');
    modeIcon.classList.add('fa-moon');
  } else {
    body.classList.add('dark-mode');
    modeIcon.classList.remove('fa-moon');
    modeIcon.classList.add('fa-sun');
  }

  modeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
      modeIcon.classList.remove('fa-moon');
      modeIcon.classList.add('fa-sun');
      localStorage.setItem('theme', 'dark');
    } else {
      modeIcon.classList.remove('fa-sun');
      modeIcon.classList.add('fa-moon');
      localStorage.setItem('theme', 'light');
    }
  });
}

// Close Notification
function setupNotificationClose() {
  document.getElementById('close-notification').addEventListener('click', function() {
    document.getElementById('notification').style.display = 'none';
  });
}

// Music Player
function setupMusicPlayer() {
  const playBtn = document.getElementById('play-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const musicTitle = document.querySelector('.music-title');
  const musicArtist = document.querySelector('.music-artist');
  const playIcon = playBtn.querySelector('i');
  const progressBar = document.getElementById('progress-bar');
  const progressContainer = document.getElementById('progress-container');
  const currentTimeEl = document.getElementById('current-time');
  const durationEl = document.getElementById('duration');

  let currentTrack = 0;
  let isPlaying = false;
  let audio = new Audio();

  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function updateProgress(e) {
    if (isPlaying) {
      const { duration, currentTime } = e.srcElement;
      const progressPercent = duration ? (currentTime / duration) * 100 : 0;
      progressBar.style.width = `${progressPercent}%`;
      currentTimeEl.textContent = formatTime(currentTime);
      durationEl.textContent = formatTime(duration);
    }
  }

  function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if (duration) {
      audio.currentTime = (clickX / width) * duration;
    }
  }

  function loadTrack(index) {
    audio.src = settings.playlist[index].src;
    musicTitle.textContent = settings.playlist[index].title;
    musicArtist.textContent = settings.playlist[index].artist;
    currentTrack = index;
    progressBar.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    durationEl.textContent = '0:00';
    audio.addEventListener('loadedmetadata', () => {
      durationEl.textContent = formatTime(audio.duration);
    }, { once: true });
    audio.addEventListener('error', () => {
      durationEl.textContent = 'Error';
      alert('Gagal memuat audio: ' + settings.playlist[index].title);
    }, { once: true });
  }

  function playPauseTrack() {
    if (isPlaying) {
      audio.pause();
      playIcon.classList.remove('fa-pause');
      playIcon.classList.add('fa-play');
    } else {
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        alert('Gagal memutar audio. Pastikan file audio valid.');
      });
      playIcon.classList.remove('fa-play');
      playIcon.classList.add('fa-pause');
    }
    isPlaying = !isPlaying;
  }

  function prevTrack() {
    currentTrack--;
    if (currentTrack < 0) {
      currentTrack = settings.playlist.length - 1;
    }
    loadTrack(currentTrack);
    if (isPlaying) {
      audio.play().catch(err => console.error('Error playing audio:', err));
    }
  }

  function nextTrack() {
    currentTrack++;
    if (currentTrack >= settings.playlist.length) {
      currentTrack = 0;
    }
    loadTrack(currentTrack);
    if (isPlaying) {
      audio.play().catch(err => console.error('Error playing audio:', err));
    }
  }

  playBtn.addEventListener('click', playPauseTrack);
  prevBtn.addEventListener('click', prevTrack);
  nextBtn.addEventListener('click', nextTrack);
  audio.addEventListener('timeupdate', updateProgress);
  progressContainer.addEventListener('click', setProgress);
  audio.addEventListener('ended', nextTrack);
  loadTrack(0);
}

// Copy Link
function setupCopyLink() {
  document.getElementById('copy-link').addEventListener('click', function() {
    const tempInput = document.createElement('input');
    tempInput.value = window.location.href;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    const originalText = this.innerHTML;
    this.innerHTML = '<i class="fas fa-check"></i> Copied!';
    setTimeout(() => {
      this.innerHTML = originalText;
    }, 2000);
  });
}

// Initialize everything on page load
window.addEventListener('load', () => {
  handleScrollAnimation();
  showNotification();
  setupThemeToggle();
  setupNotificationClose();
  setupMusicPlayer();
  setupCopyLink();
});

window.addEventListener('scroll', debounce(handleScrollAnimation, 100));
