
(function () {
  const toggle = document.querySelector("[data-nav-toggle]");
  const links = document.querySelector("[data-nav-links]");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu after navigation (mobile)
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Simple contact form enhancement (no backend)
  const form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const city = String(fd.get("city") || "").trim();
      const service = String(fd.get("service") || "").trim();
      const message = String(fd.get("message") || "").trim();

      const subject = encodeURIComponent(`PrestigeHomeDesign inquiry — ${service || "Project"}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nCity: ${city}\nService: ${service}\n\nDetails:\n${message}\n`
      );

      // Replace with client's email when available
      const to = "hello@prestigehomedesign.com";
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });
  }
})();
