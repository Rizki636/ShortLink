/* bio.js - merender halaman kumpulan link dari window.BIO (dibuat otomatis oleh Kode.gs) */
(function () {
  var B = window.BIO || {};
  var T = B.theme || {};
  var app = document.getElementById("app");
  if (!app) return;

  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }

  var style = el("style");
  style.textContent =
    "*{box-sizing:border-box;margin:0;padding:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}" +
    "body{background:linear-gradient(160deg," + (T.bgFrom || "#fff") + "," + (T.bgTo || "#c9fbea") + ");background-attachment:fixed;color:" + (T.text || "#1f2937") + "}" +
    ".wrap{max-width:480px;margin:0 auto;padding:36px 18px 48px;text-align:center;min-height:100vh}" +
    ".avatar{max-width:220px;max-height:140px;margin:0 auto 18px;display:block;object-fit:contain}" +
    "h1{font-size:1.3rem;line-height:1.35;margin-bottom:10px}" +
    ".desc{font-size:.85rem;opacity:.75;line-height:1.5;margin:0 auto 26px;max-width:380px;white-space:pre-line}" +
    ".links{display:flex;flex-direction:column;gap:12px}" +
    ".btn{display:block;padding:15px 18px;text-decoration:none;font-weight:600;font-size:.82rem;letter-spacing:.02em;text-transform:uppercase;" +
    "color:" + (T.btnText || "#111827") + ";border-radius:" + (T.radius != null ? T.radius : 10) + "px;transition:transform .12s,box-shadow .12s;" +
    (T.btnStyle === "outline"
      ? "background:transparent;border:2px solid " + (T.btnText || "#111827") + ";"
      : "background:" + (T.btnBg || "#fff") + ";box-shadow:0 2px 8px rgba(0,0,0,.1);border:2px solid transparent;") + "}" +
    ".btn:hover{transform:translateY(-2px)}" +
    ".foot{margin-top:34px;font-size:.75rem;opacity:.6;white-space:pre-line}";
  document.head.appendChild(style);

  var wrap = el("div", { "class": "wrap" });

  if (B.avatar) {
    var img = el("img", { "class": "avatar", src: B.avatar, alt: "" });
    img.onerror = function () { img.style.display = "none"; };
    wrap.appendChild(img);
  }

  wrap.appendChild(el("h1", null, B.title || ""));
  if (B.description) wrap.appendChild(el("p", { "class": "desc" }, B.description));

  var list = el("div", { "class": "links" });
  (B.links || []).forEach(function (l) {
    var a = el("a", { "class": "btn", href: l.url, target: "_blank", rel: "noopener" }, l.label);
    list.appendChild(a);
  });
  wrap.appendChild(list);

  if (B.footer) wrap.appendChild(el("p", { "class": "foot" }, B.footer));

  app.appendChild(wrap);

  // hitung kunjungan
  try {
    if (B.api && B.code) {
      fetch(B.api + "?action=hit&type=bio&code=" + encodeURIComponent(B.code), { mode: "no-cors", keepalive: true });
    }
  } catch (e) {}
})();
