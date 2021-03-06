﻿//import punycode = require('punycode');
//获取用户IP
export function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

};

export function parseCookie(cookie) {
    var cookies = {};
    if (!cookie) {
        return cookies;
    }
    var list = cookie.split(';');
    for (var i = 0; i < list.length; i++) {
        var pair: string[] = list[i].split('=');
        cookies[pair[0].trim()] = pair[1];
    }
    return cookies;
};
export function serialize(name, val:string, opt=null) {
    var pairs = [name + '=' +val];
    opt = opt || {};
    if (opt.maxAge) pairs.push('Max-Age=' + opt.maxAge);
    if (opt.domain) pairs.push('Domain=' + opt.domain);
    if (opt.path) pairs.push('Path=' + opt.path);
    if (opt.expires) pairs.push('Expires=' + opt.expires);
    if  (opt.httpOnly) pairs.push('HttpOnly');
    if (opt.secure) pairs.push('Secure');
    return pairs.join(';  ');
};

export class sess {
    private session;
    private _userinfo:any;
    constructor(req:any){
        this.session=req.session;
    }

     getitem(name:string) {
        return this.session[name];
    }
    setitem(name:string,value:any) {
        this.session[name]=value;
    }
}