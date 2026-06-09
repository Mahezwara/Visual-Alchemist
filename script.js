const header = document.querySelector("[data-header]");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".section-heading, .work-card, .photo-tile, .about-content").forEach((item) => {
  item.classList.add("reveal");
  revealObserver.observe(item);
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
