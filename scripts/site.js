// scripts/site.js
function initHamburgerMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navOverlay = document.querySelector(".nav-overlay");
  const closeBtn = document.querySelector(".close-btn");
  const backdrop = document.querySelector(".nav-backdrop");

  if (!hamburger || !navOverlay || !closeBtn) return;

  function openMenu() {
    navOverlay.classList.add("active");
    if (backdrop) backdrop.classList.add("active");
    hamburger.classList.add("hide");
  }

  function closeMenu() {
    navOverlay.classList.remove("active");
    if (backdrop) backdrop.classList.remove("active");
    hamburger.classList.remove("hide");
  }

  hamburger.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);
  if (backdrop) backdrop.addEventListener("click", closeMenu);

  // Highlight current page link
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  navOverlay.querySelectorAll("ul a").forEach(function (link) {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
}

function initFooterYear() {
  const yearEl = document.querySelector("[data-year]");
  if (!yearEl) return;
  yearEl.textContent = String(new Date().getFullYear());
}

function initDarkMode() {
  var toggles = document.querySelectorAll(".theme-switch");
  if (!toggles.length) return;

  toggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var isDark = document.documentElement.getAttribute("data-theme") === "dark";
      var next = isDark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  });
}

// Header/footer are injected, so initialize after injection finishes
document.addEventListener("partials:loaded", () => {
  initHamburgerMenu();
  initFooterYear();
  initDarkMode();
});