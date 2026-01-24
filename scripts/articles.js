// scripts/articles.js
document.addEventListener("partials:loaded", () => {
  const filterButtons = document.querySelectorAll(".categories .category");
  const articles = document.querySelectorAll(".article-card");

  if (!filterButtons.length || !articles.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.dataset.filter;

      articles.forEach((article) => {
        article.style.display =
          filter === "all" || article.classList.contains(filter) ? "block" : "none";
      });
    });
  });

  // Keep your current behavior: apply whatever is marked active by default
  const defaultBtn = document.querySelector(".category.active");
  if (defaultBtn) defaultBtn.click();
});
