/**
 * Scrapbook Birthday Website - JavaScript
 * Features:
 * - Audio autoplay handling with polite user interaction
 * - Built-in Music Box synthesizer fallback if custom MP3 is not provided yet
 * - Floating music controller (play/pause)
 * - Pure Canvas Confetti celebration burst
 * - Interactive sticker zoom (lightbox) & Birthday Letter modal
 * - Interactive tap/click heart sparks
 * - Graceful image error handler
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     PENGATURAN MUSIK (BGM CONFIGURATION)
     ========================================================================== */
  const BGM_START_TIME = 39; // Mulai dari detik ke-39 (00:39)
  const BGM_LOOP_TO_START = false;

  /* ==========================================================================
     PENGATURAN BACKGROUND SLIDESHOW (VIDEO & FOTO)
     ========================================================================== */
  // Daftar file video & foto background yang Anda masukkan di folder ./assets/bg/
  // Sistem otomatis memutar video (dipotong jika > 5 detik) dan foto (2 detik zoom perlahan).
  const BG_PLAYLIST = [
    { src: './assets/bg/bgvid (1).mp4' },
    { src: './assets/bg/bg (1).jpg' },
    { src: './assets/bg/bg (2).jpg' },
    { src: './assets/bg/bg (3).jpg' },
    { src: './assets/bg/bg (4).jpg' },
    { src: './assets/bg/bg (5).jpg' },
    { src: './assets/bg/bg (6).jpg' },
    { src: './assets/bg/bgvid (2).mp4' },
    { src: './assets/bg/bg (7).jpg' },
    { src: './assets/bg/bg (8).jpg' },
    { src: './assets/bg/bg (9).jpg' },
    { src: './assets/bg/bg (10).jpg' },
    { src: './assets/bg/bg (11).jpg' },
    { src: './assets/bg/bg (12).jpg' },
    { src: './assets/bg/bgvid (3).mp4' },
    { src: './assets/bg/bg (13).jpg' },
    { src: './assets/bg/bg (14).jpg' },
    { src: './assets/bg/bg (15).jpg' },
    { src: './assets/bg/bg (16).jpg' },
    { src: './assets/bg/bg (17).jpg' },
    { src: './assets/bg/bg (18).jpg' },
    { src: './assets/bg/bg (19).jpg' }
  ];

  // Elements
  const btnOpen = document.getElementById('btn-open');
  const introOverlay = document.getElementById('intro-overlay');
  const bgm = document.getElementById('bgm');
  const musicController = document.getElementById('music-controller');
  
  // Modals & Single Paper Holder
  const modalBackdrop = document.getElementById('modal-backdrop');
  const letterModal = document.getElementById('letter-modal');
  const photoModal = document.getElementById('photo-modal');
  
  // On-Canvas Flipbook Elements
  const canvasFlipbook = document.getElementById('canvas-flipbook');
  const canvasSheetFlap = document.getElementById('canvas-sheet-flap');
  const canvasSheetBase = document.getElementById('canvas-sheet-base');
  const canvasPeekingTab = document.getElementById('canvas-peeking-tab');
  const canvasPeelHint = document.getElementById('canvas-peel-hint');
  const canvasFoldBack = document.getElementById('canvas-fold-back');
  
  const btnReadLetter = document.getElementById('btn-read-letter');
  const closeLetterBtn = document.getElementById('close-letter-btn');
  const btnCloseLetterBottom = document.getElementById('btn-close-letter-bottom');
  const closePhotoBtn = document.getElementById('close-photo-btn');
  const previewImg = document.getElementById('preview-img');
  const previewCaption = document.getElementById('preview-caption');

  let isPlaying = false;
  let audioContext = null;
  let synthMusicInterval = null;

  /* ==========================================================================
     1. AUDIO SYSTEM & SYNTHESIZER FALLBACK
     ========================================================================== */

  // Web Audio API Music Box "Happy Birthday" Fallback
  function playSynthMusicBox() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioContext) audioContext = new AudioContextClass();
      if (audioContext.state === 'suspended') audioContext.resume();

      // Notes frequencies (Happy Birthday melody in C Major)
      const notes = {
        'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
        'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
        'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
        'C5': 523.25, 'D5': 587.33, 'E5': 659.25
      };

      const melody = [
        { note: 'G4', dur: 0.35, delay: 0.4 },
        { note: 'G4', dur: 0.2, delay: 0.25 },
        { note: 'A4', dur: 0.6, delay: 0.65 },
        { note: 'G4', dur: 0.6, delay: 0.65 },
        { note: 'C5', dur: 0.6, delay: 0.65 },
        { note: 'B4', dur: 1.0, delay: 1.1 },

        { note: 'G4', dur: 0.35, delay: 0.4 },
        { note: 'G4', dur: 0.2, delay: 0.25 },
        { note: 'A4', dur: 0.6, delay: 0.65 },
        { note: 'G4', dur: 0.6, delay: 0.65 },
        { note: 'D5', dur: 0.6, delay: 0.65 },
        { note: 'C5', dur: 1.0, delay: 1.1 },

        { note: 'G4', dur: 0.35, delay: 0.4 },
        { note: 'G4', dur: 0.2, delay: 0.25 },
        { note: 'G5', dur: 0.6, delay: 0.65 },
        { note: 'E5', dur: 0.6, delay: 0.65 },
        { note: 'C5', dur: 0.6, delay: 0.65 },
        { note: 'B4', dur: 0.6, delay: 0.65 },
        { note: 'A4', dur: 0.8, delay: 0.9 },

        { note: 'F5', dur: 0.35, delay: 0.4 },
        { note: 'F5', dur: 0.2, delay: 0.25 },
        { note: 'E5', dur: 0.6, delay: 0.65 },
        { note: 'C5', dur: 0.6, delay: 0.65 },
        { note: 'D5', dur: 0.6, delay: 0.65 },
        { note: 'C5', dur: 1.2, delay: 1.4 }
      ];

      function playChime(freq, duration, time) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        // Music box timbre: combination of sine and slight harmonic
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        // Envelope: sudden bell attack, sweet gentle decay
        gain.gain.setValueAtTime(0.001, time);
        gain.gain.exponentialRampToValueAtTime(0.25, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start(time);
        osc.stop(time + duration);
      }

      function loopMelody() {
        let currentTime = audioContext.currentTime + 0.1;
        melody.forEach(item => {
          if (notes[item.note]) {
            playChime(notes[item.note], item.dur + 0.4, currentTime);
          }
          currentTime += item.delay;
        });

        // Loop after complete song
        const totalDuration = (currentTime - audioContext.currentTime) * 1000 + 800;
        synthMusicInterval = setTimeout(() => {
          if (isPlaying) loopMelody();
        }, totalDuration);
      }

      loopMelody();
    } catch (e) {
      console.warn("Web Audio not supported:", e);
    }
  }

  function stopSynthMusic() {
    if (synthMusicInterval) clearTimeout(synthMusicInterval);
    if (audioContext && audioContext.state !== 'closed') {
      try { audioContext.suspend(); } catch (err) {}
    }
  }

  // Terapkan detik mulai saat audio metadata sudah terisi
  let initialTimeApplied = false;
  function applyStartTime() {
    if (BGM_START_TIME > 0 && !initialTimeApplied) {
      try {
        bgm.currentTime = BGM_START_TIME;
        initialTimeApplied = true;
      } catch (e) {}
    }
  }
  bgm.addEventListener('loadedmetadata', applyStartTime);
  bgm.addEventListener('canplay', applyStartTime);

  // Jika mengulang (loop) dan ingin kembali ke detik mulai
  if (BGM_LOOP_TO_START) {
    bgm.addEventListener('seeked', () => {
      if (bgm.currentTime < 0.5 && BGM_START_TIME > 0) {
        bgm.currentTime = BGM_START_TIME;
      }
    });
  }

  function startMusic() {
    isPlaying = true;
    musicController.classList.remove('hidden');
    musicController.classList.add('playing');

    // Coba lompat ke detik yang ditentukan sebelum play
    if (BGM_START_TIME > 0 && !initialTimeApplied) {
      try {
        bgm.currentTime = BGM_START_TIME;
        initialTimeApplied = true;
      } catch (e) {}
    }

    const playPromise = bgm.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Jika browser baru mengizinkan seek setelah audio mulai berputar
        if (BGM_START_TIME > 0 && Math.abs(bgm.currentTime - BGM_START_TIME) > 1 && bgm.currentTime < BGM_START_TIME) {
          try {
            bgm.currentTime = BGM_START_TIME;
          } catch (e) {}
        }

        // If file played successfully, check if it has valid duration/content
        if (bgm.duration === 0 || isNaN(bgm.duration) || bgm.duration < 2) {
          // Placeholder silent audio detected: start sweet music box
          playSynthMusicBox();
        }
      }).catch(error => {
        console.log("Audio playback note:", error.message);
        // Start synthetic chime music box
        playSynthMusicBox();
      });
    }
  }

  function pauseMusic() {
    isPlaying = false;
    musicController.classList.remove('playing');
    bgm.pause();
    stopSynthMusic();
  }

  function toggleMusic() {
    if (isPlaying) {
      pauseMusic();
    } else {
      startMusic();
    }
  }

  musicController.addEventListener('click', toggleMusic);

  /* ==========================================================================
     2. INTRO OVERLAY BUTTON INTERACTION
     ========================================================================== */
  btnOpen.addEventListener('click', () => {
    // Start audio
    startMusic();

    // Trigger celebratory confetti explosion
    triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 90);
    setTimeout(() => {
      triggerConfetti(window.innerWidth * 0.25, window.innerHeight * 0.35, 50);
      triggerConfetti(window.innerWidth * 0.75, window.innerHeight * 0.35, 50);
    }, 400);

    // Fade out overlay
    introOverlay.classList.add('fade-out');
  });

  /* ==========================================================================
     3. MODAL INTERACTIONS (LETTER & PHOTO PREVIEW)
     ========================================================================== */

  // Open Letter Modal or Flipbook
  btnReadLetter.addEventListener('click', () => {
    if (canvasFlipbook) {
      canvasFlipbook.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        setCanvasFlipbookOpen(true);
      }, 350);
    } else {
      letterModal.classList.remove('hidden');
      photoModal.classList.add('hidden');
      modalBackdrop.classList.remove('hidden');
      triggerConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 40);
    }
  });

  // Close Letter Modal
  function closeLetter() {
    letterModal.classList.add('hidden');
    modalBackdrop.classList.add('hidden');
  }
  closeLetterBtn.addEventListener('click', closeLetter);
  btnCloseLetterBottom.addEventListener('click', closeLetter);

  // Close Photo Preview Modal
  function closePhoto() {
    photoModal.classList.add('hidden');
    modalBackdrop.classList.add('hidden');
  }
  closePhotoBtn.addEventListener('click', closePhoto);

  // ==================== DYNAMIC BACKGROUND SLIDESHOW (VIDEO & FOTO) ====================
  const layerA = document.getElementById('bg-layer-a');
  const layerB = document.getElementById('bg-layer-b');
  let currentBgLayer = layerA;
  let nextBgLayer = layerB;
  let currentBgIndex = 0;
  let bgSlideTimer = null;

  function isVideoUrl(url) {
    const cleanUrl = url.split('?')[0].toLowerCase();
    return cleanUrl.endsWith('.mp4') || cleanUrl.endsWith('.webm') || cleanUrl.endsWith('.mov');
  }

  function createMediaElement(src, onReady, onError) {
    if (isVideoUrl(src)) {
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.loop = false;
      video.src = src;

      let resolved = false;
      function resolveVideoDuration() {
        if (resolved) return;
        resolved = true;
        const dur = video.duration;
        let displayTime = 5000; // default 5s
        if (dur && !isNaN(dur) && dur > 0) {
          if (dur > 5) {
            displayTime = 5000; // jika video > 5 detik, potong di 5 detik
          } else {
            displayTime = dur * 1000; // jika video kurang dari 5 detik, putar seadanya
          }
        }
        onReady(displayTime, video);
      }

      video.addEventListener('loadedmetadata', resolveVideoDuration);
      video.addEventListener('canplay', () => {
        if (!resolved) resolveVideoDuration();
      });
      video.addEventListener('error', () => {
        if (onError) onError();
      });

      setTimeout(() => {
        if (!resolved) resolveVideoDuration();
      }, 1200);

      return video;
    } else {
      // Foto / Image (durasi 2 detik dengan zoom perlahan)
      const img = document.createElement('img');
      img.src = src;
      img.onload = () => {
        onReady(2000, img);
      };
      img.onerror = () => {
        if (onError) onError();
      };
      return img;
    }
  }

  function startBackgroundSlideshow() {
    if (!BG_PLAYLIST || BG_PLAYLIST.length === 0 || !layerA || !layerB) return;

    function showSlide(index) {
      if (bgSlideTimer) clearTimeout(bgSlideTimer);
      const item = BG_PLAYLIST[index];
      let hasTriedAlternate = false;

      function loadMedia(srcPath) {
        createMediaElement(
          srcPath,
          (displayDuration, mediaEl) => {
            nextBgLayer.innerHTML = '';
            nextBgLayer.appendChild(mediaEl);

            if (isVideoUrl(srcPath)) {
              mediaEl.currentTime = 0;
              mediaEl.play().catch(() => {});
            }

            // Transisi dramatis (crossfade blur & scale)
            requestAnimationFrame(() => {
              nextBgLayer.classList.remove('prev');
              nextBgLayer.classList.add('active');

              currentBgLayer.classList.remove('active');
              currentBgLayer.classList.add('prev');

              // Tukar layer
              const temp = currentBgLayer;
              currentBgLayer = nextBgLayer;
              nextBgLayer = temp;

              // Bersihkan layer sebelumnya setelah transisi selesai
              setTimeout(() => {
                nextBgLayer.innerHTML = '';
              }, 1200);

              // Jadwalkan slide berikutnya
              bgSlideTimer = setTimeout(() => {
                currentBgIndex = (currentBgIndex + 1) % BG_PLAYLIST.length;
                showSlide(currentBgIndex);
              }, displayDuration);
            });
          },
          () => {
            // Auto fallback antara .mp4 dan .jpg jika file belum ada
            if (!hasTriedAlternate) {
              hasTriedAlternate = true;
              if (srcPath.endsWith('.mp4')) {
                loadMedia(srcPath.replace('.mp4', '.jpg'));
                return;
              } else if (srcPath.endsWith('.jpg')) {
                loadMedia(srcPath.replace('.jpg', '.mp4'));
                return;
              }
            }
            // Lewati ke slide berikutnya jika file error
            currentBgIndex = (currentBgIndex + 1) % BG_PLAYLIST.length;
            setTimeout(() => showSlide(currentBgIndex), 500);
          }
        );
      }

      loadMedia(item.src);
    }

    showSlide(currentBgIndex);
  }

  startBackgroundSlideshow();

  // ==================== ON-CANVAS FLIPBOOK (BUKU TEMPEL LIPAT DI LUAR DENGAN PEEKING TAB) ====================
  let isFlipbookOpen = false;
  let isDraggingFlap = false;
  let dragStartX = 0;
  let currentDragRatio = 0;
  let flipbookWidth = 320;

  function updateFlapTransform(ratio, animate = false) {
    if (!canvasSheetFlap) return;

    if (animate) {
      canvasSheetFlap.style.transition = 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)';
    } else {
      canvasSheetFlap.style.transition = 'none';
    }

    const clamped = Math.max(0, Math.min(1, ratio));
    // Keadaan awal: -8deg (mengintip). Keadaan terbuka penuh: -180deg.
    const angle = -8 - (172 * clamped);
    canvasSheetFlap.style.transform = `rotateY(${angle}deg)`;

    // Sembunyikan hint tarik & peeking tab secara bertahap saat dibuka
    if (canvasPeelHint) {
      canvasPeelHint.style.opacity = Math.max(0, 1 - clamped * 2).toString();
    }
    if (canvasPeekingTab) {
      canvasPeekingTab.style.opacity = Math.max(0, 1 - clamped * 2).toString();
    }
  }

  function setCanvasFlipbookOpen(openState) {
    isFlipbookOpen = openState;
    currentDragRatio = openState ? 1 : 0;

    if (canvasFlipbook) {
      if (openState) {
        canvasFlipbook.classList.add('is-open');
      } else {
        canvasFlipbook.classList.remove('is-open');
      }
    }

    if (canvasSheetFlap) {
      if (openState) {
        canvasSheetFlap.classList.add('open-active');
      } else {
        canvasSheetFlap.classList.remove('open-active');
      }
    }

    updateFlapTransform(openState ? 1 : 0, true);

    if (openState) {
      const rect = canvasFlipbook.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      triggerConfetti(centerX, centerY, 60);
    }
  }

  // Pointer drag & tap events on the canvas flipbook (Gesture Touch HP & Mouse Desktop)
  if (canvasFlipbook && canvasSheetFlap) {
    canvasFlipbook.addEventListener('pointerdown', (e) => {
      // Jika mengklik tombol fold-back saat buku sudah terbuka
      if (e.target.closest('#canvas-fold-back')) return;

      isDraggingFlap = true;
      dragStartX = e.clientX;
      flipbookWidth = canvasFlipbook.offsetWidth || 320;
      canvasFlipbook.setPointerCapture(e.pointerId);
    });

    canvasFlipbook.addEventListener('pointermove', (e) => {
      if (!isDraggingFlap) return;

      const deltaX = dragStartX - e.clientX;
      let newRatio;

      if (!isFlipbookOpen) {
        // Dari tertutup: tarik ke kiri untuk membuka sedikit demi sedikit
        newRatio = deltaX / flipbookWidth;
      } else {
        // Dari terbuka: tarik ke kanan untuk melipat kembali
        newRatio = 1 - (-deltaX / flipbookWidth);
      }

      newRatio = Math.max(0, Math.min(1, newRatio));
      updateFlapTransform(newRatio, false);
      currentDragRatio = newRatio;
    });

    function endFlapDrag(e) {
      if (!isDraggingFlap) return;
      isDraggingFlap = false;

      const deltaX = Math.abs(dragStartX - (e.clientX || dragStartX));

      // Jika hanya klik/tap singkat tanpa drag (deltaX < 12px)
      if (deltaX < 12) {
        if (!isFlipbookOpen) {
          // Klik cover saat tertutup -> buka!
          setCanvasFlipbookOpen(true);
        } else if (e.target.closest('#canvas-fold-back') || e.target.closest('.canvas-flap-back')) {
          // Klik area fold back -> tutup!
          setCanvasFlipbookOpen(false);
        }
        return;
      }

      // Ambang batas drag: jika ditarik > 30%, buka penuh; jika < 30%, tutup kembali
      if (!isFlipbookOpen) {
        if (currentDragRatio > 0.3) {
          setCanvasFlipbookOpen(true);
        } else {
          setCanvasFlipbookOpen(false);
        }
      } else {
        if (currentDragRatio < 0.7) {
          setCanvasFlipbookOpen(false);
        } else {
          setCanvasFlipbookOpen(true);
        }
      }
    }

    canvasFlipbook.addEventListener('pointerup', endFlapDrag);
    canvasFlipbook.addEventListener('pointercancel', endFlapDrag);

    // Klik langsung pada Peeking Tab
    if (canvasPeekingTab) {
      canvasPeekingTab.addEventListener('click', (e) => {
        e.stopPropagation();
        setCanvasFlipbookOpen(true);
      });
    }

    // Klik tombol fold back di bagian bawah surat
    if (canvasFoldBack) {
      canvasFoldBack.addEventListener('click', (e) => {
        e.stopPropagation();
        setCanvasFlipbookOpen(false);
      });
    }
  }

  // Close Modal on backdrop click
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeLetter();
      closePhoto();
    }
  });

  // Close Modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLetter();
      closePhoto();
      if (isFlipbookOpen) setCanvasFlipbookOpen(false);
    }
  });

  // Open Modal on photo sticker click
  const photoStickers = document.querySelectorAll('.sticker-item');
  photoStickers.forEach(item => {
    item.addEventListener('click', (e) => {
      // Abaikan jika klik berada di dalam center flipbook atau banner garland
      if (item.closest('#canvas-flipbook') || item.classList.contains('center-piece') || item.classList.contains('deco-bunting-garland')) {
        return;
      }

      // Jika stiker dekorasi (kue, balon, kado, dsb), berikan efek bounce animasi lucu
      if (item.classList.contains('deco-sticker') || item.classList.contains('doodle-star')) {
        item.style.transform = 'scale(1.25) rotate(' + (Math.random() * 16 - 8) + 'deg)';
        setTimeout(() => {
          item.style.transform = '';
        }, 300);
        const caption = item.getAttribute('data-caption');
        if (caption) {
          createFloatingSparkle(e.clientX, e.clientY);
        }
        return;
      }

      // Untuk foto Caca (photo1 - photo8) -> Buka preview lightbox
      const img = item.querySelector('.sticker-img');
      const caption = item.getAttribute('data-caption') || 'Happy Birthday, Caca! ✨';

      if (img) {
        previewImg.src = img.src;
        previewCaption.textContent = caption;
        photoModal.classList.remove('hidden');
        letterModal.classList.add('hidden');
        modalBackdrop.classList.remove('hidden');
        triggerConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 35);
      }
    });
  });

  /* ==========================================================================
     4. CLICK / TAP INTERACTIVE FLOATING HEARTS & SPARKLES
     ========================================================================== */
  document.addEventListener('pointerdown', (e) => {
    // Only spawn heart if clicking on the scrapbook body
    if (e.target.closest('#intro-overlay') || e.target.closest('.modal-card') || e.target.closest('#music-controller')) {
      return;
    }

    createFloatingSparkle(e.clientX, e.clientY);
  });

  function createFloatingSparkle(x, y) {
    const el = document.createElement('div');
    const icons = ['💖', '✨', '🌸', '⭐', '💕', '🎂'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    
    el.textContent = randomIcon;
    el.style.position = 'fixed';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.fontSize = `${Math.random() * 12 + 18}px`;
    el.style.pointerEvents = 'none';
    el.style.userSelect = 'none';
    el.style.zIndex = '99999';
    el.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 40 - 20}deg)`;
    el.style.transition = 'transform 1s cubic-bezier(0.18, 0.89, 0.32, 1.28), opacity 1s ease';
    el.style.opacity = '1';

    document.body.appendChild(el);

    requestAnimationFrame(() => {
      const offsetX = (Math.random() - 0.5) * 60;
      const offsetY = -(Math.random() * 70 + 40);
      el.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(1.3) rotate(${Math.random() * 60 - 30}deg)`;
      el.style.opacity = '0';
    });

    setTimeout(() => {
      el.remove();
    }, 1000);
  }

  /* ==========================================================================
     5. HIGH PERFORMANCE NATIVE CANVAS CONFETTI
     ========================================================================== */
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let confettiPieces = [];
  let isConfettiRunning = false;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const confettiColors = ['#ff527b', '#ff7597', '#fed636', '#ffe055', '#48cae4', '#a0c4ff', '#b9fbc0', '#ffc6ff'];

  class Confetti {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 8 + 6;
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      this.speedX = (Math.random() - 0.5) * 14;
      this.speedY = Math.random() * -12 - 4;
      this.gravity = 0.38;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 12;
      this.opacity = 1;
      this.decay = Math.random() * 0.012 + 0.008;
      this.isCircle = Math.random() > 0.6;
    }

    update() {
      this.speedY += this.gravity;
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      this.opacity -= this.decay;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;

      if (this.isCircle) {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.4);
      }
      ctx.restore();
    }
  }

  function triggerConfetti(originX, originY, count = 60) {
    for (let i = 0; i < count; i++) {
      confettiPieces.push(new Confetti(originX, originY));
    }

    if (!isConfettiRunning) {
      isConfettiRunning = true;
      requestAnimationFrame(renderConfetti);
    }
  }

  function renderConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = confettiPieces.length - 1; i >= 0; i--) {
      const p = confettiPieces[i];
      p.update();
      p.draw();

      if (p.opacity <= 0 || p.y > canvas.height + 20) {
        confettiPieces.splice(i, 1);
      }
    }

    if (confettiPieces.length > 0) {
      requestAnimationFrame(renderConfetti);
    } else {
      isConfettiRunning = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  /* ==========================================================================
     6. GRACEFUL IMAGE ERROR FALLBACK (AUTO DETECT .PNG / .JPG)
     ========================================================================== */
  const allImages = document.querySelectorAll('.sticker-img');
  allImages.forEach(img => {
    let hasTriedAlternateExt = false;

    img.addEventListener('error', () => {
      const src = img.getAttribute('src') || '';
      
      // If .jpg fails, automatically try .png (or vice versa)
      if (!hasTriedAlternateExt) {
        hasTriedAlternateExt = true;
        if (src.endsWith('.jpg')) {
          img.src = src.replace('.jpg', '.png');
          return;
        } else if (src.endsWith('.png')) {
          img.src = src.replace('.png', '.jpg');
          return;
        }
      }

      // Create cute SVG placeholder if file is not found
      const placeholderSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="350" viewBox="0 0 300 350"><rect width="100%" height="100%" fill="%23fff5f7"/><text x="50%" y="45%" font-family="sans-serif" font-size="28" fill="%23ff638d" text-anchor="middle">📷</text><text x="50%" y="60%" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23ff638d" text-anchor="middle">Foto Disini</text><text x="50%" y="70%" font-family="sans-serif" font-size="11" fill="%23999999" text-anchor="middle">${img.getAttribute('src') || ''}</text></svg>`;
      img.src = placeholderSvg;
    });
  });
});
