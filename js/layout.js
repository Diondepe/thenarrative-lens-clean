// js/layout.js — robust partial loader (repo-root aware + cache-busting + fallback)

(function () {
  // Compute the repo "root" (e.g., /username/repo/) reliably on GitHub Pages
  const ROOT = (function () {
    // current path like /username/repo/page.html  => /username/repo/
    const p = location.pathname;
    return p.endsWith('/') ? p : p.replace(/[^/]+$/, '');
  })();

  async function inject(id, url, after, fallbackHTML) {
    const host = document.getElementById(id);
    if (!host) return;

    // add a tiny cache-buster so stale 404s aren’t cached by the browser/CDN
    const bust = `v=${Date.now()}`;
    const fullUrl = `${ROOT}${url}${url.includes('?') ? '&' : '?'}${bust}`;

    try {
      const res = await fetch(fullUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error(`${url}: ${res.status}`);
      host.innerHTML = await res.text();
      if (after) after();
    } catch (err) {
      console.error('[layout] inject failed:', err);
      if (fallbackHTML) host.innerHTML = fallbackHTML;
      if (after) after();
    }
  }

  function setActive() {
    const key = (document.body.dataset.page || '').toLowerCase();
    const link = document.querySelector(`#site-nav [data-key="${key}"]`);
    if (link) link.setAttribute('aria-current', 'page');
  }

  // Minimal fallbacks so the site stays usable even if fetch fails
  const FALLBACK_HEADER = `
<header class="site-header">
  <div class="topbar">
    <a class="brand" href="${ROOT}index.html" aria-label="Go to Home">
      <img class="favicon-inline" src="${ROOT}assets/favicon-redesigned.png" alt="TNL" />
      <img class="banner" src="${ROOT}assets/tnl-banner-matrix.png" alt="The Narrative Lens" />
    </a>
    <div class="top-actions">
      <a href="${ROOT}subscribe.html" class="btn primary with-icon">
        <img class="mini-icon" src="${ROOT}assets/favicon-redesigned.png" alt=""> Subscribe
      </a>
    </div>
  </div>
  <div class="navbar">
    <div class="navbar-inner">
      <nav class="nav" id="site-nav" aria-label="Primary">
        <a href="${ROOT}index.html"          data-key="home">Home</a>
        <a href="${ROOT}narratives.html"     data-key="narratives">Narratives</a>
        <a href="${ROOT}feeds.html"          data-key="feeds">Narrative News</a>
        <a href="${ROOT}lens-video.html"     data-key="lens-video">Lens-Video</a>
        <a href="${ROOT}lens-actors.html"    data-key="lens-actors">Lens-Actors <span class="pill sub"></span></a>
        <a href="${ROOT}lens-test.html"      data-key="lens-test">Lens-Test <span class="pill sub"></span></a>
        <a href="${ROOT}lens-timeline.html"  data-key="lens-timeline">Lens-Timeline <span class="pill sub"></span></a>
        <a href="${ROOT}help.html"           data-key="help">Help</a>
        <a href="${ROOT}about.html"          data-key="about">About</a>
      </nav>
    </div>
  </div>
</header>`;

  const FALLBACK_FOOTER = `
<footer class="site-footer">
  © <span id="y"></span> The Narrative Lens ·
  <a href="${ROOT}privacy.html">Privacy</a> ·
  <a href="${ROOT}terms.html">Terms</a> ·
  <a href="${ROOT}unsubscribe.html">Unsubscribe</a>
</footer>
<script>try{document.getElementById('y').textContent=new Date().getFullYear();}catch(e){}</script>`;

  // Inject header & footer using root-aware paths
  inject('site-header', 'partials/header.html', setActive, FALLBACK_HEADER);
  inject('site-footer', 'partials/footer.html', null, FALLBACK_FOOTER);
})();
