// ─────────────────────────────────────────────
//  VISUAL ALCHEMIST — Project Data
//  Edit this array to add / update / remove works.
//  Each object:
//    title    : string
//    category : string  (e.g. "Brand Identity", "Photography")
//    image    : string  (full URL from imgbb, Drive, etc.)
//    featured : boolean (only the FIRST true entry is used as hero)
// ─────────────────────────────────────────────
const projects = [
  {
    title: "Poolapack Brand System",
    category: "Brand Identity",
    image: "https://placehold.co/1200x750/0D1520/4A90D9?text=Poolapack+Brand+System",
    featured: true,
  },
  {
    title: "Visual Alchemist Posters",
    category: "Graphic Design",
    image: "https://placehold.co/800x600/0D1520/4A90D9?text=VA+Posters",
    featured: false,
  },
  {
    title: "Textile Market Stories",
    category: "Social Media",
    image: "https://placehold.co/800x600/0D1520/4A90D9?text=Textile+Stories",
    featured: false,
  },
  {
    title: "Your Next Project",
    category: "Photography",
    image: "https://placehold.co/800x600/0D1520/4A90D9?text=Your+Next+Project",
    featured: false,
  },
];

// ─────────────────────────────────────────────
//  RENDERER — do not edit below unless needed
// ─────────────────────────────────────────────
function renderWorks() {
  const featuredEl = document.getElementById("featured-work");
  const gridEl = document.getElementById("work-grid");

  if (!featuredEl || !gridEl) return;

  gridEl.innerHTML = "";

  featuredEl.innerHTML = `
    <div class="work-carousel" aria-roledescription="carousel">
      <button class="carousel-arrow carousel-arrow--prev" type="button" aria-label="Previous project">
        <span aria-hidden="true">‹</span>
      </button>

      <div class="work-carousel-stage">
        ${projects
          .map(
            (p, index) => `
            <article class="work-card work-carousel-card" data-index="${index}">
              <div class="work-image-wrap">
                <img
                  src="${p.image}"
                  alt="${p.title}"
                  loading="lazy"
                  draggable="false"
                  onerror="this.parentElement.classList.add('img-error')"
                />
              </div>
              <div class="work-copy">
                <span class="work-eyebrow">${p.featured ? "Featured" : "Project"}</span>
                <h3>${p.title}</h3>
                <p>${p.category}</p>
              </div>
            </article>
          `
          )
          .join("")}
      </div>

      <button class="carousel-arrow carousel-arrow--next" type="button" aria-label="Next project">
        <span aria-hidden="true">›</span>
      </button>
    </div>
  `;

  initWorksCarousel(featuredEl);
}

function initWorksCarousel(root) {
  const cards = [...root.querySelectorAll(".work-carousel-card")];
  const prevButton = root.querySelector(".carousel-arrow--prev");
  const nextButton = root.querySelector(".carousel-arrow--next");
  const stage = root.querySelector(".work-carousel-stage");
  const autoSlideDelay = 3600;
  let activeIndex = cards.findIndex((card) => projects[Number(card.dataset.index)]?.featured);
  let autoSlideTimer;
  let dragStartX = 0;
  let dragDeltaX = 0;
  let isDragging = false;

  if (!cards.length || !stage) return;
  if (activeIndex < 0) activeIndex = 0;

  const wrapIndex = (index) => (index + cards.length) % cards.length;

  const render = () => {
    const prevIndex = wrapIndex(activeIndex - 1);
    const nextIndex = wrapIndex(activeIndex + 1);

    cards.forEach((card, index) => {
      card.classList.remove("is-active", "is-prev", "is-next", "is-hidden");

      if (index === activeIndex) {
        card.classList.add("is-active");
        card.setAttribute("aria-hidden", "false");
      } else if (index === prevIndex) {
        card.classList.add("is-prev");
        card.setAttribute("aria-hidden", "false");
      } else if (index === nextIndex) {
        card.classList.add("is-next");
        card.setAttribute("aria-hidden", "false");
      } else {
        card.classList.add("is-hidden");
        card.setAttribute("aria-hidden", "true");
      }
    });
  };

  const goTo = (index) => {
    activeIndex = wrapIndex(index);
    render();
  };

  const restartAutoSlide = () => {
    window.clearInterval(autoSlideTimer);
    autoSlideTimer = window.setInterval(() => goTo(activeIndex + 1), autoSlideDelay);
  };

  const goNext = () => {
    goTo(activeIndex + 1);
    restartAutoSlide();
  };

  const goPrev = () => {
    goTo(activeIndex - 1);
    restartAutoSlide();
  };

  prevButton?.addEventListener("click", goPrev);
  nextButton?.addEventListener("click", goNext);

  stage.addEventListener("pointerdown", (event) => {
    isDragging = true;
    dragStartX = event.clientX;
    dragDeltaX = 0;
    stage.setPointerCapture(event.pointerId);
    window.clearInterval(autoSlideTimer);
  });

  stage.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    dragDeltaX = event.clientX - dragStartX;
  });

  stage.addEventListener("pointerup", (event) => {
    if (!isDragging) return;
    isDragging = false;
    stage.releasePointerCapture(event.pointerId);

    if (Math.abs(dragDeltaX) > 50) {
      dragDeltaX < 0 ? goTo(activeIndex + 1) : goTo(activeIndex - 1);
    }

    restartAutoSlide();
  });

  stage.addEventListener("pointercancel", () => {
    isDragging = false;
    restartAutoSlide();
  });

  stage.addEventListener("mouseenter", () => window.clearInterval(autoSlideTimer));
  stage.addEventListener("mouseleave", restartAutoSlide);

  render();
  restartAutoSlide();
}

// ─────────────────────────────────────────────
//  LEGACY GRID RENDERER — kept as reference for future static layouts
// ─────────────────────────────────────────────
function renderProjectGrid(gridEl, gridProjects) {
  gridEl.innerHTML = gridProjects
    .map(
      (p) => `
      <article class="work-card">
        <div class="work-image-wrap">
          <img
            src="${p.image}"
            alt="${p.title}"
            loading="lazy"
            onerror="this.parentElement.classList.add('img-error')"
          />
        </div>
        <div class="work-copy">
          <h3>${p.title}</h3>
          <p>${p.category}</p>
        </div>
      </article>
    `
    )
    .join("");
}

// ─────────────────────────────────────────────
//  SCROLL REVEAL — subtle fade-up on cards
// ─────────────────────────────────────────────
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".work-card, .photo-tile").forEach((el) => {
    observer.observe(el);
  });
}

// ─────────────────────────────────────────────
//  STICKY HEADER shrink on scroll
// ─────────────────────────────────────────────
function initHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  });
}

// ─────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderWorks();
  initReveal();
  initHeader();
});
