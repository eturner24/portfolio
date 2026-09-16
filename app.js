class MarkdownContentLoader {
  constructor(contentFolder = "content") {
    this.contentFolder = contentFolder;
  }

  async load(filename) {
    const response = await fetch(
      `${this.contentFolder}/${filename}`
    );

    if (!response.ok) {
      throw new Error(
        `Could not load ${this.contentFolder}/${filename}`
      );
    }

    return response.text();
  }

  async render(filename, elementId) {
    const markdown = await this.load(filename);
    const element = document.querySelector(`#${elementId}`);

    if (!element) {
      throw new Error(`Could not find element #${elementId}`);
    }

    element.innerHTML = marked.parse(markdown);
  }

  async renderAll() {
    await Promise.all([
      this.render("about.md", "about"),
      this.render("portfolio.md", "portfolio"),
      this.render("education-other.md", "education"),
    ]);
  }
}

function renderNavigation() {
  const navigation = [
    ["About", "about"],
    ["Portfolio", "portfolio"],
    ["Education and Other", "education"],
  ];

  document.querySelector("#navigation").innerHTML = navigation
    .map(
      ([label, id]) =>
        `<li><a href="#${id}">${label}</a></li>`
    )
    .join("");
}

function renderFooter() {
  document.querySelector("#site-footer").innerHTML = `
    <p>
      Em Turner ·
      <a href="mailto:eturner24@gmail.com">
        eturner24@gmail.com
      </a> ·
      <a
        href="https://www.linkedin.com/in/ejturner24/"
        target="_blank"
        rel="noopener"
      >
        LinkedIn
      </a>
    </p>
  `;
}

async function initializeSite() {
  renderNavigation();
  renderFooter();

  const loader = new MarkdownContentLoader("content");

  try {
    await loader.renderAll();
  } catch (error) {
    console.error(error);

    document.querySelector("main").innerHTML = `
      <p class="error">
        Some portfolio content could not be loaded.
      </p>
    `;
  }
}

initializeSite();
