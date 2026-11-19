const slides = Array.from(document.querySelectorAll(".hero__slide"));
const dotsContainer = document.querySelector(".carousel__dots");
const previousButton = document.querySelector(".carousel__arrow--prev");
const nextButton = document.querySelector(".carousel__arrow--next");
const currentCount = document.querySelector(".carousel__current");
const heroIndex = document.querySelector(".hero__index");
const hero = document.querySelector(".hero");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");
const newsletterForm = document.querySelector(".newsletter__form");
const newsletterStatus = document.querySelector(".newsletter__status");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let activeIndex = 0;
let autoplayId;

function showSlide(index) {
  activeIndex = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeIndex;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });

  dotsContainer.querySelectorAll(".carousel__dot").forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeIndex;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-current", isActive ? "true" : "false");
  });

  currentCount.textContent = String(activeIndex + 1).padStart(2, "0");
  heroIndex.textContent = String(activeIndex + 1).padStart(2, "0");
}

function stopAutoplay() {
  window.clearInterval(autoplayId);
  autoplayId = undefined;
}

function startAutoplay() {
  stopAutoplay();

  if (!reducedMotion.matches && !document.hidden) {
    autoplayId = window.setInterval(() => showSlide(activeIndex + 1), 6000);
  }
}

slides.forEach((slide, index) => {
  const dot = document.createElement("button");
  dot.className = "carousel__dot";
  dot.type = "button";
  dot.setAttribute("aria-label", `Mostrar imagen ${index + 1}`);
  dot.addEventListener("click", () => {
    showSlide(index);
    startAutoplay();
  });
  dotsContainer.append(dot);
});

previousButton.addEventListener("click", () => {
  showSlide(activeIndex - 1);
  startAutoplay();
});

nextButton.addEventListener("click", () => {
  showSlide(activeIndex + 1);
  startAutoplay();
});

hero.addEventListener("mouseenter", stopAutoplay);
hero.addEventListener("mouseleave", startAutoplay);
hero.addEventListener("focusin", stopAutoplay);
hero.addEventListener("focusout", (event) => {
  if (!hero.contains(event.relatedTarget)) {
    startAutoplay();
  }
});

document.addEventListener("visibilitychange", startAutoplay);
reducedMotion.addEventListener("change", startAutoplay);

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Abrir menú" : "Cerrar menú");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    navigation.classList.remove("is-open");
  });
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  newsletterStatus.textContent = "El formulario aún necesita conectarse al servicio de suscripciones.";
});

showSlide(0);
startAutoplay();
