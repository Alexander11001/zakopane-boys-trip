const RATIO_STEPS = [
  { mountains: 55, beer: 45, caption: "Сначала приехали за вершинами. Потом за пеной." },
  { mountains: 45, beer: 55, caption: "Баланс шаткий. Нам нравится." },
  { mountains: 35, beer: 65, caption: "Горы — декоративный элемент." },
  { mountains: 25, beer: 75, caption: "Пиво-пиво-пиво. Классика." },
  { mountains: 30, beer: 70, caption: "Ещё разок на горы? Может быть." },
];

function initParticles() {
  const snow = document.querySelector(".snow");
  const bubbles = document.querySelector(".beer-bubbles");
  for (let i = 0; i < 40; i++) {
    const s = document.createElement("span");
    s.style.left = `${Math.random() * 100}%`;
    s.style.animationDuration = `${8 + Math.random() * 12}s`;
    s.style.animationDelay = `${Math.random() * 10}s`;
    snow.appendChild(s);
  }
  for (let i = 0; i < 25; i++) {
    const b = document.createElement("span");
    const size = 8 + Math.random() * 20;
    b.style.width = `${size}px`;
    b.style.height = `${size}px`;
    b.style.left = `${Math.random() * 100}%`;
    b.style.animationDuration = `${6 + Math.random() * 8}s`;
    b.style.animationDelay = `${Math.random() * 8}s`;
    bubbles.appendChild(b);
  }
}

function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  window.addEventListener(
    "scroll",
    () => {
      const doc = document.documentElement;
      const pct = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
      bar.style.width = `${pct}%`;
    },
    { passive: true }
  );
}

function initCursorGlow() {
  const glow = document.getElementById("cursorGlow");
  if (!window.matchMedia("(pointer: fine)").matches) return;

  document.body.classList.add("cursor-on");
  window.addEventListener(
    "mousemove",
    (e) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    },
    { passive: true }
  );
}

function initNavScroll() {
  const nav = document.getElementById("nav");
  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("scrolled", window.scrollY > 60);
    },
    { passive: true }
  );
}

function initTiltCards() {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-8px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function initMagnetic() {
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
}

function initObservers() {
  document.querySelectorAll(".reveal").forEach((el) => {
    const delay = el.dataset.delay;
    if (delay) el.style.setProperty("--delay", `${delay}ms`);
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  const ratioSection = document.getElementById("ratio");
  let ratioIndex = 0;
  let ratioStarted = false;

  const ratioIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !ratioStarted) {
          ratioStarted = true;
          animateRatio();
        }
      });
    },
    { threshold: 0.3 }
  );
  ratioIO.observe(ratioSection);

  function animateRatio() {
    if (ratioIndex >= RATIO_STEPS.length) return;
    const step = RATIO_STEPS[ratioIndex];
    document.getElementById("ratioMountains").style.width = `${step.mountains}%`;
    document.getElementById("ratioBeer").style.width = `${step.beer}%`;
    document.getElementById("ratioCaption").textContent = step.caption;
    if (step.beer > 50) document.body.classList.add("beer-mode");
    ratioIndex++;
    if (ratioIndex < RATIO_STEPS.length) {
      setTimeout(animateRatio, 1400);
    }
  }
}

let currentSlide = 0;
const slides = () => document.querySelectorAll(".carousel-slide");

function updateBeerMode() {
  const beerCount = [...slides()].slice(0, currentSlide + 1).filter(
    (s) => s.dataset.type === "beer"
  ).length;
  if (beerCount / (currentSlide + 1) > 0.45) {
    document.body.classList.add("beer-mode");
  } else {
    document.body.classList.remove("beer-mode");
  }
}

function updateCarouselProgress() {
  const progress = document.getElementById("carouselProgress");
  if (progress) {
    const n = slides().length;
    progress.style.width = `${((currentSlide + 1) / n) * 100}%`;
  }
}

function goToSlide(index) {
  const list = slides();
  const n = list.length;
  currentSlide = ((index % n) + n) % n;
  list.forEach((s, i) => s.classList.toggle("active", i === currentSlide));
  document.getElementById("slideCounter").textContent = `${currentSlide + 1} / ${n}`;
  updateBeerMode();
  updateCarouselProgress();
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function prevSlide() {
  goToSlide(currentSlide - 1);
}

let autoplayTimer;
function startAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(nextSlide, 4500);
}

function initRsvp() {
  const result = document.getElementById("rsvpResult");
  document.getElementById("btnYes").addEventListener("click", () => {
    result.hidden = false;
    result.textContent = "🏔️ БРАТАН, ТЫ В СПИСКЕ! Детали — когда-нибудь в чате.";
    spawnConfetti(["🍺", "🏔️", "🎉", "🥾", "🍻"]);
    document.body.classList.add("beer-mode");
  });
  document.getElementById("btnMaybe").addEventListener("click", () => {
    result.hidden = false;
    result.textContent =
      "Реальность сопротивляется? Кинь «ГОРЫ» тайком — мы поймём.";
  });
}

function spawnConfetti(icons) {
  for (let i = 0; i < 30; i++) {
    const c = document.createElement("span");
    c.className = "confetti";
    c.textContent = icons[Math.floor(Math.random() * icons.length)];
    c.style.left = `${Math.random() * 100}vw`;
    c.style.top = "-20px";
    c.style.animationDelay = `${Math.random() * 0.5}s`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 2500);
  }
}

window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    const heroBg = document.querySelector(".hero-bg");
    if (heroBg) heroBg.style.transform = `scale(${1 + y * 0.0002}) translateY(${y * 0.3}px)`;
  },
  { passive: true }
);

document.getElementById("nextSlide").addEventListener("click", () => {
  nextSlide();
  startAutoplay();
});
document.getElementById("prevSlide").addEventListener("click", () => {
  prevSlide();
  startAutoplay();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") nextSlide();
  if (e.key === "ArrowLeft") prevSlide();
});

initParticles();
initScrollProgress();
initCursorGlow();
initNavScroll();
initTiltCards();
initMagnetic();
initObservers();
goToSlide(0);
startAutoplay();
initRsvp();
