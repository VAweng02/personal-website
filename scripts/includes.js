// scripts/includes.js
async function includePartials() {
  const nodes = document.querySelectorAll("[data-include]");
  await Promise.all(
    Array.from(nodes).map(async (node) => {
      const path = node.getAttribute("data-include");
      const res = await fetch(path);
      if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
      node.outerHTML = await res.text();
    })
  );
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await includePartials();
    document.dispatchEvent(new Event("partials:loaded"));
  } catch (e) {
    console.error(e);
  }
});