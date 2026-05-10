const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
      }
    });
  },
  { threshold: 0.15 }
);

reveals.forEach((el) => revealObserver.observe(el));

const nav = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const mobileClose = mobileMenu.querySelector(".mobile-close");
let suppressNextToggle = false;
let pointerStartX = 0;
let pointerStartY = 0;
let lastScrollTime = 0;
let touchStartX = 0;
let touchStartY = 0;
let touchMoved = false;

const setMenuState = (isOpen) => {
  mobileMenu.classList.toggle("open", isOpen);
  hamburger.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
};

const closeMenu = () => {
  setMenuState(false);
};

hamburger.addEventListener("click", (event) => {
  event.stopPropagation();
  if (Date.now() - lastScrollTime < 250) {
    return;
  }
  if (suppressNextToggle) {
    suppressNextToggle = false;
    return;
  }
  const expanded = !mobileMenu.classList.contains("open");
  setMenuState(expanded);
});

hamburger.addEventListener("pointerdown", (event) => {
  pointerStartX = event.clientX;
  pointerStartY = event.clientY;
  suppressNextToggle = false;
});

hamburger.addEventListener("pointermove", (event) => {
  const deltaX = Math.abs(event.clientX - pointerStartX);
  const deltaY = Math.abs(event.clientY - pointerStartY);
  if (deltaX > 8 || deltaY > 8) {
    suppressNextToggle = true;
  }
});

hamburger.addEventListener("touchstart", (event) => {
  const touch = event.touches[0];
  if (!touch) return;
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  touchMoved = false;
});

hamburger.addEventListener("touchmove", (event) => {
  const touch = event.touches[0];
  if (!touch) return;
  const deltaX = Math.abs(touch.clientX - touchStartX);
  const deltaY = Math.abs(touch.clientY - touchStartY);
  if (deltaX > 8 || deltaY > 8) {
    touchMoved = true;
  }
});

hamburger.addEventListener("touchend", () => {
  if (touchMoved) {
    suppressNextToggle = true;
  }
});

mobileClose.addEventListener("click", closeMenu);

document.addEventListener("click", (event) => {
  if (mobileMenu.classList.contains("open") && !mobileMenu.contains(event.target)) {
    closeMenu();
  }
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

const sections = document.querySelectorAll("main section");
const navLinks = document.querySelectorAll(".nav-links a");

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === `#${id}`) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((section) => sectionObserver.observe(section));

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    link.classList.remove("click-pop");
    void link.offsetWidth;
    link.classList.add("click-pop");
  });
});

const wordColors = ["#ff6b35", "#2ec4b6", "#ff3366"];
const heroWords = document.querySelectorAll(".hero-title .word");
heroWords.forEach((word, index) => {
  setTimeout(() => {
    word.classList.add("word-in");
  }, index * 100);
  word.addEventListener("mouseenter", () => {
    const currentIndex = Number(word.dataset.colorIndex || "0");
    const nextIndex = (currentIndex + 1) % wordColors.length;
    word.dataset.colorIndex = String(nextIndex);
    word.style.color = wordColors[nextIndex];
  });
  word.addEventListener("mouseleave", () => {
    word.style.color = "";
  });
});

const stats = document.querySelectorAll(".stat-card h3");
const easeOutQuad = (t) => t * (2 - t);

const animateCount = (el) => {
  const target = Number(el.dataset.target || "0");
  const suffix = el.dataset.suffix || "";
  const duration = 1500;
  let start = null;

  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const value = Math.floor(easeOutQuad(progress) * target);
    el.textContent = `${value}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = `${target}${suffix}`;
    }
  };

  requestAnimationFrame(step);
};

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (!el.dataset.animated) {
          el.dataset.animated = "true";
          animateCount(el);
        }
      }
    });
  },
  { threshold: 0.4 }
);

stats.forEach((stat) => statsObserver.observe(stat));

const sectionLabels = document.querySelectorAll(".section-label");
sectionLabels.forEach((label) => {
  const text = label.dataset.text || label.textContent.trim();
  label.dataset.text = text;
  label.textContent = "";
});

const typeLabel = (label) => {
  if (label.dataset.typed === "true") return;
  const text = label.dataset.text || "";
  let index = 0;
  label.dataset.typed = "true";
  const interval = setInterval(() => {
    label.textContent += text[index];
    index += 1;
    if (index >= text.length) {
      clearInterval(interval);
    }
  }, 50);
};

const labelObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        typeLabel(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

sectionLabels.forEach((label) => labelObserver.observe(label));

const ctaChars = document.querySelectorAll(".cta-title .char");
ctaChars.forEach((char) => {
  if (char.classList.contains("space")) return;
  char.addEventListener("mouseenter", () => {
    const currentIndex = Number(char.dataset.colorIndex || "0");
    const nextIndex = (currentIndex + 1) % wordColors.length;
    char.dataset.colorIndex = String(nextIndex);
    char.style.transform = "translateY(-10px)";
    char.style.color = wordColors[nextIndex];
  });
  char.addEventListener("mouseleave", () => {
    char.style.transform = "";
    char.style.color = "";
  });
});

const progressBar = document.getElementById("scroll-progress");
const updateProgress = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
};

window.addEventListener("scroll", updateProgress);
window.addEventListener("resize", updateProgress);
updateProgress();

window.addEventListener("scroll", () => {
  lastScrollTime = Date.now();
  if (mobileMenu.classList.contains("open")) {
    closeMenu();
  }
});

const cursorDot = document.createElement("div");
cursorDot.id = "cursor-dot";
const cursorRing = document.createElement("div");
cursorRing.id = "cursor-ring";
document.body.appendChild(cursorDot);
document.body.appendChild(cursorRing);

let lastRippleTime = 0;
let rippleIndex = 0;
const rippleColors = ["#ff6b35", "#2ec4b6", "#ff3366"];

document.addEventListener("mousemove", (event) => {
  const { clientX, clientY } = event;
  cursorDot.style.left = `${clientX - 6}px`;
  cursorDot.style.top = `${clientY - 6}px`;
  cursorRing.style.left = `${clientX - 20}px`;
  cursorRing.style.top = `${clientY - 20}px`;

  const now = Date.now();
  if (now - lastRippleTime >= 80) {
    lastRippleTime = now;
    const ripple = document.createElement("div");
    ripple.className = "cursor-ripple";
    ripple.style.left = `${clientX - 3}px`;
    ripple.style.top = `${clientY - 3}px`;
    ripple.style.background = rippleColors[rippleIndex % rippleColors.length];
    ripple.style.opacity = "1";
    ripple.style.transform = "scale(1)";
    ripple.style.transition = "transform 0.6s ease, opacity 0.6s ease";
    document.body.appendChild(ripple);
    requestAnimationFrame(() => {
      ripple.style.transform = "scale(8)";
      ripple.style.opacity = "0";
    });
    setTimeout(() => ripple.remove(), 650);
    rippleIndex += 1;
  }
});

document.addEventListener("mousedown", () => {
  document.body.classList.add("cursor-down");
});

document.addEventListener("mouseup", () => {
  document.body.classList.remove("cursor-down");
});

const hoverTargets = document.querySelectorAll(
  "a, button, .card, .nav-link, .skill-badge, .timeline-card, .project-card, .social-btn, .step-number"
);
let hoverCount = 0;

hoverTargets.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    hoverCount += 1;
    document.body.classList.add("hovering");
  });
  el.addEventListener("mouseleave", () => {
    hoverCount = Math.max(0, hoverCount - 1);
    if (hoverCount === 0) {
      document.body.classList.remove("hovering");
    }
  });
});

const skillBadges = document.querySelectorAll(".skill-badge");
skillBadges.forEach((badge) => {
  badge.addEventListener("click", () => {
    badge.classList.remove("rotate");
    void badge.offsetWidth;
    badge.classList.add("rotate");
  });
});

const whatsappButton = document.querySelector(".whatsapp-float");
if (whatsappButton) {
  setInterval(() => {
    whatsappButton.classList.add("attention");
    setTimeout(() => whatsappButton.classList.remove("attention"), 500);
  }, 5000);
}
