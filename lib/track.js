// Sends a Google Analytics event when Analytics is loaded (it isn't for Do Not Track / GPC visitors).
export function track(name, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag('event', name, params);
}
