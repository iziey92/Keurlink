/* ================================
   KEURLINK - PREMIUM ANIMATIONS.JS
   ================================ */

document.addEventListener("DOMContentLoaded", () => {
  // 1. CURSEUR PERSONNALISÉ (Amélioré)
  // ---------------------------------
  const dot = document.querySelector(".cursor-dot");
  const outline = document.querySelector(".cursor-outline");

  // Vérification si on est sur mobile (pas de curseur custom)
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice && dot && outline) {
    dot.style.display = "none";
    outline.style.display = "none";
    document.body.style.cursor = "auto";
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;

  // Utilisation de requestAnimationFrame pour la fluidité
  function animateCursor() {
    // Effet de retard (lerp) pour l'outline
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;

    if (dot) {
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
    }
    if (outline) {
      outline.style.left = outlineX + "px";
      outline.style.top = outlineY + "px";
    }

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Effet Hover sur éléments interactifs
  const hoverElements = document.querySelectorAll(
    "a, button, .btn, .mosaic-card, .feature, [data-magnetic]",
  );

  hoverElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      if (outline) outline.classList.add("hover");
      if (dot) dot.classList.add("hover"); // On peut styliser le point aussi
    });
    el.addEventListener("mouseleave", () => {
      if (outline) outline.classList.remove("hover");
      if (dot) dot.classList.remove("hover");
    });
  });

  // Effet Click (Ripple Animation)
  window.addEventListener("mousedown", () => {
    if (dot) dot.classList.add("click");
  });
  window.addEventListener("mouseup", () => {
    if (dot) dot.classList.remove("click");
  });

  // Création d'onde (Ripple) au clic
  document.querySelectorAll(".btn-primary, .btn-secondary").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple-effect";

      // Position de l'onde
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";

      this.appendChild(ripple);

      // Nettoyage après animation
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // 2. EFFET MAGNÉTIQUE (Boutons & Logo)
  // ----------------------------------
  const magneticElements = document.querySelectorAll("[data-magnetic]");

  magneticElements.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Force d'attraction (ajustable)
      const strength = 0.4;

      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0, 0)";
    });
  });

  // 3. TILT 3D PREMIUM (Mosaic & Features)
  // --------------------------------------
  const tiltCards = document.querySelectorAll(".mosaic-card, [data-tilt]");

  tiltCards.forEach((card) => {
    // Ajout dynamique de l'overlay de lumière (glare)
    const glareOverlay = document.createElement("div");
    glareOverlay.classList.add("tilt-glare");
    card.style.position = "relative";
    card.style.overflow = "hidden";
    card.appendChild(glareOverlay);

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calcul de la rotation
      const rotateX = (y - centerY) / 10; // Ajuste la sensibilité ici
      const rotateY = (centerX - x) / 10;

      // Calcul de la position du reflet (glare)
      const glareAngle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      // Application du style
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;

      // Déplacement du reflet
      glareOverlay.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15) 0%, transparent 50%)`;
      glareOverlay.style.opacity = "1";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)";
      card.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
      glareOverlay.style.opacity = "0";
    });

    // Reset transition on mouse enter pour la réactivité
    card.addEventListener("mouseenter", () => {
      card.style.transition = "transform 0.1s ease-out";
    });
  });

  // 4. SCROLL REVEAL (Intersection Observer)
  // ----------------------------------------
  const revealElements = document.querySelectorAll(
    ".reveal, .feature, .mosaic-card",
  );

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          // Optionnel : arrêter d'observer après révélation
          // observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  revealElements.forEach((el) => {
    // On ajoute la classe de base pour l'état caché
    if (!el.classList.contains("revealed")) {
      el.style.opacity = "0";
      el.style.transform = "translateY(40px)";
      el.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";

      // Gestion des délais (stagger) pour les features
      if (el.classList.contains("feature")) {
        const index = Array.from(document.querySelectorAll(".feature")).indexOf(
          el,
        );
        el.style.transitionDelay = `${index * 100}ms`;
      }
    }
    revealObserver.observe(el);
  });

  // Fonction pour mettre à jour le style quand révélé
  // (On peut le faire via CSS, mais voici une approche JS pure si besoin)
  const observerConfig = { attributes: false, subtree: false };
  revealElements.forEach((el) => {
    const obs = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.classList.contains("revealed")) {
          mutation.target.style.opacity = "1";
          mutation.target.style.transform = "translateY(0)";
        }
      });
    });
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
  });

  // 5. HEADER SCROLL EFFECT
  // -----------------------
  const header = document.querySelector("header");
  let lastScrollTop = 0;

  window.addEventListener(
    "scroll",
    () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }

      lastScrollTop = scrollTop;
    },
    { passive: true },
  );

  // 6. ACTIVE NAV LINK
  // ------------------
  // highlight current page link in the header nav
  const currentPage = location.pathname.split("/").pop();
  document.querySelectorAll("nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || href === "" + location.href) {
      link.classList.add("active");
    }
  });

  // 7. PARALLAXE SUBTIL SUR ORBES (Background)
  // -----------------------------------------
  const orbs = document.querySelectorAll(".bg-orb");

  window.addEventListener("mousemove", (e) => {
    const x = (window.innerWidth / 2 - e.clientX) / 50; // Sensibilité
    const y = (window.innerHeight / 2 - e.clientY) / 50;

    orbs.forEach((orb, index) => {
      const speed = (index + 1) * 0.5; // Vitesses différentes
      orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  });
});

// CSS dynamique injecté pour le tilt-glare (pour éviter de toucher au fichier CSS)
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  .tilt-glare {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: transparent;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 2;
    mix-blend-mode: overlay;
  }
  .ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
  }
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  /* Désactivation sur mobile */
  @media (max-width: 768px) {
    .cursor-dot, .cursor-outline { display: none !important; }
    body { cursor: auto !important; }
  }
`;
document.head.appendChild(styleSheet);
