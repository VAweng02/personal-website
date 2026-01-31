// scripts/articles.js
document.addEventListener("partials:loaded", () => {
  const filterButtons = document.querySelectorAll(".categories .category");
  const allArticles = Array.from(document.querySelectorAll(".article-card"));
  const paginationContainer = document.querySelector(".pagination");

  if (!filterButtons.length || !allArticles.length) return;

  const ARTICLES_PER_PAGE = 6;

  // Get state from URL
  function getStateFromURL() {
    const params = new URLSearchParams(window.location.search);
    return {
      filter: params.get("filter") || "all",
      page: parseInt(params.get("page"), 10) || 1
    };
  }

  // Update URL without reload
  function updateURL(filter, page) {
    const params = new URLSearchParams();
    if (filter !== "all") params.set("filter", filter);
    if (page > 1) params.set("page", page);

    const newURL = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    history.pushState({ filter, page }, "", newURL);
  }

  // Get filtered articles
  function getFilteredArticles(filter) {
    if (filter === "all") return allArticles;
    return allArticles.filter(article => article.classList.contains(filter));
  }

  // Render pagination controls
  function renderPagination(totalArticles, currentPage, filter) {
    const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);

    if (totalPages <= 1) {
      paginationContainer.innerHTML = "";
      return;
    }

    let html = "";

    // Previous arrow
    html += `<button class="pagination__btn pagination__prev ${currentPage === 1 ? "disabled" : ""}"
              data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>
              <i class="fas fa-chevron-left"></i>
            </button>`;

    // Page numbers
    html += '<div class="pagination__numbers">';
    for (let i = 1; i <= totalPages; i++) {
      // Show first, last, current, and adjacent pages
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        html += `<button class="pagination__num ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        html += '<span class="pagination__ellipsis">...</span>';
      }
    }
    html += '</div>';

    // Next arrow
    html += `<button class="pagination__btn pagination__next ${currentPage === totalPages ? "disabled" : ""}"
              data-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""}>
              <i class="fas fa-chevron-right"></i>
            </button>`;

    paginationContainer.innerHTML = html;

    // Add click handlers
    paginationContainer.querySelectorAll("button:not(.disabled)").forEach(btn => {
      btn.addEventListener("click", () => {
        const newPage = parseInt(btn.dataset.page, 10);
        updateURL(filter, newPage);
        render(filter, newPage);
        // Scroll to top of articles section
        document.querySelector(".article-library").scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  // Main render function
  function render(filter, page) {
    const filtered = getFilteredArticles(filter);
    const totalArticles = filtered.length;
    const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);

    // Clamp page number
    page = Math.max(1, Math.min(page, totalPages || 1));

    // Calculate slice
    const start = (page - 1) * ARTICLES_PER_PAGE;
    const end = start + ARTICLES_PER_PAGE;
    const pageArticles = filtered.slice(start, end);

    // Hide all, show only current page
    allArticles.forEach(article => {
      article.style.display = "none";
    });
    pageArticles.forEach(article => {
      article.style.display = "flex";
    });

    // Update active filter button
    filterButtons.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.filter === filter);
    });

    // Render pagination
    renderPagination(totalArticles, page, filter);
  }

  // Filter button clicks
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      updateURL(filter, 1); // Reset to page 1
      render(filter, 1);
    });
  });

  // Handle browser back/forward
  window.addEventListener("popstate", (e) => {
    const state = e.state || getStateFromURL();
    render(state.filter, state.page);
  });

  // Initial render from URL
  const initialState = getStateFromURL();
  render(initialState.filter, initialState.page);
});
