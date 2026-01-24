// scripts/site.js
function initHamburgerMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navOverlay = document.querySelector(".nav-overlay");
  const closeBtn = document.querySelector(".close-btn");

  if (!hamburger || !navOverlay || !closeBtn) return;

  hamburger.addEventListener("click", () => {
    navOverlay.classList.add("active");
    hamburger.classList.add("hide");
  });

  closeBtn.addEventListener("click", () => {
    navOverlay.classList.remove("active");
    hamburger.classList.remove("hide");
  });
}

function initFooterYear() {
  const yearEl = document.querySelector("[data-year]");
  if (!yearEl) return;
  yearEl.textContent = String(new Date().getFullYear());
}

// Header/footer are injected, so initialize after injection finishes
document.addEventListener("partials:loaded", () => {
  initHamburgerMenu();
  initFooterYear();
});