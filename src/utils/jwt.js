export function decodeJwt(token) {
    const payload = token.split('.')[1];
    if (!payload) {
        return ''
    }
    const decoded = atob(payload);
    return JSON.parse(decoded);
}
