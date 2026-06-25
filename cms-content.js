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
  const mode = options.mode || "default";
  const card = createEl("article", "project-card");

  const img = document.createElement("img");
  img.src = project.image || project.images?.[0] || "";
  img.alt = project.imageAlt || project.title || "Project photo";
  card.appendChild(img);

  const content = createEl("div", "content");

  const meta = createEl("div", "meta");

  const kicker = createEl("span", "kicker");
  kicker.textContent = project.category || project.style || "Project";
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

  if (mode === "featured") {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      window.location.href = "projects.html";
    });
  } else if (mode === "gallery") {
    card.style.cursor = "default";
  } else if (project.link) {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      window.location.href = project.link;
    });
  }

  card.appendChild(content);
  return card;
}

function createProjectShowcase(project) {
  const section = createEl("article", "project-showcase");

  const images =
    Array.isArray(project.images) && project.images.length
      ? project.images
      : project.image
        ? [project.image]
        : [];

  let currentIndex = 0;

  const media = createEl("div", "project-carousel");

  const img = document.createElement("img");
  img.src = images[0] || "";
  img.alt = project.imageAlt || project.title || "Project photo";
  media.appendChild(img);

  const prevBtn = createEl("button", "carousel-btn carousel-prev");
  prevBtn.type = "button";
  prevBtn.textContent = "‹";
  prevBtn.setAttribute("aria-label", "Previous project photo");

  const nextBtn = createEl("button", "carousel-btn carousel-next");
  nextBtn.type = "button";
  nextBtn.textContent = "›";
  nextBtn.setAttribute("aria-label", "Next project photo");

  const dots = createEl("div", "carousel-dots");

  function updateImage() {
    img.src = images[currentIndex] || "";
    dots.querySelectorAll("button").forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentIndex);
    });
  }

  images.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `View project photo ${index + 1}`);
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateImage();
    });
    dots.appendChild(dot);
  });

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  });

  if (images.length > 1) {
    media.appendChild(prevBtn);
    media.appendChild(nextBtn);
    media.appendChild(dots);
  }

  updateImage();

  const content = createEl("div", "project-showcase-content");

  const kicker = createEl("div", "kicker");
  kicker.textContent = project.location || project.category || "Featured Project";
  content.appendChild(kicker);

  const title = document.createElement("h2");
  title.textContent = project.title || "Project";
  content.appendChild(title);

  if (project.style) {
    const style = createEl("h3", "project-style");
    style.textContent = project.style;
    content.appendChild(style);
  }

  if (project.description) {
    const desc = document.createElement("p");
    desc.textContent = project.description;
    content.appendChild(desc);
  }

  if (Array.isArray(project.details) && project.details.length) {
    const details = createEl("div", "project-details");

    project.details.forEach((detail) => {
      const item = createEl("span", "project-detail");
      item.textContent = String(detail);
      details.appendChild(item);
    });

    content.appendChild(details);
  }

  if (Array.isArray(project.team) && project.team.length) {
    const team = createEl("div", "project-team");

    const teamTitle = document.createElement("strong");
    teamTitle.textContent = "Design Team";
    team.appendChild(teamTitle);

    project.team.forEach((member) => {
      const p = document.createElement("p");
      p.textContent = String(member);
      team.appendChild(p);
    });

    content.appendChild(team);
  }

  section.appendChild(media);
  section.appendChild(content);

  return section;
}

function renderCurrentWork(currentWork) {
  const section = byId("currentWorkSection");
  const titleEl = byId("currentWorkTitle");
  const subtitleEl = byId("currentWorkSubtitle");
  const gallery = byId("currentWorkGallery");

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

  const leadEl = byId("projectsLead");
  const leadText = typeof data.lead === "string" ? data.lead : "";

  if (leadEl) {
    if (!leadText.trim()) {
      leadEl.textContent = "";
      leadEl.style.display = "none";
    } else {
      leadEl.style.display = "";
      leadEl.textContent = leadText;
    }
  }

  const gallery = byId("projectsGallery");
  if (gallery && Array.isArray(data.projects)) {
    clearChildren(gallery);

    gallery.classList.remove("grid", "triangle-grid");
    gallery.classList.add("project-showcase-list");

    data.projects.forEach((p) => {
      gallery.appendChild(createProjectShowcase(p));
    });
  }

  // renderCurrentWork(data.currentWork);
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