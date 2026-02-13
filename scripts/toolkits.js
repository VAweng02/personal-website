/**
 * Toolkits page — data-driven card rendering + category filtering.
 *
 * To add or edit toolkits, modify the TOOLKITS array below.
 * Each entry needs: category, tag, title, description, status, and (optionally) url.
 *   - category: "career" | "data-science" | "personal"
 *   - tag: freeform label shown on the card (e.g. "Google Sheet", "Template")
 *   - title: toolkit name
 *   - description: one-sentence outcome
 *   - status: "live" | "coming_soon" | "paid"
 *   - url: link target (required for live/paid; ignored for coming_soon)
 *   - image: preview image path (optional)
 */

const TOOLKITS = [
  // ── Career ──────────────────────────────────────────────
  {
    category: "career",
    tag: "Template",
    title: "Resume Template",
    description: "Standard and effective resume template.",
    status: "live",
    url: "/toolkits/resume-template.html",
    image: "/assets/images/previews/resume-template.jpg",
  },

  // ── Personal Systems ────────────────────────────────────
  {
    category: "personal",
    tag: "Google Sheet",
    title: "Personal Finance Dashboard",
    description: "Track net worth, cash flow, and spending in one dashboard.",
    status: "coming_soon",
    url: "#",
  },
];

/* ── Helpers ─────────────────────────────────────────────── */

function statusLabel(status) {
  switch (status) {
    case "live":
      return "Free";
    case "paid":
      return "Paid";
    case "coming_soon":
      return "Coming Soon";
    default:
      return "";
  }
}

function statusLabelClass(status) {
  switch (status) {
    case "live":
      return "toolkit-card__label--free";
    case "paid":
      return "toolkit-card__label--paid";
    case "coming_soon":
      return "toolkit-card__label--soon";
    default:
      return "";
  }
}

function ctaMarkup(status, url) {
  if (status === "coming_soon") {
    return '<button class="btn toolkit-card__btn toolkit-card__btn--disabled" disabled>Coming Soon</button>';
  }
  if (status === "paid") {
    return `<a href="${url || "#"}" class="btn toolkit-card__btn toolkit-card__btn--paid">Buy</a>`;
  }
  return `<a href="${url || "#"}" class="btn toolkit-card__btn">Get Toolkit</a>`;
}

function imageMarkup(toolkit) {
  if (!toolkit.image) {
    return '<div class="toolkit-card__img toolkit-card__img--placeholder"><span>Coming Soon</span></div>';
  }
  const linkUrl = toolkit.url || "#";
  const isClickable = toolkit.status !== "coming_soon";
  if (isClickable) {
    return `<a href="${linkUrl}" class="toolkit-card__img-link"><img class="toolkit-card__img" src="${toolkit.image}" alt="${toolkit.title} preview"></a>`;
  }
  return `<img class="toolkit-card__img" src="${toolkit.image}" alt="${toolkit.title} preview">`;
}

function buildCard(toolkit) {
  return `
    <div class="toolkit-card ${toolkit.category}">
      ${imageMarkup(toolkit)}
      <div class="toolkit-card__body">
        <div class="toolkit-card__badges">
          <span class="toolkit-card__tag">${toolkit.tag}</span>
          <span class="toolkit-card__label ${statusLabelClass(toolkit.status)}">${statusLabel(toolkit.status)}</span>
        </div>
        <h3 class="toolkit-card__title">${toolkit.title}</h3>
        <p class="toolkit-card__desc">${toolkit.description}</p>
        ${ctaMarkup(toolkit.status, toolkit.url)}
      </div>
    </div>`;
}

/* ── Rendering & Filtering ───────────────────────────────── */

function renderCards(filter) {
  const grid = document.getElementById("toolkit-grid");
  if (!grid) return;

  const visible =
    filter === "all"
      ? TOOLKITS
      : TOOLKITS.filter((t) => t.category === filter);

  grid.innerHTML = visible.map(buildCard).join("");
}

function initToolkits() {
  const buttons = document.querySelectorAll(".toolkits-library .category");
  const params = new URLSearchParams(window.location.search);
  const initial = params.get("filter") || "all";

  // Set initial active button
  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === initial);
  });

  renderCards(initial);

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Update URL without reload
      const url =
        filter === "all"
          ? window.location.pathname
          : `${window.location.pathname}?filter=${filter}`;
      history.pushState({ filter }, "", url);

      renderCards(filter);
    });
  });

  window.addEventListener("popstate", (e) => {
    const filter = (e.state && e.state.filter) || "all";
    buttons.forEach((b) =>
      b.classList.toggle("active", b.dataset.filter === filter)
    );
    renderCards(filter);
  });
}

document.addEventListener("partials:loaded", initToolkits);
