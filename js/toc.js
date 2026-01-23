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

  // smooth scroll on click
  tocRoot.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;

    const id = a.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  });

  // highlight active section while scrolling
  const links = Array.from(tocRoot.querySelectorAll("a"));
  const linkById = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));

  const observer = new IntersectionObserver(
    (entries) => {
      // find the first visible heading (closest to top)
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

      if (!visible) return;

      links.forEach((l) => l.classList.remove("active"));
      const active = linkById.get(visible.target.id);
      if (active) active.classList.add("active");
    },
    { rootMargin: "0px 0px -70% 0px", threshold: [0.1, 1.0] }
  );

  headings.forEach((h) => observer.observe(h));
})();