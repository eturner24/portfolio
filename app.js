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
	  const files = [
		["about.md", "about"],
		["portfolio.md", "portfolio"],
		["education-other.md", "education"],
	  ];

	  for (const [filename, elementId] of files) {
		try {
		  await this.render(filename, elementId);
		} catch (error) {
		  console.error(`${filename} failed:`, error);

		  document.querySelector(`#${elementId}`).innerHTML = `
			<p class="error">
			  Could not load ${filename}.
			</p>
		  `;
		}
	  }
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
    console.log("Starting content loader...");
    await loader.renderAll();
    console.log("All content loaded successfully.");
  } catch (error) {
    console.error("Portfolio loading failed:", error);

    document.querySelector("main").innerHTML = `
      <p style="color: red; padding: 2rem;">
        Content failed to load: ${error.message}
      </p>
    `;
  }
}

initializeSite();

