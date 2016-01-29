var punycode = require('punycode');
//获取用户IP
function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}
exports.getClientIp = getClientIp;
;
function parseCookie(cookie) {
    var cookies = {};
    if (!cookie) {
        return cookies;
    }
    var list = cookie.split(';');
    for (var i = 0; i < list.length; i++) {
        var pair = list[i].split('=');
        cookies[pair[0].trim()] = pair[1];
    }
    return cookies;
}
exports.parseCookie = parseCookie;
;
function serialize(name, val, opt) {
    if (opt === void 0) { opt = null; }
    var pairs = [name + '=' + punycode.encode(val)];
    opt = opt || {};
    if (opt.maxAge)
        pairs.push('Max-Age=' + opt.maxAge);
    if (opt.domain)
        pairs.push('Domain=' + opt.domain);
    if (opt.path)
        pairs.push('Path=' + opt.path);
    if (opt.expires)
        pairs.push('Expires=' + opt.exppires.toUTCString());
    if (opt.httpOnly)
        pairs.push('HttpOnly');
    if (opt.secure)
        pairs.push('Secure');
    return pairs.join(';  ');
}
exports.serialize = serialize;
;
//# sourceMappingURL=sharedmethod.js.map