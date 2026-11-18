/* תפריט נגישות של האתר.
   נטען בראש כל עמוד (לא defer): מחיל מיד את ההגדרות השמורות, כדי שלא יהיה הבהוב,
   ובונה את הכפתור והתפריט כשהעמוד מוכן. ההגדרות נשמרות רק במכשיר של הגולש. */
(() => {
  const R = document.documentElement, KEY = "a11y";
  const STEPS = [1, 1.15, 1.3, 1.5];
  const TOG = ["contrast", "light", "gray", "links", "font", "space", "still", "cursor"];
  let S = {};
  try { S = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { S = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const apply = () => {
    TOG.forEach(k => R.classList.toggle("a11y-" + k, !!S[k]));
    const z = STEPS[S.zoom | 0] || 1;
    R.style.setProperty("--a11y-zoom", String(z));
    R.classList.toggle("a11y-zoom", z !== 1);
  };

  const CUR = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24'%3E%3Cpath d='M5 2.5l13.5 10.2-6 .9 3.6 7-2.9 1.5-3.6-7.1L5 19.5z' fill='%23000' stroke='%23fff' stroke-width='1.4' stroke-linejoin='round'/%3E%3C/svg%3E\") 6 3, auto";
  const css = `
html.a11y-zoom body>*:not(.a11y-ui){zoom:var(--a11y-zoom)}
@media (max-width:600px){html.a11y-zoom body>header.top{zoom:1}html.a11y-zoom .hero h1{zoom:calc(1 / var(--a11y-zoom))}html.a11y-zoom .cta-row .btn{white-space:normal;text-align:center}}
html.a11y-contrast{--bg:#000;--paper:#000;--ink:#fff;--ink-soft:#fff;--soft:#fff;--line:#fff;--accent:#FFE45C;--on-light:#000}
html.a11y-contrast body{background:#000!important;color:#fff!important}
html.a11y-contrast body *{text-shadow:none!important}
html.a11y-contrast body a:not(.btn):not(.lang):not(.wa-float){text-decoration:underline!important}
html.a11y-light{filter:invert(1) hue-rotate(180deg)}
html.a11y-light img,html.a11y-light video,html.a11y-light .ig-top,html.a11y-light .btn-wa,html.a11y-light .wa-float{filter:invert(1) hue-rotate(180deg)}
html.a11y-gray{filter:grayscale(1)}
html.a11y-gray.a11y-light{filter:grayscale(1) invert(1)}
html.a11y-links body a{text-decoration:underline!important;text-underline-offset:3px;outline:2px dashed #FFE45C!important;outline-offset:2px}
html.a11y-font body,html.a11y-font body *:not(svg):not(svg *){font-family:Arial,"Arial Hebrew",Helvetica,sans-serif!important}
html.a11y-space body *:not(.hero h1 *):not(.hero h1):not(.a11y-ui *){letter-spacing:.08em!important;word-spacing:.16em!important}
html.a11y-space body p,html.a11y-space body li,html.a11y-space body dd,html.a11y-space body dt{line-height:1.9!important}
html.a11y-still *,html.a11y-still *::before,html.a11y-still *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
html.a11y-still .rv{opacity:1!important;transform:none!important}
html.a11y-still.js .hero h1 .w,html.a11y-still.js .hero h1 .win,html.a11y-still.js .hero .sub{opacity:1!important;transform:none!important}
html.a11y-cursor,html.a11y-cursor *{cursor:${CUR}!important}

.a11y-ui{--a-acc:var(--accent,#3DB9FF);--a-bg:#13141A;--a-ink:#F5F6FA;--a-soft:#B9BDCB;--a-line:#2E3240;font:400 16px/1.35 "Assistant","Arial Hebrew",Arial,sans-serif;color:var(--a-ink)}
html.a11y-contrast .a11y-ui{--a-bg:#000;--a-ink:#fff;--a-soft:#fff;--a-line:#fff}
.a11y-ui *{box-sizing:border-box}
#a11y-btn{position:fixed;z-index:40;bottom:calc(18px + env(safe-area-inset-bottom,0px));inset-inline-start:calc(18px + max(env(safe-area-inset-left,0px),env(safe-area-inset-right,0px)));width:54px;height:54px;border-radius:50%;border:0;cursor:pointer;display:grid;place-items:center;background:var(--a-acc);color:#08080B;box-shadow:0 0 0 3px #08080B,0 10px 30px -8px rgba(0,0,0,.8);-webkit-tap-highlight-color:transparent}
#a11y-btn svg{width:32px;height:32px}
#a11y-btn:focus-visible,.a11y-ui button:focus-visible,.a11y-ui a:focus-visible{outline:3px solid #fff;outline-offset:3px}
#a11y-panel{position:fixed;z-index:41;bottom:calc(84px + env(safe-area-inset-bottom,0px));inset-inline-start:calc(16px + max(env(safe-area-inset-left,0px),env(safe-area-inset-right,0px)));width:min(372px,calc(100vw - 32px));max-height:calc(100dvh - 108px - env(safe-area-inset-bottom,0px) - env(safe-area-inset-top,0px));overflow:auto;overscroll-behavior:contain;background:var(--a-bg);border:1px solid var(--a-acc);border-radius:20px;padding:16px;box-shadow:0 24px 60px -20px rgba(0,0,0,.9);display:grid;gap:14px}
#a11y-panel[hidden]{display:none}
.a11y-head{display:flex;align-items:center;justify-content:space-between;gap:10px}
.a11y-head h2{margin:0;font:700 21px/1.1 "Fredoka","Assistant",Arial,sans-serif;color:var(--a-ink)}
.a11y-x{width:40px;height:40px;border-radius:50%;border:1px solid var(--a-line);background:transparent;color:var(--a-ink);display:grid;place-items:center;cursor:pointer}
.a11y-x svg{width:20px;height:20px}
.a11y-size{display:flex;align-items:center;justify-content:space-between;gap:10px;border:1px solid var(--a-line);border-radius:14px;padding:8px 10px}
.a11y-size span{font-weight:600}
.a11y-size .ctl{display:flex;align-items:center;gap:8px}
.a11y-size button{width:44px;height:44px;border-radius:12px;border:1px solid var(--a-line);background:transparent;color:var(--a-ink);font:700 22px/1 Arial,sans-serif;cursor:pointer}
.a11y-size button:disabled{opacity:.35;cursor:default}
.a11y-size output{min-width:52px;text-align:center;font-weight:700;color:var(--a-acc);font-variant-numeric:tabular-nums}
.a11y-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.a11y-grid button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;min-height:84px;padding:10px 8px;border-radius:14px;border:1px solid var(--a-line);background:transparent;color:var(--a-ink);font:600 15px/1.2 "Assistant","Arial Hebrew",Arial,sans-serif;text-align:center;cursor:pointer}
.a11y-grid button svg{width:26px;height:26px;flex:none}
.a11y-grid button[aria-pressed="true"]{background:var(--a-acc);border-color:var(--a-acc);color:#08080B}
.a11y-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.a11y-reset{border:1px solid var(--a-line);background:transparent;color:var(--a-ink);border-radius:999px;padding:10px 16px;font:600 15px/1 "Assistant","Arial Hebrew",Arial,sans-serif;cursor:pointer}
.a11y-foot a{color:var(--a-acc);font-weight:600}
.a11y-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (hover:hover){.a11y-grid button:hover,.a11y-size button:not(:disabled):hover,.a11y-reset:hover,.a11y-x:hover{border-color:var(--a-acc)}}
`;
  const st = document.createElement("style");
  st.id = "a11y-css"; st.textContent = css;
  (document.head || R).appendChild(st);
  apply();

  const I = {
    man: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="4.2" r="2.2" fill="currentColor"/><path d="M4 7.6c2.6.8 5.3 1.2 8 1.2s5.4-.4 8-1.2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M12 8.8v5.4m0 0-3 7.3m3-7.3 3 7.3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    contrast: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg>',
    light: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>',
    gray: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c3.5 4.2 6 7.4 6 10.5a6 6 0 0 1-12 0C6 10.4 8.5 7.2 12 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 3c-3.5 4.2-6 7.4-6 10.5a6 6 0 0 0 6 6z" fill="currentColor"/></svg>',
    links: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/></svg>',
    font: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20 10 4h1l6 16M6.6 14h7.8"/><path d="M17 20h4"/></svg>',
    space: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5h12M8 12h12M8 19h12"/><path d="M4 4v16M2.5 6 4 4l1.5 2M2.5 18 4 20l1.5-2"/></svg>',
    still: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9.5 8v8M14.5 8v8" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    cursor: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 2.5l13.5 10.2-6 .9 3.6 7-2.9 1.5-3.6-7.1L5 19.5z" fill="currentColor"/></svg>'
  };

  function build() {
    if (document.getElementById("a11y-btn")) return;
    const en = (R.lang || "").toLowerCase().startsWith("en");
    const T = en ? {
      open: "Accessibility menu", title: "Accessibility", close: "Close the accessibility menu", size: "Text size", smaller: "Smaller text", bigger: "Larger text",
      contrast: "High contrast", light: "Light background", gray: "Grayscale", links: "Highlight links", font: "Readable font", space: "Text spacing", still: "Stop animations & videos", cursor: "Big cursor",
      reset: "Reset settings", stmt: "Accessibility statement (Hebrew)", done: "Settings reset"
    } : {
      open: "תפריט נגישות", title: "נגישות", close: "סגירת תפריט הנגישות", size: "גודל טקסט", smaller: "הקטנת טקסט", bigger: "הגדלת טקסט",
      contrast: "ניגודיות גבוהה", light: "רקע בהיר", gray: "גווני אפור", links: "הדגשת קישורים", font: "גופן קריא", space: "ריווח טקסט", still: "עצירת אנימציות וסרטונים", cursor: "סמן גדול",
      reset: "איפוס הגדרות", stmt: "הצהרת נגישות", done: "ההגדרות אופסו"
    };

    const btn = document.createElement("button");
    btn.type = "button"; btn.id = "a11y-btn"; btn.className = "a11y-ui";
    btn.setAttribute("aria-label", T.open); btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-controls", "a11y-panel");
    btn.innerHTML = I.man;

    const p = document.createElement("div");
    p.id = "a11y-panel"; p.className = "a11y-ui"; p.hidden = true;
    p.setAttribute("role", "dialog"); p.setAttribute("aria-labelledby", "a11y-title");
    p.innerHTML =
      `<div class="a11y-head"><h2 id="a11y-title">${T.title}</h2><button type="button" class="a11y-x" aria-label="${T.close}">${I.x}</button></div>` +
      `<div class="a11y-size" role="group" aria-label="${T.size}"><span aria-hidden="true">${T.size}</span><div class="ctl">` +
      `<button type="button" data-z="-1" aria-label="${T.smaller}">−</button><output aria-live="polite"></output><button type="button" data-z="1" aria-label="${T.bigger}">+</button></div></div>` +
      `<div class="a11y-grid">${TOG.map(k => `<button type="button" data-k="${k}" aria-pressed="false">${I[k]}<span>${T[k]}</span></button>`).join("")}</div>` +
      `<div class="a11y-foot"><button type="button" class="a11y-reset">${T.reset}</button><a href="accessibility.html">${T.stmt}</a></div>` +
      `<p class="a11y-sr" aria-live="polite"></p>`;

    document.body.append(btn, p);
    const out = p.querySelector("output"), zm = p.querySelector('[data-z="-1"]'), zp = p.querySelector('[data-z="1"]'), live = p.querySelector(".a11y-sr");
    const sync = () => {
      p.querySelectorAll("[data-k]").forEach(b => b.setAttribute("aria-pressed", String(!!S[b.dataset.k])));
      const i = S.zoom | 0; out.textContent = Math.round((STEPS[i] || 1) * 100) + "%";
      zm.disabled = i <= 0; zp.disabled = i >= STEPS.length - 1;
    };
    const stillNow = on => {
      if (on) {
        try { document.getAnimations && document.getAnimations().forEach(a => { try { a.finish(); } catch (e) { a.cancel(); } }); } catch (e) {}
        document.querySelectorAll("video").forEach(v => { if (!v.closest("dialog")) v.pause(); });
        dispatchEvent(new Event("a11y-still"));
      } else if (document.querySelector("video")) {
        // מחזירים את התנועה: טעינה מחדש, וההגדרות האחרות נשמרות
        location.reload();
      }
    };
    const setOpen = o => {
      p.hidden = !o; btn.setAttribute("aria-expanded", String(o));
      if (o) p.querySelector(".a11y-x").focus();
    };

    btn.addEventListener("click", e => { e.stopPropagation(); setOpen(p.hidden); });
    p.querySelector(".a11y-x").addEventListener("click", () => { setOpen(false); btn.focus(); });
    p.addEventListener("click", e => {
      e.stopPropagation();
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.k) {
        const k = b.dataset.k; S[k] = !S[k];
        if (S[k] && k === "contrast") S.light = false;
        if (S[k] && k === "light") S.contrast = false;
        save(); apply(); sync();
        if (k === "still") stillNow(S[k]);
      } else if (b.dataset.z) {
        S.zoom = Math.max(0, Math.min(STEPS.length - 1, (S.zoom | 0) + (+b.dataset.z)));
        save(); apply(); sync();
      } else if (b.classList.contains("a11y-reset")) {
        const wasStill = !!S.still; S = {}; save(); apply(); sync(); live.textContent = T.done;
        if (wasStill) stillNow(false);
      }
    });
    document.addEventListener("click", e => { if (!p.hidden && !p.contains(e.target) && e.target !== btn) setOpen(false); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !p.hidden) { setOpen(false); btn.focus(); } });
    sync();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
