// Fade the page content in on client-side navigation (not on hash changes).
export function onRouteDidUpdate({location, previousLocation}) {
  if (!previousLocation || previousLocation.pathname === location.pathname) return;
  const main = document.querySelector('.main-wrapper');
  if (!main) return;
  main.classList.remove('route-enter');
  void main.offsetWidth; // restart the animation if it's still on the element
  main.classList.add('route-enter');
}
