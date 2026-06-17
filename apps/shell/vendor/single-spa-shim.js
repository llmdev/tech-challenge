// Minimal single-spa shim for local demo purposes only.
(function () {
  if (globalThis.singleSpa) return;

  const apps = [];

  function registerApplication(appConfig) {
    apps.push(Object.assign({ _mounted: false }, appConfig));
    console.log('[single-spa-shim] registered', appConfig.name);
  }

  function isActive(app) {
    try {
      return typeof app.activeWhen === 'function' ? app.activeWhen(window.location) : false;
    } catch (e) {
      console.error('[single-spa-shim] activeWhen threw', e);
      return false;
    }
  }

  async function mountApp(app) {
    if (app._mounted) return;
    try {
      const mod = await Promise.resolve(app.app());
      const lifecycles = mod || {};
      if (lifecycles.bootstrap) await lifecycles.bootstrap({});
      if (lifecycles.mount) await lifecycles.mount({});
      app._mounted = true;
      console.log('[single-spa-shim] mounted', app.name);
    } catch (err) {
      console.error('[single-spa-shim] mount failed for', app.name, err);
    }
  }

  function unmountApp(app) {
    if (!app._mounted) return;
    try {
      const p = Promise.resolve(app.app()).then(mod => mod.unmount ? mod.unmount({}) : null);
      p.then(() => {
        app._mounted = false;
        console.log('[single-spa-shim] unmounted', app.name);
      }).catch(err => console.error('[single-spa-shim] unmount error', err));
    } catch (err) {
      console.error('[single-spa-shim] unmount failed', err);
    }
  }

  function check() {
    apps.forEach(app => {
      try {
        if (isActive(app)) {
          mountApp(app);
        } else {
          unmountApp(app);
        }
      } catch (e) {
        console.error('[single-spa-shim] check error', e);
      }
    });
  }

  function start() {
    // initial check and listeners
    check();
    window.addEventListener('popstate', check);
    window.addEventListener('hashchange', check);
    // intercept pushState/replaceState
    const wrap = (type) => {
      const orig = history[type];
      return function () {
        const res = orig.apply(this, arguments);
        check();
        return res;
      };
    };
    history.pushState = wrap('pushState');
    history.replaceState = wrap('replaceState');
    console.log('[single-spa-shim] started');
  }

  globalThis.singleSpa = {
    registerApplication,
    start,
  };
})();
