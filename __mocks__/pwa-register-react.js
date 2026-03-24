/**
 * Mock for virtual:pwa-register/react
 * Used during testing to avoid PWA plugin virtual module resolution errors
 */
export function useRegisterSW() {
  return {
    needRefresh: [false, () => {}],
    updateServiceWorker: () => {},
    offlineReady: [false, () => {}],
  };
}

export default { useRegisterSW };
