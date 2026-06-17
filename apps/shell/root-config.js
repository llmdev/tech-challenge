(() => {
  function doRegister(singleSpa) {
    const { registerApplication, start } = singleSpa;

    function pathPrefix(prefix) {
      return function(location) {
        return location.pathname === prefix || location.pathname.startsWith(prefix + '/');
      };
    }

    // Domínio: Home / Dashboard
    registerApplication({
      name: 'mfe-next',
      app: () => {
        if (globalThis.mfeNext) return Promise.resolve(globalThis.mfeNext);
        return new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = '/vendor/mfe-next.js';
          s.onload = () => {
            if (globalThis.mfeNext) resolve(globalThis.mfeNext);
            else reject(new Error('mfeNext lifecycles not found on globalThis after load'));
          };
          s.onerror = () => reject(new Error('Failed to load mfe-next script'));
          document.head.appendChild(s);
        });
      },
      activeWhen: pathPrefix('/mfe-next'),
    });

    // Domínio: Transações
    registerApplication({
      name: 'mfe-transactions',
      app: () => {
        if (globalThis.mfeTransactions) return Promise.resolve(globalThis.mfeTransactions);
        return new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = '/vendor/mfe-transactions.js';
          s.onload = () => {
            if (globalThis.mfeTransactions) resolve(globalThis.mfeTransactions);
            else reject(new Error('mfeTransactions lifecycles not found on globalThis after load'));
          };
          s.onerror = () => reject(new Error('Failed to load mfe-transactions script'));
          document.head.appendChild(s);
        });
      },
      activeWhen: pathPrefix('/mfe-transacoes'),
    });

    start();
  }

  const singleSpa = globalThis.singleSpa;
  if (singleSpa) {
    doRegister(singleSpa);
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://unpkg.com/single-spa@5.10.4/lib/single-spa.min.js';
  script.onload = () => {
    if (globalThis.singleSpa) doRegister(globalThis.singleSpa);
    else console.error('singleSpa still not available after loading UMD script.');
  };
  script.onerror = () => console.error('Failed to load single-spa UMD script.');
  document.head.appendChild(script);
})();
