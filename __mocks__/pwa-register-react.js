export const useRegisterSW = () => ({
  isInstalled: false,
  isOfflineReady: false,
  needRefresh: false,
  offlineReady: false,
  registration: null,
  updateServiceWorker: () => {},
});
