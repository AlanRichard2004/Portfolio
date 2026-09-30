/* EDIT ME: paste your links here. Anything left empty stays hidden. */
const LINKS = {
  linkedin: "",   // e.g. "https://www.linkedin.com/in/your-name"
  github: "",     // e.g. "https://github.com/your-name"
  resume: "",     // e.g. "Alan-Richard-M-Resume.pdf" (put the file next to index.html)
  projects: ["", "", "", ""]  // repo links for Issues #1 to #4, in order
};

const R = document.documentElement;
const calm = matchMedia("(prefers-reduced-motion:reduce)").matches;
const $ = (s, e = document) => [...e.querySelectorAll(s)];
if (!calm) R.classList.add("js");

/* one observer reveals sections; each element is released after it fires */
$(".flow").forEach(f => $("li", f).forEach((li, k) => li.style.setProperty("--i", k)));
$(".chips").forEach(c => $("li", c).forEach((li, k) => li.style.setProperty("--i", k)));
if (!calm) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    io.unobserve(e.target);
  }), { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  $(".page > h2, .rv").forEach(el => { el.classList.add("rv"); io.observe(el); });
  setTimeout(go, 3000);
}

/* pause infinite animations when off-screen or tab hidden */
const pause = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle("off", !e.isIntersecting)));
$(".live").forEach(el => pause.observe(el));
document.addEventListener("visibilitychange", () => R.classList.toggle("hid", document.hidden));

/* single rAF loop for scroll-linked motion: read first, then write transforms only */
const bar = Object.assign(document.createElement("div"), { className: "bar" });
document.body.append(bar);
const cityEl = document.getElementById("city");
const needle = document.getElementById("needle"), route = $(".route")[0];
let queued = false, spin = 0;
function frame() {
  queued = false;
  const max = R.scrollHeight - innerHeight, p = max > 0 ? scrollY / max : 0;
  const r = route.getBoundingClientRect();
  const q = Math.min(1, Math.max(0, (innerHeight * 0.7 - r.top) / r.height));
  const target = p * 720;
  spin = calm ? target : spin + (target - spin) * 0.15;
  bar.style.transform = `scaleX(${p})`;
  needle.style.transform = `rotate(${spin}deg)`;
  route.style.setProperty("--p", q);
  R.classList.toggle("stuck", scrollY > 90);
  if (cityEl && scrollY < innerHeight * 1.2) cityEl.style.transform = `translateY(${scrollY * 0.2}px)`;
  if (Math.abs(target - spin) > 0.2) queue();
}
function queue() { if (!queued) { queued = true; requestAnimationFrame(frame); } }
addEventListener("scroll", queue, { passive: true });
addEventListener("resize", queue);
queue();
document.getElementById("compass").onclick = () => scrollTo({ top: 0 });

/* sample terminal output, typed once when visible */
const log = [
  "203.0.113.7 POST /login 401", "203.0.113.7 POST /login 401", "203.0.113.7 POST /login 401",
  "[ALERT] Brute force: 3 failed logins in 4s from 203.0.113.7",
  "198.51.100.9 GET /search?q=' OR 1=1-- 200", "[ALERT] SQL injection payload from 198.51.100.9",
  "192.0.2.15 GET /../../etc/passwd 403", "[ALERT] Directory traversal from 192.0.2.15",
  "Report saved. 3 threats flagged."
];
const term = document.getElementById("term");
const tio = new IntersectionObserver(es => {
  if (!es[0].isIntersecting) return;
  tio.disconnect();
  let k = 0;
  (function next() {
    if (k >= log.length) return;
    const l = log[k++], d = document.createElement("div");
    d.textContent = l;
    if (l.startsWith("[ALERT]")) d.className = "al";
    term.append(d);
    setTimeout(next, calm ? 0 : l.startsWith("[ALERT]") ? 800 : 400);
  })();
}, { threshold: 0.4 });
tio.observe(term);

/* spider web paths, generated once */
const P = (r, a) => `${(100 + r * Math.cos(a)).toFixed(1)} ${(100 + r * Math.sin(a)).toFixed(1)}`;
const N = 8, T = Math.PI * 2 / N;
let d = "";
for (let i = 0; i < N; i++) d += `M100 100L${P(100, i * T)}`;
[0.28, 0.5, 0.72, 1].forEach(r => { for (let i = 0; i < N; i++) d += `M${P(r * 100, i * T)}Q${P(r * 84, (i + 0.5) * T)} ${P(r * 100, (i + 1) * T)}`; });
$(".web path").forEach(p => p.setAttribute("d", d));

/* intro: auto-ends, can be skipped */
const intro = document.getElementById("intro");
function go() { intro.remove(); R.classList.add("go"); }
document.getElementById("skip").onclick = go;

/* night city skyline, generated once */
{
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const layer = (fill, lo, hi, lit) => {
    let x = 0, s = "";
    while (x < 1200) {
      const w = 45 + rnd() * 60 | 0, h = lo + rnd() * (hi - lo) | 0;
      s += `<rect x="${x}" y="${220 - h}" width="${w}" height="${h}" fill="${fill}"/>`;
      if (lit) for (let wy = 232 - h; wy < 210; wy += 18) for (let wx = x + 8; wx < x + w - 10; wx += 14)
        if (rnd() < 0.28) s += `<rect x="${wx}" y="${wy}" width="6" height="8" fill="#ffd23f" opacity=".85"${rnd() < 0.07 ? ` class="tw" style="animation-delay:${(rnd() * 3).toFixed(1)}s"` : ""}/>`;
      x += w + (rnd() * 6 | 0);
    }
    return s;
  };
  document.getElementById("city").innerHTML = layer("#0f1f6e", 80, 190, false) + layer("#070f33", 40, 150, true);
}

/* comic cover tilt: pointer position is batched into one rAF per card */
$(".cover").forEach(c => {
  let f = 0, ev;
  c.addEventListener("pointermove", e => {
    ev = e;
    if (f) return;
    f = requestAnimationFrame(() => {
      f = 0;
      const r = c.getBoundingClientRect();
      c.style.setProperty("--ry", ((ev.clientX - r.left) / r.width - 0.5) * 14 + "deg");
      c.style.setProperty("--rx", -((ev.clientY - r.top) / r.height - 0.5) * 14 + "deg");
    });
  });
  c.addEventListener("pointerleave", () => { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); });
});

/* looping SFX ticker */
const tk = document.querySelector(".ticker div");
tk.innerHTML += tk.innerHTML;

/* count-up highlights */
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.n, t0 = performance.now();
  cio.unobserve(el);
  (function f(t) {
    const p = Math.min((t - t0) / 1200, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(f);
  })(t0);
}));
if (!calm) $("[data-n]").forEach(el => { el.textContent = 0; cio.observe(el); });

/* nav highlights the section in view */
const links = new Map($(".top a").map(a => [a.getAttribute("href").slice(1), a]));
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  links.forEach(a => a.removeAttribute("aria-current"));
  const a = links.get(e.target.id);
  if (a) a.setAttribute("aria-current", "true");
}), { rootMargin: "-45% 0px -50% 0px" });
$("main .page[id]").forEach(s => spy.observe(s));

/* contact helpers */
const copy = document.getElementById("copy");
copy.onclick = async () => {
  try { await navigator.clipboard.writeText("m.alanrichard7639@gmail.com"); copy.textContent = "Copied!"; }
  catch { copy.textContent = "Copy it from above"; }
  setTimeout(() => { copy.textContent = "Copy email"; }, 1800);
};
document.getElementById("pdf").onclick = () => print();

/* interactive log hunter: real regex checks, runs locally */
const sample = [
  '203.0.113.7 - "POST /login" 401', '203.0.113.7 - "POST /login" 401', '203.0.113.7 - "POST /login" 401',
  '198.51.100.4 - "GET /index.html" 200', `198.51.100.9 - "GET /search?q=' OR 1=1--" 200`, '192.0.2.15 - "GET /../../etc/passwd" 403'
].join("\n");
const logs = document.getElementById("logs"), found = document.getElementById("found");
const rules = [
  ["SQL injection", /('|%27)\s*(or|and)\s*('|%27)?\d+('|%27)?\s*=\s*('|%27)?\d+|union(\s|\+|%20)+select|;\s*drop\s+table/i],
  ["Directory traversal", /(\.\.\/|\.\.\\|%2e%2e(%2f|\/))/i]
];
function show(items) {
  found.replaceChildren(...items.map(([cls, title, text]) => {
    const li = document.createElement("li"), b = document.createElement("b"), c = document.createElement("code");
    li.className = cls; b.textContent = title; c.textContent = text;
    li.append(b, " ", c);
    return li;
  }));
}
function scan() {
  const out = [], fails = {};
  logs.value.split("\n").forEach((line, i) => {
    if (!line.trim()) return;
    const ip = (line.match(/^\S+/) || [""])[0];
    rules.forEach(([name, re]) => { if (re.test(line)) out.push(["", name, `line ${i + 1}: ${line}`]); });
    if (/\/login/i.test(line) && /\s(401|403)\s*$/.test(line)) (fails[ip] = fails[ip] || []).push(i + 1);
  });
  Object.entries(fails).forEach(([ip, ls]) => { if (ls.length >= 3) out.push(["", "Brute force", `${ls.length} failed logins from ${ip} (lines ${ls.join(", ")})`]); });
  show(out.length ? out : [["ok", "All clear", "No suspicious patterns found."]]);
}
logs.value = sample;
document.getElementById("scan").onclick = scan;
document.getElementById("reset").onclick = () => { logs.value = sample; found.replaceChildren(); };

/* apply the links from LINKS above */
[["li", "linkedin"], ["gh", "github"], ["cv", "resume"]].forEach(([id, k]) => {
  const a = document.getElementById(id);
  if (LINKS[k]) { a.href = LINKS[k]; a.hidden = false; }
});
$(".cover").forEach((c, i) => {
  if (!LINKS.projects[i]) return;
  const a = Object.assign(document.createElement("a"), { className: "btn", href: LINKS.projects[i], target: "_blank", rel: "noopener", textContent: "View code" });
  c.querySelector(".body").append(a);
});
