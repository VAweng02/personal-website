import fs from "fs";
import path from "path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";

const ROOT = process.cwd();

const BLOG_DIR = path.join(ROOT, "blog");
const POSTS_DIR = path.join(BLOG_DIR, "posts");
const OUT_DIR = path.join(BLOG_DIR, "dist");

const TEMPLATE_PATH = path.join(BLOG_DIR, "template_post.html");

// Markdown -> HTML converter
const md = new MarkdownIt({
  html: false, // keep false unless you fully trust embedded HTML in markdown
  linkify: true,
  typographer: true,
}).use(anchor, {
  level: [2, 3], // generate ids for h2/h3 (matches your TOC)
  slugify: (s) =>
    s
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // remove punctuation
      .replace(/\s+/g, "-"), // spaces -> dashes
});

function isMarkdownFile(fileName) {
  return fileName.endsWith(".md") && !fileName.startsWith("_");
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function buildOnePost(mdFilePath) {
  const slug = path.basename(mdFilePath, ".md"); // e.g. how_to_break_into_tech
  const raw = fs.readFileSync(mdFilePath, "utf8");

  // Parse frontmatter + markdown body
  const parsed = matter(raw);
  const frontmatter = parsed.data || {};
  const markdownBody = parsed.content || "";

  // Convert markdown -> HTML
  const htmlContent = md.render(markdownBody);

  // Read template
  let template = fs.readFileSync(TEMPLATE_PATH, "utf8");

  // Replace placeholders (safe defaults)
  const title =
    frontmatter.title || slug.replace(/_/g, " ").replace(/-/g, " ");
  const date = frontmatter.date || "";
  const readtime = frontmatter.readtime || "";

  template = template.replaceAll("<!-- POST_TITLE -->", title);
  template = template.replaceAll("<!-- POST_DATE -->", date);
  template = template.replaceAll("<!-- POST_READTIME -->", readtime);

  // Inject content into the article
  if (!template.includes("<!-- POST_CONTENT -->")) {
    throw new Error(
      `Template missing <!-- POST_CONTENT --> placeholder: ${TEMPLATE_PATH}`
    );
  }
  template = template.replace("<!-- POST_CONTENT -->", htmlContent);

  // Write output
  ensureDir(OUT_DIR);
  const outPath = path.join(OUT_DIR, `${slug}.html`);
  fs.writeFileSync(outPath, template, "utf8");

  console.log(`✅ Built ${path.relative(ROOT, outPath)}`);
}

function main() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`Blog folder not found: ${BLOG_DIR}`);
    process.exit(1);
  }
  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`Posts folder not found: ${POSTS_DIR}`);
    console.error(`Expected markdown files in blog/posts/*.md`);
    process.exit(1);
  }
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`Template not found: ${TEMPLATE_PATH}`);
    console.error(
      `Expected a file at blog/template_post.html with <!-- POST_CONTENT --> etc.`
    );
    process.exit(1);
  }

  const mdFiles = fs
    .readdirSync(POSTS_DIR)
    .filter(isMarkdownFile)
    .map((f) => path.join(POSTS_DIR, f));

  if (mdFiles.length === 0) {
    console.log("No .md files found in /blog/posts");
    return;
  }

  ensureDir(OUT_DIR);
  mdFiles.forEach(buildOnePost);
}

main();