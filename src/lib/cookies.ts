export const getCookieConsent = (): 'accepted' | 'rejected' | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/cookieConsent=([^;]+)/);
  return match ? (match[1] as 'accepted' | 'rejected') : null;
};

export const isCookieAccepted = (): boolean => {
  return getCookieConsent() === 'accepted';
};
