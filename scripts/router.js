// Simple hash router
// Routes must be registered via registerRoute(path, renderFn)

const routes = new Map();

export function registerRoute(path, render) {
  routes.set(path, render);
}

export function getCurrentPath() {
  let hash = window.location.hash || '#/';
  if (hash.startsWith('#')) hash = hash.slice(1); // remove '#'
  if (hash.startsWith('!')) hash = hash.slice(1); // support hashbang '#!'
  if (!hash.startsWith('/')) {
    // support anchors like '#nutricion' -> '/nutricion'
    if (hash === '' || hash === undefined) return '/';
    hash = '/' + hash;
  }
  return hash;
}

export function startRouter(rootEl, onNotFound) {
  function render() {
    const path = getCurrentPath();
    const renderFn = routes.get(path);
    if (renderFn) {
      renderFn(rootEl);
    } else if (path.startsWith('/')) {
      onNotFound?.(rootEl, path);
    }
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (_) { window.scrollTo(0,0); }
  }

  window.addEventListener('hashchange', render);
  render();
}
