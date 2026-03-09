const PANEL_PREFIX = "/panel";
const PANEL_LOGIN_PATH = "/panel/login";
function isPanelRoute(pathname) {
    return pathname === PANEL_PREFIX || pathname.startsWith(`${PANEL_PREFIX}/`);
}
function isPublicPanelRoute(pathname) {
    return pathname === PANEL_LOGIN_PATH;
}
export function isProtectedPanelPath(pathname) {
    return isPanelRoute(pathname) && !isPublicPanelRoute(pathname);
}
export function shouldRedirectUnauthenticated(pathname, hasSession) {
    if (!isProtectedPanelPath(pathname)) {
        return false;
    }
    return !hasSession;
}
export { PANEL_LOGIN_PATH };
