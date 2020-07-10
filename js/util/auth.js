window.params = window.params || new URLSearchParams(window.location.search);
window.lpTag = window.lpTag || {};
lpTag.identities = lpTag.identities || [];

let identity = null;

if (params.has('sub')) {
    identity = {
        iss: document.location.host,
        acr: 'loa1',
        sub: params.get('sub')
    }
} else if (params.has('randomsub')) {
    identity = {
        iss: document.location.host,
        acr: 'loa1',
        sub: Math.random().toString(36).substring(2)
    }
}

lpTag.identities.push(function (cb) { cb(identity) })