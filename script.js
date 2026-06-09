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

// Initialise EmailJS once the SDK loads
(function initEmailJS() {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
  script.onload = () => emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  document.head.appendChild(script);
})();


/* ══════════════════════════════════════════════
   1. THREE.JS 3D HERO BACKGROUND
   ══════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById("bg-canvas");
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
  const c1    = new THREE.Color("#6366f1");
  const c2    = new THREE.Color("#60a5fa");
  const c3    = new THREE.Color("#a855f7");

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
  const mat = new THREE.PointsMaterial({ size: 0.36, vertexColors: true, transparent: true, opacity: 0.75 });
  scene.add(new THREE.Points(geo, mat));

  // — Wireframe torus —
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(12, 3, 18, 90),
    new THREE.MeshStandardMaterial({ color: "#6366f1", wireframe: true, transparent: true, opacity: 0.2 })
  );
  scene.add(torus);

  // — Wireframe icosahedron —
  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(6, 1),
    new THREE.MeshStandardMaterial({ color: "#a855f7", wireframe: true, transparent: true, opacity: 0.26 })
  );
  ico.position.set(20, 6, -12);
  scene.add(ico);

  // — Floating sphere —
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(3, 24, 24),
    new THREE.MeshStandardMaterial({ color: "#60a5fa", wireframe: true, transparent: true, opacity: 0.28 })
  );
  sphere.position.set(-22, -8, -8);
  scene.add(sphere);

  // — Extra: small rotating octahedron —
  const octa = new THREE.Mesh(
    new THREE.OctahedronGeometry(4, 0),
    new THREE.MeshStandardMaterial({ color: "#34d399", wireframe: true, transparent: true, opacity: 0.22 })
  );
  octa.position.set(-18, 14, -6);
  scene.add(octa);

  // — Lights —
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const pLight = new THREE.PointLight("#6366f1", 2.5, 120);
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

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.004;

    scene.children[0].rotation.y = t * 0.07 + mx * 0.12;
    scene.children[0].rotation.x = my * 0.08;

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
   2. NAVBAR — scroll shrink + active link
   ══════════════════════════════════════════════ */
const navbar   = document.querySelector(".navbar");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  // shrink navbar on scroll
  navbar.style.padding = window.scrollY > 40 ? "0" : "";

  // highlight active nav link based on scroll position
  let current = "";
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle("active-nav", a.getAttribute("href") === `#${current}`);
  });
});

// smooth scroll on nav click
navLinks.forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.getElementById(this.getAttribute("href").substring(1));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});


/* ══════════════════════════════════════════════
   3. CONTACT FORM — EmailJS send
   ══════════════════════════════════════════════ */
const form       = document.getElementById("contact-form");
const submitBtn  = form.querySelector("button[type='submit']");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name    = document.getElementById("name").value.trim();
  const email   = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    showToast("Please fill in all fields.", "error");
    return;
  }

  // Loading state
  submitBtn.disabled    = true;
  submitBtn.textContent = "Sending…";

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name:    name,
      from_email:   email,
      message:      message,
      reply_to:     email,
    });

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


/* ══════════════════════════════════════════════
   4. TOAST NOTIFICATION
   ══════════════════════════════════════════════ */
function showToast(msg, type = "success") {
  // remove existing toast
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
                     ? "linear-gradient(135deg,rgba(52,211,153,0.18),rgba(52,211,153,0.08))"
                     : "linear-gradient(135deg,rgba(239,68,68,0.18),rgba(239,68,68,0.08))",
    border:        `1px solid ${type === "success" ? "rgba(52,211,153,0.35)" : "rgba(239,68,68,0.35)"}`,
    backdropFilter:"blur(14px)",
    color:         "#e8edf5",
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
  const word = words[wi];
  deleting ? ci-- : ci++;
  document.getElementById("typing").textContent = word.substring(0, ci);

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
   7. CURSOR GLOW
   ══════════════════════════════════════════════ */
const glow = document.querySelector(".cursor-glow");
document.addEventListener("mousemove", e => {
  glow.style.left = e.clientX + "px";
  glow.style.top  = e.clientY + "px";
});


/* ══════════════════════════════════════════════
   8. ACTIVE NAV LINK STYLE (injected once)
   ══════════════════════════════════════════════ */
const navStyle = document.createElement("style");
navStyle.textContent = `
  .nav-links a.active-nav {
    color: #e8edf5 !important;
  }
  .nav-links a.active-nav::after {
    width: 100% !important;
  }
`;
document.head.appendChild(navStyle);


/* ══════════════════════════════════════════════
   9. CARD TILT (subtle 3-D on hover)
   ══════════════════════════════════════════════ */
document.querySelectorAll(".cardx").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect  = card.getBoundingClientRect();
    const x     = (e.clientX - rect.left) / rect.width  - 0.5;
    const y     = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-8px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
    card.style.transition = "transform 0.5s cubic-bezier(0.22,1,0.36,1)";
  });
});


/* ══════════════════════════════════════════════
   10. STAT COUNTER ANIMATION
   ══════════════════════════════════════════════ */
function animateCounter(el, target, duration = 1400) {
  const isInfinity = el.textContent.trim() === "∞";
  if (isInfinity) return; // skip the infinity symbol

  let start     = null;
  const numTarget = parseFloat(target);
  const suffix    = target.replace(/[\d.]/g, ""); // e.g. "+" or "yrs"

  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(ease * numTarget) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Trigger counters when stats bar scrolls into view
const statsBar = document.querySelector(".stats-bar");
if (statsBar) {
  let counted = false;
  const statNums = statsBar.querySelectorAll(".stat-num");

  const statsObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      statNums.forEach(el => {
        const raw = el.textContent.trim(); // e.g. "4+"
        animateCounter(el, raw);
      });
    }
  }, { threshold: 0.5 });

  statsObs.observe(statsBar);
}
