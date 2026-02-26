function splitTextElement(el, options = {}) {
  if (!el || el.dataset.splitReady === "true") return;

  const originalText = el.textContent.trim();
  if (!originalText) return;

  const staggerMs = options.staggerMs ?? 40;
  el.textContent = "";

  [...originalText].forEach((char, index) => {
    const span = document.createElement("span");
    span.className = "split-char";
    span.style.setProperty("--i", String(index));
    span.style.animationDelay = `${index * staggerMs}ms`;
    span.textContent = char === " " ? "\u00A0" : char;
    el.appendChild(span);
  });

  el.dataset.splitReady = "true";
}

function replaySplitAnimation(el, staggerMs = 34) {
  const chars = el.querySelectorAll(".split-char");

  chars.forEach((charEl) => {
    charEl.style.animation = "none";
  });

  void el.offsetWidth;

  chars.forEach((charEl, index) => {
    charEl.style.animation = "";
    charEl.style.animationDelay = `${index * staggerMs}ms`;
  });
}

function initSplitText(selector) {
  document.querySelectorAll(selector).forEach((el) => {
    splitTextElement(el);
    el.addEventListener("mouseenter", () => replaySplitAnimation(el));
  });
}

function initScrollReveal(selector) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  elements.forEach((el, index) => {
    const delay = (index % 4) * 90;
    el.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  elements.forEach((el) => observer.observe(el));
}

function initStickyHeader() {
  const header = document.querySelector(".header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 18);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initHamburgerMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");

  if (!hamburger || !navLinks) return;

  const closeMenu = () => {
    hamburger.classList.remove("is-active");
    navLinks.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  const openMenu = () => {
    hamburger.classList.add("is-active");
    navLinks.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.contains("is-open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navItems.forEach((item) => {
    item.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 840) {
      closeMenu();
    }
  });
}

function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      const headerHeight = document.querySelector(".header")?.offsetHeight ?? 0;
      const targetY = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;

      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initSplitText(".split-text");
  initScrollReveal(".reveal-on-scroll");
  initStickyHeader();
  initHamburgerMenu();
  initSmoothScroll();
});
