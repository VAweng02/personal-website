/**
 * Resources page — data-driven card rendering + category filtering.
 *
 * To add or edit resources, modify the RESOURCES array below.
 * Each entry needs: category, tag, title, description, status, and (optionally) url.
 *   - category: "career" | "data-science" | "personal"
 *   - tag: freeform label shown on the card (e.g. "Google Sheet", "Template")
 *   - title: resource name
 *   - description: one-sentence outcome
 *   - status: "live" | "coming_soon" | "paid"
 *   - url: link target (required for live/paid; ignored for coming_soon)
 *   - image: preview image path (optional)
 */

const RESOURCES = [
  // ── Career ──────────────────────────────────────────────
  {
    category: "career",
    tag: "Template",
    title: "Resume Template",
    description: "Standard and effective resume template.",
    status: "live",
    url: "/resources/resume-template.html",
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
      return "resource-card__label--free";
    case "paid":
      return "resource-card__label--paid";
    case "coming_soon":
      return "resource-card__label--soon";
    default:
      return "";
  }
}

function ctaMarkup(status, url) {
  if (status === "coming_soon") {
    return '<button class="btn resource-card__btn resource-card__btn--disabled" disabled>Coming Soon</button>';
  }
  if (status === "paid") {
    return `<a href="${url || "#"}" class="btn resource-card__btn resource-card__btn--paid">Buy</a>`;
  }
  return `<a href="${url || "#"}" class="btn resource-card__btn">Get Resource</a>`;
}

function imageMarkup(resource) {
  if (!resource.image) {
    return '<div class="resource-card__img resource-card__img--placeholder"><span>Coming Soon</span></div>';
  }
  const linkUrl = resource.url || "#";
  const isClickable = resource.status !== "coming_soon";
  if (isClickable) {
    return `<a href="${linkUrl}" class="resource-card__img-link"><img class="resource-card__img" src="${resource.image}" alt="${resource.title} preview"></a>`;
  }
  return `<img class="resource-card__img" src="${resource.image}" alt="${resource.title} preview">`;
}

function buildCard(resource) {
  return `
    <div class="resource-card ${resource.category}">
      ${imageMarkup(resource)}
      <div class="resource-card__body">
        <div class="resource-card__badges">
          <span class="resource-card__tag">${resource.tag}</span>
          <span class="resource-card__label ${statusLabelClass(resource.status)}">${statusLabel(resource.status)}</span>
        </div>
        <h3 class="resource-card__title">${resource.title}</h3>
        <p class="resource-card__desc">${resource.description}</p>
        ${ctaMarkup(resource.status, resource.url)}
      </div>
    </div>`;
}

/* ── Rendering & Filtering ───────────────────────────────── */

function renderCards(filter) {
  const grid = document.getElementById("resource-grid");
  if (!grid) return;

  const visible =
    filter === "all"
      ? RESOURCES
      : RESOURCES.filter((t) => t.category === filter);

  grid.innerHTML = visible.map(buildCard).join("");
}

function initResources() {
  const buttons = document.querySelectorAll(".resources-library .category");
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

document.addEventListener("partials:loaded", initResources);
