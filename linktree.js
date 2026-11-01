/* linktree.js
   Penampil halaman kumpulan link.
   Dipakai oleh links.html (halaman publik) dan pratinjau di linktree-admin.html.
   Tidak perlu diubah. Semua tampilan diatur dari admin. */
(function (global) {
  "use strict";

  /* ------------------------------ font ------------------------------ */

  var FONTS = {
    system:  { css: 'system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif' },
    inter:   { css: '"Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif', gf: "Inter:wght@400;500;600;700" },
    poppins: { css: '"Poppins",system-ui,sans-serif', gf: "Poppins:wght@400;500;600;700" },
    jakarta: { css: '"Plus Jakarta Sans",system-ui,sans-serif', gf: "Plus+Jakarta+Sans:wght@400;500;600;700" },
    nunito:  { css: '"Nunito",system-ui,sans-serif', gf: "Nunito:wght@400;600;700" },
    lora:    { css: '"Lora",Georgia,"Times New Roman",serif', gf: "Lora:wght@400;600;700" }
  };

  var loaded = {};
  function loadFont(id) {
    var f = FONTS[id];
    if (!f || !f.gf || loaded[id]) return;
    loaded[id] = true;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=" + f.gf + "&display=swap";
    document.head.appendChild(l);
  }

  /* ------------------------------ tema ------------------------------ */

  function color(v, d) { return /^#[0-9a-f]{6}$/i.test(v || "") ? v : d; }
  function pick(v, list, d) { return list.indexOf(v) >= 0 ? v : d; }
  function num(v, min, max, d) {
    var n = Number(v);
    return isFinite(n) && v !== "" && v != null ? Math.max(min, Math.min(max, n)) : d;
  }

  function theme(t) {
    t = t || {};
    return {
      bgFrom: color(t.bgFrom, "#ffffff"),
      bgTo: color(t.bgTo, "#c9fbea"),
      bgAngle: num(t.bgAngle, 0, 360, 160),
      text: color(t.text, "#1f2937"),
      accent: color(t.accent, "#14b8a6"),
      btnBg: color(t.btnBg, "#ffffff"),
      btnText: color(t.btnText, "#1f2937"),
      btnStyle: pick(t.btnStyle, ["solid", "outline", "soft", "glass"], "solid"),
      radius: num(t.radius, 0, 40, 10),
      font: pick(t.font, Object.keys(FONTS), "inter"),
      caps: t.caps === true,
      icons: t.icons !== false,
      decor: pick(t.decor, ["none", "blobs"], "none"),
      layout: pick(t.layout, ["list", "grid"], "list"),
      avatarShape: pick(t.avatarShape, ["logo", "circle", "rounded"], "logo")
    };
  }

  function rgba(h, a) {
    var n = parseInt(h.slice(1), 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  }

  function safeLink(u) {
    u = String(u || "").trim();
    return /^(https?:\/\/|mailto:|tel:)/i.test(u) ? u : "";
  }
  function safeImg(u) {
    u = String(u || "").trim();
    return /^https?:\/\//i.test(u) ? u : "";
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ------------------------------ ikon ------------------------------ */

  var SVG_OPEN = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var ICON_LINK = SVG_OPEN + '<path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
  var ICON_SHARE = SVG_OPEN + '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>';
  var ICON_CHECK = SVG_OPEN + '<path d="M20 6 9 17l-5-5"/></svg>';

  /* ------------------------------ gaya ------------------------------ */

  var CSS = [
    ".lt{--lt-radius:10px;position:relative;min-height:100vh;min-height:100dvh;overflow:hidden;color:var(--lt-text);font-family:var(--lt-font);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}",
    ".lt *,.lt *::before,.lt *::after{box-sizing:border-box;margin:0;padding:0;font-family:inherit}",

    ".lt-blob{position:absolute;border-radius:50%;background:var(--lt-accent);filter:blur(80px);opacity:.3;pointer-events:none;width:min(440px,75vw);height:min(440px,75vw);animation:lt-float 16s ease-in-out infinite alternate}",
    ".lt-b1{top:-140px;left:-120px}",
    ".lt-b2{bottom:-160px;right:-140px;animation-delay:-8s}",
    "@keyframes lt-float{to{transform:translate(36px,44px) scale(1.1)}}",

    ".lt-wrap{position:relative;z-index:1;width:100%;max-width:520px;margin:0 auto;padding:calc(40px + env(safe-area-inset-top)) 18px calc(40px + env(safe-area-inset-bottom));display:flex;flex-direction:column;align-items:center;text-align:center;min-height:100vh;min-height:100dvh}",

    ".lt-av{display:block;margin-bottom:20px;animation:lt-in .6s ease backwards}",
    ".lt-av-circle .lt-av,.lt-av-rounded .lt-av{width:104px;height:104px;object-fit:cover;border:3px solid rgba(255,255,255,.8);box-shadow:0 10px 30px -8px rgba(0,0,0,.35)}",
    ".lt-av-circle .lt-av{border-radius:50%}",
    ".lt-av-rounded .lt-av{border-radius:28px}",
    ".lt-av-logo .lt-av{width:auto;height:auto;max-width:min(260px,72%);max-height:120px;object-fit:contain}",

    ".lt-title{font-size:1.45rem;line-height:1.28;font-weight:700;letter-spacing:-.015em;text-wrap:balance;overflow-wrap:anywhere;animation:lt-in .6s .05s ease backwards}",
    ".lt-desc{margin-top:12px;max-width:46ch;font-size:.92rem;line-height:1.65;opacity:.78;white-space:pre-line;text-wrap:pretty;overflow-wrap:anywhere;animation:lt-in .6s .1s ease backwards}",

    ".lt-links{display:grid;grid-template-columns:minmax(0,1fr);gap:12px;width:100%;margin-top:30px}",
    ".lt-h{grid-column:1/-1;margin-top:14px;font-size:.95rem;font-weight:700;letter-spacing:.01em;text-align:center;opacity:.9;overflow-wrap:anywhere}",
    ".lt-h:first-child{margin-top:0}",
    ".lt-caps .lt-h{text-transform:uppercase;font-size:.78rem;letter-spacing:.12em}",

    ".lt-btn{display:grid;grid-template-columns:28px minmax(0,1fr) 28px;align-items:center;gap:8px;min-height:56px;padding:12px 14px;text-decoration:none;color:var(--lt-btn-text);border-radius:var(--lt-radius);font-size:.9rem;font-weight:600;line-height:1.3;border:1px solid transparent;transition:transform .18s ease,box-shadow .18s ease,background-color .18s ease;animation:lt-in .5s ease backwards;animation-delay:calc(var(--i,0) * 55ms + 160ms);-webkit-tap-highlight-color:transparent}",
    ".lt-caps .lt-btn{font-size:.8rem;letter-spacing:.04em}",
    ".lt-caps .lt-lb{text-transform:uppercase}",
    ".lt-ic{display:grid;place-items:center;width:28px;height:28px;opacity:.7}",
    ".lt-emoji{opacity:1;font-size:1.2rem;line-height:1}",
    ".lt-tx{display:flex;flex-direction:column;gap:3px;min-width:0}",
    ".lt-lb{overflow-wrap:anywhere}",
    ".lt-ds{font-weight:400;font-size:.76rem;letter-spacing:0;text-transform:none;opacity:.72;overflow-wrap:anywhere}",

    ".lt-s-solid .lt-btn{background:var(--lt-btn-bg);border-color:rgba(0,0,0,.05);box-shadow:0 1px 2px rgba(0,0,0,.06),0 8px 18px -8px rgba(0,0,0,.22)}",
    ".lt-s-outline .lt-btn{background:transparent;border:2px solid var(--lt-btn-text)}",
    ".lt-s-soft .lt-btn{background:var(--lt-btn-soft);border-color:rgba(255,255,255,.35)}",
    ".lt-s-glass .lt-btn{background:var(--lt-btn-glass);border-color:rgba(255,255,255,.4);-webkit-backdrop-filter:blur(14px) saturate(140%);backdrop-filter:blur(14px) saturate(140%);box-shadow:0 8px 24px -12px rgba(0,0,0,.35)}",

    "@media (hover:hover){",
    ".lt-btn:hover{transform:translateY(-2px)}",
    ".lt-s-solid .lt-btn:hover{box-shadow:0 1px 2px rgba(0,0,0,.06),0 14px 26px -10px rgba(0,0,0,.32)}",
    ".lt-s-outline .lt-btn:hover{background:var(--lt-btn-o)}",
    ".lt-s-soft .lt-btn:hover{background:var(--lt-btn-soft-h)}",
    ".lt-s-glass .lt-btn:hover{background:var(--lt-btn-glass-h)}",
    "}",
    ".lt-btn:active{transform:scale(.985)}",
    ".lt-btn:focus-visible,.lt-share:focus-visible,.lt-retry:focus-visible{outline:3px solid var(--lt-accent);outline-offset:3px}",

    ".lt-foot{margin-top:auto;padding-top:40px;font-size:.78rem;line-height:1.6;opacity:.65;white-space:pre-line;overflow-wrap:anywhere}",

    ".lt-share{position:fixed;top:calc(12px + env(safe-area-inset-top));right:12px;z-index:5;width:42px;height:42px;border:0;border-radius:50%;display:grid;place-items:center;cursor:pointer;color:var(--lt-text);background:var(--lt-share-bg);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);transition:transform .15s ease,background-color .15s ease}",
    ".lt-share:active{transform:scale(.92)}",

    ".lt-center{min-height:100vh;min-height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center}",
    ".lt-center h1{font-size:1.2rem;font-weight:700}",
    ".lt-center p{max-width:34ch;font-size:.9rem;line-height:1.55;opacity:.75}",
    ".lt-spin{width:36px;height:36px;border-radius:50%;border:3px solid var(--lt-share-bg);border-top-color:var(--lt-accent);animation:lt-rot .8s linear infinite}",
    ".lt-retry{margin-top:6px;padding:11px 20px;border:0;border-radius:10px;cursor:pointer;font-size:.9rem;font-weight:600;color:#fff;background:var(--lt-accent)}",

    "@keyframes lt-in{from{opacity:0;transform:translateY(10px)}}",
    "@keyframes lt-rot{to{transform:rotate(360deg)}}",

    "@media (min-width:768px){",
    ".lt-wrap{max-width:620px;padding-top:calc(80px + env(safe-area-inset-top));padding-bottom:72px}",
    ".lt-grid .lt-wrap{max-width:880px}",
    ".lt-grid .lt-links{grid-template-columns:repeat(2,minmax(0,1fr))}",
    ".lt-av-circle .lt-av,.lt-av-rounded .lt-av{width:128px;height:128px}",
    ".lt-av-logo .lt-av{max-height:150px}",
    ".lt-title{font-size:2.05rem}",
    ".lt-desc{font-size:1rem}",
    ".lt-links{gap:14px;margin-top:36px}",
    ".lt-btn{min-height:60px;padding:14px 18px;font-size:.95rem}",
    ".lt-caps .lt-btn{font-size:.84rem}",
    ".lt-share{top:20px;right:24px}",
    "}",
    "@media (max-width:359px){.lt-btn{padding:11px 10px;gap:6px}.lt-title{font-size:1.25rem}}",
    "@media (prefers-reduced-motion:reduce){.lt *{animation:none!important;transition:none!important}}"
  ].join("\n");

  function injectStyle() {
    if (document.getElementById("lt-style")) return;
    var s = document.createElement("style");
    s.id = "lt-style";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function applyTheme(root, t, extra) {
    root.className = "lt lt-s-" + t.btnStyle + " lt-av-" + t.avatarShape +
      (t.caps ? " lt-caps" : "") + (t.layout === "grid" ? " lt-grid" : "") + (extra ? " " + extra : "");
    var s = root.style;
    s.setProperty("--lt-text", t.text);
    s.setProperty("--lt-accent", t.accent);
    s.setProperty("--lt-btn-bg", t.btnBg);
    s.setProperty("--lt-btn-text", t.btnText);
    s.setProperty("--lt-radius", t.radius + "px");
    s.setProperty("--lt-font", FONTS[t.font].css);
    s.setProperty("--lt-btn-soft", rgba(t.btnBg, 0.6));
    s.setProperty("--lt-btn-soft-h", rgba(t.btnBg, 0.85));
    s.setProperty("--lt-btn-glass", rgba(t.btnBg, 0.2));
    s.setProperty("--lt-btn-glass-h", rgba(t.btnBg, 0.34));
    s.setProperty("--lt-btn-o", rgba(t.btnText, 0.1));
    s.setProperty("--lt-share-bg", rgba(t.text, 0.12));
    s.background = "linear-gradient(" + t.bgAngle + "deg," + t.bgFrom + "," + t.bgTo + ")";
    document.documentElement.style.backgroundColor = t.bgTo;
    loadFont(t.font);

    var m = document.querySelector('meta[name="theme-color"]');
    if (!m) {
      m = document.createElement("meta");
      m.name = "theme-color";
      document.head.appendChild(m);
    }
    m.content = t.bgFrom;
  }

  /* ----------------------------- render ----------------------------- */

  function render(root, data, opts) {
    opts = opts || {};
    data = data || {};
    injectStyle();

    var t = theme(data.theme);
    applyTheme(root, t);
    root.textContent = "";

    if (t.decor === "blobs") {
      root.appendChild(el("i", "lt-blob lt-b1"));
      root.appendChild(el("i", "lt-blob lt-b2"));
    }

    var wrap = el("main", "lt-wrap");

    var avatar = safeImg(data.avatar);
    if (avatar) {
      var img = el("img", "lt-av");
      img.src = avatar;
      img.alt = "";
      img.decoding = "async";
      img.onerror = function () { img.style.display = "none"; };
      wrap.appendChild(img);
    }

    wrap.appendChild(el("h1", "lt-title", data.title || ""));
    if (data.description) wrap.appendChild(el("p", "lt-desc", data.description));

    var list = el("div", "lt-links");
    var n = 0;
    (data.links || []).forEach(function (l) {
      if (!l) return;

      if (l.type === "heading") {
        if (l.label) list.appendChild(el("h2", "lt-h", l.label));
        return;
      }

      var href = safeLink(l.url);
      if (!href || !l.label) return;

      var a = el("a", "lt-btn");
      a.href = href;
      a.style.setProperty("--i", n++);
      if (!/^(mailto:|tel:)/i.test(href)) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }

      var ic = el("span", "lt-ic");
      if (l.icon) {
        ic.className = "lt-ic lt-emoji";
        ic.textContent = l.icon;
      } else if (t.icons) {
        ic.innerHTML = ICON_LINK;
      }

      var tx = el("span", "lt-tx");
      tx.appendChild(el("span", "lt-lb", l.label));
      if (l.desc) tx.appendChild(el("span", "lt-ds", l.desc));

      a.appendChild(ic);
      a.appendChild(tx);
      a.appendChild(el("span", "lt-ic"));
      list.appendChild(a);
    });
    wrap.appendChild(list);

    if (data.footer) wrap.appendChild(el("footer", "lt-foot", data.footer));
    root.appendChild(wrap);

    var share = el("button", "lt-share");
    share.type = "button";
    share.setAttribute("aria-label", "Bagikan halaman ini");
    share.innerHTML = ICON_SHARE;
    share.onclick = function () {
      if (opts.preview) return;
      var url = location.href;
      if (navigator.share) {
        navigator.share({ title: data.title || "", url: url }).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () {
          share.innerHTML = ICON_CHECK;
          setTimeout(function () { share.innerHTML = ICON_SHARE; }, 1600);
        }).catch(function () {});
      }
    };
    root.appendChild(share);

    if (data.title) document.title = data.title;
  }

  function loading(root) {
    injectStyle();
    applyTheme(root, theme({}));
    root.textContent = "";
    var c = el("div", "lt-center");
    var s = el("div", "lt-spin");
    s.setAttribute("role", "status");
    s.setAttribute("aria-label", "Memuat");
    c.appendChild(s);
    root.appendChild(c);
  }

  function message(root, title, text, retryLabel, onRetry) {
    injectStyle();
    applyTheme(root, theme({}));
    root.textContent = "";
    var c = el("div", "lt-center");
    c.appendChild(el("h1", null, title));
    if (text) c.appendChild(el("p", null, text));
    if (retryLabel && onRetry) {
      var b = el("button", "lt-retry", retryLabel);
      b.type = "button";
      b.onclick = onRetry;
      c.appendChild(b);
    }
    root.appendChild(c);
  }

  global.LT = { render: render, loading: loading, message: message, theme: theme };
})(window);
