const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("preload");
  const isMobile = window.matchMedia("(max-width: 900px)").matches;
  if (isMobile) {
    document.body.classList.add("lite");
  }

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  if (navToggle && nav) {
    const setNavState = (isOpen) => {
      document.body.classList.toggle("nav-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    };

    navToggle.addEventListener("click", () => {
      const isOpen = !document.body.classList.contains("nav-open");
      setNavState(isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setNavState(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setNavState(false);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        setNavState(false);
      }
    });
  }

  document.querySelectorAll(".section").forEach((section) => {
    const items = section.querySelectorAll(".reveal");
    items.forEach((item, index) => {
      if (!item.style.getPropertyValue("--delay")) {
        item.style.setProperty("--delay", `${index * 0.06}s`);
      }
    });
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("in-view"));
  }

  const calendlyTriggers = document.querySelectorAll("[data-calendly-url]");
  calendlyTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      if (!window.Calendly) {
        return;
      }
      event.preventDefault();
      Calendly.initPopupWidget({ url: trigger.dataset.calendlyUrl });
    });
  });

  if (prefersReducedMotion || isMobile) {
    return;
  }

  const parallaxItems = Array.from(
    document.querySelectorAll("[data-parallax]")
  );
  if (!parallaxItems.length) {
    return;
  }

  let ticking = false;

  const updateParallax = () => {
    const viewportHeight = window.innerHeight;
    parallaxItems.forEach((item) => {
      const speed = parseFloat(item.dataset.parallax || "0");
      const rect = item.getBoundingClientRect();
      const offset = (rect.top - viewportHeight / 2) * speed;
      item.style.setProperty("--parallax-offset", `${offset}px`);
    });
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  updateParallax();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateParallax);
});
