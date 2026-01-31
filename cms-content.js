async function loadJSON(path) {
  try {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function byId(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  const el = byId(id);
  if (el && typeof value === "string") el.textContent = value;
}

function setHref(id, value) {
  const el = byId(id);
  if (el && typeof value === "string") el.setAttribute("href", value);
}

function setSrc(id, value) {
  const el = byId(id);
  if (el && typeof value === "string") el.setAttribute("src", value);
}

function setAlt(id, value) {
  const el = byId(id);
  if (el && typeof value === "string") el.setAttribute("alt", value);
}

function clearChildren(el) {
  while (el && el.firstChild) el.removeChild(el.firstChild);
}

function createEl(tag, className) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

function createServiceCard(svc) {
  const article = createEl("article", "service-card");

  const h3 = document.createElement("h3");
  h3.textContent = svc.title || "Service";
  article.appendChild(h3);

  const p = document.createElement("p");
  p.textContent = svc.description || "";
  article.appendChild(p);

  if (Array.isArray(svc.bullets) && svc.bullets.length) {
    const ul = createEl("ul", "bullets");
    svc.bullets.forEach((b) => {
      const li = document.createElement("li");
      li.textContent = String(b);
      ul.appendChild(li);
    });
    article.appendChild(ul);
  }

  return article;
}

function createProjectCard(project, options = {}) {
  // options.mode:
  // - "featured": clicking goes to Projects page
  // - "gallery": no click behavior (non-interactive)
  const mode = options.mode || "default";
  const card = createEl("article", "project-card");

  const img = document.createElement("img");
  img.src = project.image || "";
  img.alt = project.imageAlt || project.title || "Project photo";
  card.appendChild(img);

  const content = createEl("div", "content");

  const meta = createEl("div", "meta");

  const kicker = createEl("span", "kicker");
  kicker.textContent = project.category || "Project";
  meta.appendChild(kicker);

  const badges = Array.isArray(project.badges) ? project.badges : [];
  badges.slice(0, 3).forEach((b) => {
    const badge = createEl("span", "badge");
    badge.textContent = String(b);
    meta.appendChild(badge);
  });

  if (project.location) {
    const badge = createEl("span", "badge");
    badge.textContent = project.location;
    meta.appendChild(badge);
  }

  content.appendChild(meta);

  const h3 = document.createElement("h3");
  h3.textContent = project.title || "Project";
  content.appendChild(h3);

  if (project.description) {
    const p = document.createElement("p");
    p.textContent = project.description;
    content.appendChild(p);
  }

  // ✅ YOUR REQUIRED CLICK RULES
  if (mode === "featured") {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      window.location.href = "projects.html";
    });
  } else if (mode === "gallery") {
    // ✅ Projects page: intentionally no click behavior
    card.style.cursor = "default";
  } else if (project.link) {
    // Optional for other contexts
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      window.location.href = project.link;
    });
  }

  card.appendChild(content);
  return card;
}

/* ✅ NEW: Render "Currently Working On" from projects.json */
function renderCurrentWork(currentWork) {
  const section = byId("currentWorkSection");
  const titleEl = byId("currentWorkTitle");
  const subtitleEl = byId("currentWorkSubtitle");
  const gallery = byId("currentWorkGallery");

  // If placeholders aren't on the page, silently do nothing
  if (!section || !titleEl || !subtitleEl || !gallery) return;

  if (!currentWork || !Array.isArray(currentWork.items) || currentWork.items.length === 0) {
    section.hidden = true;
    return;
  }

  titleEl.textContent = currentWork.title || "Currently Working On";
  subtitleEl.textContent = currentWork.subtitle || "";
  clearChildren(gallery);

  currentWork.items.forEach((item) => {
    const card = createEl("article", "project-card");

    const img = document.createElement("img");
    img.src = item.image || "";
    img.alt = item.alt || item.title || "Current work photo";
    card.appendChild(img);

    const content = createEl("div", "content");

    const h3 = document.createElement("h3");
    h3.textContent = item.title || "Update";
    content.appendChild(h3);

    if (item.caption) {
      const p = document.createElement("p");
      p.textContent = item.caption;
      content.appendChild(p);
    }

    card.appendChild(content);

    // No click behavior for this section (matches your projects page rule)
    card.style.cursor = "default";

    gallery.appendChild(card);
  });

  section.hidden = false;
}

function applyGlobalSite(site) {
  if (!site) return;

  setText("brandName", site.brandName);
  setText("brandTagline", site.tagline);
  setText("brandNameFooter", site.brandName);

  // Logo: shows image if present
  const logoEl = byId("brandLogo");
  if (logoEl) {
    if (site.logo && typeof site.logo === "string" && site.logo.trim()) {
      logoEl.src = site.logo;
      logoEl.alt = site.logoAlt || `${site.brandName || "PrestigeHomeDesign"} logo`;
      logoEl.removeAttribute("hidden");
    } else {
      logoEl.setAttribute("hidden", "true");
    }
  }
}

async function applyHomeContent() {
  const home = await loadJSON("/content/home.json");
  if (!home) return;

  setText("homeEyebrow", home.eyebrow);
  setText("homeHeadline", home.headline);
  setText("homeLead", home.lead);

  setText("ctaPrimary", home.ctaPrimaryText);
  setText("ctaSecondary", home.ctaSecondaryText);

  if (home.ctaPrimaryLink) setHref("ctaPrimary", home.ctaPrimaryLink);
  if (home.ctaSecondaryLink) setHref("ctaSecondary", home.ctaSecondaryLink);

  if (home.heroImage) {
    setSrc("homeHeroImage", home.heroImage);
    if (home.heroImageAlt) setAlt("homeHeroImage", home.heroImageAlt);
  }

  const metrics = Array.isArray(home.metrics) ? home.metrics : [];
  const m = metrics.concat([{}, {}, {}]).slice(0, 3);
  setText("m1Value", m[0].value);
  setText("m1Label", m[0].label);
  setText("m2Value", m[1].value);
  setText("m2Label", m[1].label);
  setText("m3Value", m[2].value);
  setText("m3Label", m[2].label);

  // ✅ Featured work uses first 2 projects; cards go to projects.html
  const featuredWrap = byId("featuredGrid");
  if (featuredWrap) {
    const projectsData = await loadJSON("/content/projects.json");
    if (projectsData && Array.isArray(projectsData.projects)) {
      clearChildren(featuredWrap);
      projectsData.projects
        .slice(0, 2)
        .forEach((p) => featuredWrap.appendChild(createProjectCard(p, { mode: "featured" })));
    }
  }
}

async function applyServicesContent() {
  const data = await loadJSON("/content/services.json");
  if (!data) return;

  setText("servicesHeadline", data.headline);
  setText("servicesLead", data.lead);

  const container = byId("servicesCards");
  if (container && Array.isArray(data.services)) {
    clearChildren(container);
    data.services.forEach((svc) => container.appendChild(createServiceCard(svc)));
  }
}

async function applyProjectsContent() {
  const data = await loadJSON("/content/projects.json");
  if (!data) return;

  setText("projectsHeadline", data.headline);
  if (data.lead && data.lead.trim()) {
    setText("projectsLead", data.lead);
  }
  

  const gallery = byId("projectsGallery");
  if (gallery && Array.isArray(data.projects)) {
    clearChildren(gallery);
    // ✅ Projects page cards do nothing
    data.projects.forEach((p) => gallery.appendChild(createProjectCard(p, { mode: "gallery" })));
  }

  // ✅ NEW: CMS-driven "Currently Working On"
  renderCurrentWork(data.currentWork);
}

async function applyAboutContent() {
  const data = await loadJSON("/content/about.json");
  if (!data) return;

  setText("aboutHeadline", data.headline);
  setText("aboutLead", data.lead);

  const bodyEl = byId("aboutBody");
  if (bodyEl && Array.isArray(data.body)) {
    clearChildren(bodyEl);
    data.body.forEach((para) => {
      const p = document.createElement("p");
      p.textContent = String(para);
      bodyEl.appendChild(p);
    });
  }

  if (data.image) {
    setSrc("aboutImage", data.image);
    if (data.imageAlt) setAlt("aboutImage", data.imageAlt);
  }
}

async function applyContactContent(site) {
  const data = await loadJSON("/content/contact.json");
  const merged = Object.assign({}, site || {}, data || {});

  setText("contactHeadline", merged.headline || "Contact");
  setText("contactLead", merged.lead || "");

  if (merged.email) {
    const emailText = byId("contactEmailText");
    if (emailText) emailText.textContent = merged.email;
    const emailLink = byId("contactEmailLink");
    if (emailLink) emailLink.setAttribute("href", `mailto:${merged.email}`);
  }

  if (merged.phone) {
    const phoneText = byId("contactPhoneText");
    if (phoneText) phoneText.textContent = merged.phoneDisplay || merged.phone;
    const phoneLink = byId("contactPhoneLink");
    if (phoneLink) phoneLink.setAttribute("href", `tel:${merged.phone}`);
  }
}

async function applyCMSContent() {
  const page = document.body?.dataset?.page || "";

  const site = await loadJSON("/content/site.json");
  applyGlobalSite(site);

  if (page === "home") await applyHomeContent();
  if (page === "services") await applyServicesContent();
  if (page === "projects") await applyProjectsContent();
  if (page === "about") await applyAboutContent();
  if (page === "contact") await applyContactContent(site);
}

document.addEventListener("DOMContentLoaded", applyCMSContent);
;
