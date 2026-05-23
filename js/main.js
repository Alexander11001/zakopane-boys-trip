/* Timeline sequence: горы-горы-горы-пиво-горы-горы-пиво-горы-пиво-пиво-пиво-пиво-горы-пиво-пиво-горы */
const SEQUENCE = [
  { type: "mountain", label: "Выезд из дома", time: "Пт 18:00" },
  { type: "mountain", label: "Дорога — «ещё 2 часа до свободы»", time: "Пт 20:00" },
  { type: "mountain", label: "Заезд. Вид на Татры. Ого.", time: "Пт 22:00" },
  { type: "beer", label: "Первое «заслуженное» в Krupówki", time: "Пт 22:30" },
  { type: "mountain", label: "Сон. Сны о вершинах.", time: "Сб 07:00" },
  { type: "mountain", label: "Хайк. Ноги: «зачем?»", time: "Сб 09:00" },
  { type: "beer", label: "Привал. Одно. Может два.", time: "Сб 12:00" },
  { type: "mountain", label: "Ещё тропа — «размять пиво»", time: "Сб 14:00" },
  { type: "beer", label: "Паб. Основная программа.", time: "Сб 17:00" },
  { type: "beer", label: "Пиво. Пиво. Пиво.", time: "Сб 20:00" },
  { type: "beer", label: "«Горы где?» — неважно", time: "Сб 22:00" },
  { type: "beer", label: "Караоке? Нет. Ещё пиво.", time: "Сб 23:30" },
  { type: "mountain", label: "Утро. Горы. Почему так ярко.", time: "Вс 08:00" },
  { type: "beer", label: "Лечебное. Hair of the dog.", time: "Вс 09:30" },
  { type: "beer", label: "Прощальный крафт", time: "Вс 11:00" },
  { type: "mountain", label: "Обратно к семье. Легенды расскажем.", time: "Вс 14:00" },
];

const RATIO_STEPS = [
  { mountains: 100, beer: 0, caption: "Старт: 100% гор, 0% пива. Честно." },
  { mountains: 85, beer: 15, caption: "Первое пиво — «только одно»" },
  { mountains: 70, beer: 30, caption: "Горы ещё доминируют. Пока." },
  { mountains: 55, beer: 45, caption: "Баланс нарушен. Нам нравится." },
  { mountains: 40, beer: 60, caption: "Пиво обгоняет. Физика не спасёт." },
  { mountains: 30, beer: 70, caption: "Горы — декоративный элемент." },
  { mountains: 20, beer: 80, caption: "Пиво-пиво-пиво. Классика." },
  { mountains: 35, beer: 65, caption: "Похмелье: горы вернулись. Ненадолго." },
  { mountains: 15, beer: 85, caption: "Лечебное пиво — наука." },
  { mountains: 25, beer: 75, caption: "Финал: горы на прощание, пиво в сердце." },
];

// Ambient particles
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

// Timeline
function buildTimeline() {
  const track = document.getElementById("slidesTrack");
  const dots = document.getElementById("slideDots");
  SEQUENCE.forEach((item, i) => {
    const el = document.createElement("div");
    el.className = `timeline-item ${item.type}`;
    el.dataset.index = i;
    el.innerHTML = `
      <span class="emoji">${item.type === "mountain" ? "🏔️" : "🍺"}</span>
      <span class="label">${item.label}</span>
      <span class="time">${item.time}</span>
    `;
    track.appendChild(el);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = item.type === "beer" ? "beer-dot" : "";
    dot.setAttribute("aria-label", `Шаг ${i + 1}`);
    dot.addEventListener("click", () => goToSlide(i));
    dots.appendChild(dot);
  });
}

// Intersection observers
function initObservers() {
  const timelineItems = document.querySelectorAll(".timeline-item");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    },
    { threshold: 0.2 }
  );
  timelineItems.forEach((el) => io.observe(el));

  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  const ratioSection = document.getElementById("ratio");
  let ratioIndex = 0;
  const ratioIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) animateRatio();
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
      setTimeout(animateRatio, 1200);
    }
  }
}

// Carousel
let currentSlide = 0;
const slides = () => document.querySelectorAll(".carousel-slide");
const dots = () => document.querySelectorAll(".slide-dots button");

function updateBeerMode() {
  const active = slides()[currentSlide];
  const beerCount = [...slides()].slice(0, currentSlide + 1).filter(
    (s) => s.dataset.type === "beer"
  ).length;
  const total = currentSlide + 1;
  if (beerCount / total > 0.5) document.body.classList.add("beer-mode");
  else document.body.classList.remove("beer-mode");
}

function goToSlide(index) {
  const list = slides();
  const n = list.length;
  currentSlide = ((index % n) + n) % n;
  list.forEach((s, i) => s.classList.toggle("active", i === currentSlide));
  dots().forEach((d, i) => d.classList.toggle("active", i === currentSlide));
  document.getElementById("slideCounter").textContent = `${currentSlide + 1} / ${n}`;
  updateBeerMode();
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

// RSVP
function initRsvp() {
  const result = document.getElementById("rsvpResult");
  document.getElementById("btnYes").addEventListener("click", () => {
    result.hidden = false;
    result.textContent = "🍺 БРАТАН, ТЫ В СПИСКЕ! Жди координаты в чате.";
    spawnConfetti(["🍺", "🏔️", "🎉", "🥾", "🍻"]);
    document.body.classList.add("beer-mode");
  });
  document.getElementById("btnMaybe").addEventListener("click", () => {
    result.hidden = false;
    result.textContent =
      "Жена сказала «нет»? Классика. Напиши «КОТЕЛЬНИЦА» тайно из туалета.";
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

// Scroll-driven parallax on hero
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
buildTimeline();
initObservers();
goToSlide(0);
startAutoplay();
initRsvp();
