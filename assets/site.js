(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector(".theme-toggle");
  const sunIcon = document.querySelector(".sun-icon");
  const moonIcon = document.querySelector(".moon-icon");
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".nav-links");
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const newsToggle = document.querySelector(".news-toggle");
  const extraNews = [...document.querySelectorAll(".extra-news")];

  const savedTheme = window.localStorage.getItem("jft-theme");
  let theme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";

  const applyTheme = (nextTheme) => {
    theme = nextTheme;
    root.dataset.theme = theme;
    window.localStorage.setItem("jft-theme", theme);
    const dark = theme === "dark";
    if (sunIcon) sunIcon.hidden = !dark;
    if (moonIcon) moonIcon.hidden = dark;
    if (themeToggle) {
      const label = `Switch to ${dark ? "light" : "dark"} mode`;
      themeToggle.setAttribute("aria-label", label);
      themeToggle.setAttribute("title", label);
    }
  };

  applyTheme(theme);

  themeToggle?.addEventListener("click", () => {
    applyTheme(theme === "dark" ? "light" : "dark");
  });

  const closeMenu = () => {
    navigation?.classList.remove("is-open");
    menuToggle?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  };

  menuToggle?.addEventListener("click", () => {
    const open = !navigation?.classList.contains("is-open");
    navigation?.classList.toggle("is-open", open);
    menuToggle.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));

  newsToggle?.addEventListener("click", () => {
    const expanding = newsToggle.getAttribute("aria-expanded") !== "true";
    extraNews.forEach((item) => {
      item.hidden = !expanding;
      if (expanding) requestAnimationFrame(() => item.classList.add("is-visible"));
    });
    newsToggle.setAttribute("aria-expanded", String(expanding));
    newsToggle.textContent = expanding ? "Show Less" : "See More";
  });

  const revealNodes = [...document.querySelectorAll("[data-reveal]")];
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.14 },
    );
    revealNodes.forEach((node) => revealObserver.observe(node));

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target.id) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
        });
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0.05, 0.2, 0.45] },
    );
    document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));
  } else {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  }
})();
