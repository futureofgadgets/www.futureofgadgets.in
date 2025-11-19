export const cacheManager = {
  clear: () => {
    if (typeof window === 'undefined') return;
    const keysToKeep = ['cookie-consent', 'cookie-consent-time', 'cache-enabled'];
    Object.keys(localStorage).forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    sessionStorage.clear();
  },
  
  isEnabled: () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('cache-enabled') === 'true';
  }
};
