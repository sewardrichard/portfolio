(function() {
  function allPartialsLoaded() {
    window.__partialsReady = true;
    window.dispatchEvent(new Event('partials:ready'));
  }

  function loadIncludes() {
    const nodes = document.querySelectorAll('[data-include]');
    if (nodes.length === 0) {
      allPartialsLoaded();
      return;
    }

    let remaining = nodes.length;
    nodes.forEach(async (el) => {
      const src = el.getAttribute('data-include');
      try {
        const res = await fetch(src, { cache: 'no-cache' });
        if (!res.ok) throw new Error('Failed to load ' + src + ' (' + res.status + ')');
        const html = await res.text();
        el.innerHTML = html;
      } catch (err) {
        console.error('[includes] ' + err.message);
        el.innerHTML = '';
      } finally {
        remaining -= 1;
        if (remaining === 0) {
          allPartialsLoaded();
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadIncludes);
  } else {
    loadIncludes();
  }
})();
