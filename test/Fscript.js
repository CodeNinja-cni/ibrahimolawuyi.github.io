console.log("Ibrahim.dev loaded 🚀");

/* ══════════════════════════════════════════════
   0. EMAILJS CONFIG
   ─ Sign up at https://emailjs.com (free)
   ─ Create a service, email template, then
     replace the three strings below with your
     real IDs from the EmailJS dashboard.
   ══════════════════════════════════════════════ */
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";     // Account → API Keys
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";     // Email Services → Service ID
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";    // Email Templates → Template ID

document.addEventListener("DOMContentLoaded", () => {
  if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
});


/* ══════════════════════════════════════════════
   1. THREE.JS 3D HERO BACKGROUND
   Palette: deep navy-indigo (#0A0E27) base, with
   indigo (#6366F1), purple (#8B5CF6), and sky
   blue (#38BDF8) particles + wireframes
   ══════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.z = 50;

  // — Particle field —
  const count = 2200;
  const pos   = new Float32Array(count * 3);
  const col   = new Float32Array(count * 3);
  const c1    = new THREE.Color("#6366F1");
  const c2    = new THREE.Color("#8B5CF6");
  const c3    = new THREE.Color("#38BDF8");

  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 140;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 140;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 140;
    const t   = Math.random();
    const mix = t < 0.5 ? c1.clone().lerp(c2, t * 2) : c2.clone().lerp(c3, (t - 0.5) * 2);
    col[i * 3] = mix.r; col[i * 3 + 1] = mix.g; col[i * 3 + 2] = mix.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color",    new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({ size: 0.36, vertexColors: true, transparent: true, opacity: 0.8 });
  scene.add(new THREE.Points(geo, mat));

  // — Wireframe torus —
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(12, 3, 18, 90),
    new THREE.MeshStandardMaterial({ color: "#8B5CF6", wireframe: true, transparent: true, opacity: 0.24 })
  );
  scene.add(torus);

  // — Wireframe icosahedron —
  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(6, 1),
    new THREE.MeshStandardMaterial({ color: "#38BDF8", wireframe: true, transparent: true, opacity: 0.28 })
  );
  ico.position.set(20, 6, -12);
  scene.add(ico);

  // — Floating sphere —
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(3, 24, 24),
    new THREE.MeshStandardMaterial({ color: "#6366F1", wireframe: true, transparent: true, opacity: 0.3 })
  );
  sphere.position.set(-22, -8, -8);
  scene.add(sphere);

  // — Extra: small rotating octahedron —
  const octa = new THREE.Mesh(
    new THREE.OctahedronGeometry(4, 0),
    new THREE.MeshStandardMaterial({ color: "#22D3A5", wireframe: true, transparent: true, opacity: 0.26 })
  );
  octa.position.set(-18, 14, -6);
  scene.add(octa);

  // — Lights —
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const pLight = new THREE.PointLight("#6366F1", 2.2, 120);
  pLight.position.set(15, 15, 15);
  scene.add(pLight);

  // — Mouse parallax —
  let mx = 0, my = 0;
  document.addEventListener("mousemove", e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const particles = scene.children[0];
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.004;

    particles.rotation.y = t * 0.07 + mx * 0.12;
    particles.rotation.x = my * 0.08;

    torus.rotation.x = t * 0.35;
    torus.rotation.y = t * 0.2;
    torus.position.x = Math.sin(t * 0.4) * 5;

    ico.rotation.y   = t * 0.55;
    ico.rotation.x   = t * 0.25;
    ico.position.y   = Math.sin(t * 0.6) * 3 + 6;

    sphere.rotation.y = t * 0.8;
    sphere.position.y = Math.cos(t * 0.5) * 3 - 8;

    octa.rotation.x = t * 0.4;
    octa.rotation.z = t * 0.3;
    octa.position.x = Math.sin(t * 0.35) * 4 - 18;

    camera.position.x += (mx * 6 - camera.position.x) * 0.04;
    camera.position.y += (my * 4 - camera.position.y) * 0.04;

    renderer.render(scene, camera);
  }
  animate();
})();


/* ══════════════════════════════════════════════
   2. FLOATING NAVBAR — shrink on scroll + active link
   ══════════════════════════════════════════════ */
const navbar   = document.querySelector(".navbar");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

function updateNavOnScroll() {
  navbar.classList.toggle("scrolled", window.scrollY > 40);

  let current = "";
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle("active-nav", a.getAttribute("href") === `#${current}`);
  });
}
window.addEventListener("scroll", updateNavOnScroll, { passive: true });
updateNavOnScroll();

// smooth scroll on nav click
navLinks.forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.getElementById(this.getAttribute("href").substring(1));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// mobile dropdown toggle
(function setupMobileNav() {
  const toggle    = document.getElementById("nav-toggle");
  const navLinksEl = document.getElementById("nav-links");
  if (!toggle || !navLinksEl) return;

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = navLinksEl.classList.toggle("active");
    toggle.classList.toggle("active", isOpen);
    toggle.setAttribute("aria-expanded", isOpen);
  });

  document.addEventListener("click", () => {
    navLinksEl.classList.remove("active");
    toggle.classList.remove("active");
    toggle.setAttribute("aria-expanded", false);
  });

  navLinksEl.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinksEl.classList.remove("active");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", false);
    });
  });
})();


/* ══════════════════════════════════════════════
   3. CONTACT FORM — EmailJS send
   ══════════════════════════════════════════════ */
const form      = document.getElementById("contact-form");
const submitBtn = form ? form.querySelector("button[type='submit']") : null;

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name    = document.getElementById("name").value.trim();
    const email   = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      showToast("Please fill in all fields.", "error");
      return;
    }

    if (!window.emailjs || EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID") {
      showToast("Form isn't connected yet — email me directly for now.", "error");
      return;
    }

    submitBtn.disabled    = true;
    submitBtn.textContent = "Sending…";

    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
      showToast(`Message sent! I'll get back to you soon, ${name} 🚀`, "success");
      form.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      showToast("Oops — something went wrong. Try emailing me directly.", "error");
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = "Send Message";
    }
  });
}


/* ══════════════════════════════════════════════
   4. TOAST NOTIFICATION
   ══════════════════════════════════════════════ */
function showToast(msg, type = "success") {
  document.querySelectorAll(".toast-notif").forEach(t => t.remove());

  const toast = document.createElement("div");
  toast.className = "toast-notif";
  toast.innerHTML = `
    <span class="toast-icon">${type === "success" ? "✅" : "❌"}</span>
    <span class="toast-msg">${msg}</span>
  `;

  Object.assign(toast.style, {
    position:      "fixed",
    bottom:        "28px",
    right:         "28px",
    zIndex:        "99999",
    display:       "flex",
    alignItems:    "center",
    gap:           "10px",
    padding:       "14px 22px",
    borderRadius:  "14px",
    background:    type === "success"
                     ? "linear-gradient(135deg,rgba(34,211,165,0.22),rgba(34,211,165,0.08))"
                     : "linear-gradient(135deg,rgba(239,68,68,0.18),rgba(239,68,68,0.08))",
    border:        `1px solid ${type === "success" ? "rgba(34,211,165,0.45)" : "rgba(239,68,68,0.35)"}`,
    backdropFilter:"blur(14px)",
    color:         "#EDEFF7",
    fontFamily:    "'DM Sans', sans-serif",
    fontSize:      "0.9rem",
    fontWeight:    "500",
    boxShadow:     "0 8px 32px rgba(0,0,0,0.4)",
    transform:     "translateY(20px)",
    opacity:       "0",
    transition:    "all 0.4s cubic-bezier(0.22,1,0.36,1)",
    maxWidth:      "360px",
    lineHeight:    "1.45",
  });

  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.transform = "translateY(0)";
    toast.style.opacity   = "1";
  });

  setTimeout(() => {
    toast.style.transform = "translateY(20px)";
    toast.style.opacity   = "0";
    toast.addEventListener("transitionend", () => toast.remove());
  }, 5000);
}


/* ══════════════════════════════════════════════
   5. SCROLL REVEAL
   ══════════════════════════════════════════════ */
const revealEls = document.querySelectorAll(".reveal");

function checkReveal() {
  revealEls.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 80) {
      el.classList.add("active");
    }
  });
}
window.addEventListener("scroll", checkReveal, { passive: true });
checkReveal();


/* ══════════════════════════════════════════════
   6. TYPING EFFECT
   ══════════════════════════════════════════════ */
const words = ["I build websites.", "I design experiences.", "I write clean code.", "I solve problems."];
let wi = 0, ci = 0, deleting = false;

function type() {
  const typingEl = document.getElementById("typing");
  if (!typingEl) return;
  const word = words[wi];
  deleting ? ci-- : ci++;
  typingEl.textContent = word.substring(0, ci);

  if (!deleting && ci === word.length) {
    deleting = true;
    setTimeout(type, 1200);
    return;
  }
  if (deleting && ci === 0) {
    deleting = false;
    wi = (wi + 1) % words.length;
  }
  setTimeout(type, deleting ? 45 : 90);
}
type();


/* ══════════════════════════════════════════════
   7. CURSOR GLOW (desktop / hover-capable only)
   ══════════════════════════════════════════════ */
const glow = document.querySelector(".cursor-glow");
if (glow && window.matchMedia("(hover: hover)").matches) {
  document.addEventListener("mousemove", e => {
    glow.style.left = e.clientX + "px";
    glow.style.top  = e.clientY + "px";
  });
}


/* ══════════════════════════════════════════════
   8. CARD TILT (subtle 3-D on hover)
   ══════════════════════════════════════════════ */
if (window.matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".cardx").forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.transition = "transform 0.5s cubic-bezier(0.22,1,0.36,1)";
    });
    card.addEventListener("mouseenter", () => {
      card.style.transition = "none";
    });
  });
}


/* ══════════════════════════════════════════════
   10. SKILLS PROFICIENCY — animated bars + counters
   ══════════════════════════════════════════════ */
(function setupProficiency() {
  const block = document.querySelector(".proficiency-block");
  if (!block) return;

  const items = block.querySelectorAll(".prof-item");
  let triggered = false;

  function runAnimation() {
    items.forEach((item, i) => {
      const fill = item.querySelector(".prof-fill");
      const pct  = item.querySelector(".prof-pct");
      const target = parseInt(fill.dataset.fill, 10);

      setTimeout(() => {
        fill.style.width = target + "%";

        const duration = 1300;
        const start = performance.now();
        function step(ts) {
          const progress = Math.min((ts - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          pct.textContent = Math.round(ease * target) + "%";
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }, i * 140);
    });
  }

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !triggered) {
      triggered = true;
      runAnimation();
    }
  }, { threshold: 0.35 });

  obs.observe(block);
})();


/* ══════════════════════════════════════════════
   11. STAT COUNTER ANIMATION
   ══════════════════════════════════════════════ */
function animateCounter(el, target, duration = 1400) {
  const isInfinity = el.textContent.trim() === "∞";
  if (isInfinity) return;

  let start       = null;
  const numTarget = parseFloat(target);
  const suffix    = target.replace(/[\d.]/g, "");

  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * numTarget) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsBar = document.querySelector(".stats-bar");
if (statsBar) {
  let counted = false;
  const statNums = statsBar.querySelectorAll(".stat-num");

  const statsObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      statNums.forEach(el => {
        const raw = el.textContent.trim();
        animateCounter(el, raw);
      });
    }
  }, { threshold: 0.5 });

  statsObs.observe(statsBar);
}
