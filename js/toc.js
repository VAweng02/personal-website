(function () {
  const article = document.getElementById("post-content");
  const tocRoot = document.getElementById("toc");
  if (!article || !tocRoot) return;

  const headings = Array.from(article.querySelectorAll("h2, h3"));
  if (headings.length === 0) return;

  // slugify helper
  const used = new Map();
  const slugify = (s) =>
    s.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

  // ensure each heading has a unique id
  headings.forEach((h) => {
    if (!h.id) {
      const base = slugify(h.textContent || "section");
      const count = used.get(base) || 0;
      used.set(base, count + 1);
      h.id = count === 0 ? base : `${base}-${count + 1}`;
    }
  });

  // build toc list
  const ul = document.createElement("ul");
  headings.forEach((h) => {
    const li = document.createElement("li");
    li.className = h.tagName.toLowerCase(); // h2 or h3

    const a = document.createElement("a");
    a.href = `#${h.id}`;
    a.textContent = h.textContent || "";

    li.appendChild(a);
    ul.appendChild(li);
  });

  tocRoot.appendChild(ul);

  const links = Array.from(tocRoot.querySelectorAll("a"));

  // OPTIONAL: set initial active item once
  if (links[0]) links[0].classList.add("active");

  // smooth scroll + CLICK-ONLY active highlight
  tocRoot.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;

    const id = a.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();

    // click-only highlight
    links.forEach((l) => l.classList.remove("active"));
    a.classList.add("active");

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  });
})();