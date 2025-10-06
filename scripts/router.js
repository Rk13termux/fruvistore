// Simple hash router
const routes = new Map();

export function registerRoute(path, render) {
  routes.set(path, render);
}

export function getCurrentPath() {
  let hash = window.location.hash || '#/';
  if (hash.startsWith('#')) hash = hash.slice(1);
  if (hash.startsWith('!')) hash = hash.slice(1);
  if (!hash.startsWith('/')) {
    if (hash === '' || hash === undefined) return '/';
    hash = '/' + hash;
  }
  return hash;
}

export function startRouter(rootEl, onNotFound) {
  function render() {
    const path = getCurrentPath();
    let matchFound = false;

    for (const [routePath, renderFn] of routes.entries()) {
      const paramNames = [];
      const regexPath = routePath.replace(/:(\w+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return '([^/]+)';
      });

      const regex = new RegExp(`^${regexPath}$`);
      const match = path.match(regex);

      if (match) {
        const params = paramNames.reduce((acc, name, index) => {
          acc[name] = match[index + 1];
          return acc;
        }, {});

        renderFn(rootEl, params);
        matchFound = true;
        break;
      }
    }

    if (!matchFound && path.startsWith('/')) {
      onNotFound?.(rootEl, path);
    }

    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (_) { window.scrollTo(0, 0); }
  }

  window.addEventListener('hashchange', render);
  render();
}
