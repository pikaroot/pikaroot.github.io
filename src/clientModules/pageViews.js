// Page-view counter. On each page view (including client-side navigation) it sends one
// request to the homelab beacon: GET <KEVLAR_URL>/px/<page path>. Caddy logs it and
// GoAccess turns the log into a private report. No cookies, IDs or fingerprinting, and
// nothing is sent from local dev or when the browser asks not to be tracked.
import {KEVLAR_URL} from '../data/projects.js';

const SITE_HOST = 'pikaroot.github.io';

export function onRouteDidUpdate({location, previousLocation}) {
  if (previousLocation && previousLocation.pathname === location.pathname) return; // hash change
  if (window.location.hostname !== SITE_HOST) return;
  if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return;
  const path = location.pathname.replace(/\/+$/, '') || '/';
  fetch(`${KEVLAR_URL}/px${path === '/' ? '' : path}`, {
    mode: 'no-cors',
    credentials: 'omit',
    keepalive: true,
    referrerPolicy: 'no-referrer',
  }).catch(() => {});
}
