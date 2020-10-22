window.params = window.params || new URLSearchParams(window.location.search);
window.lpTag = window.lpTag || {};
lpTag.identities = lpTag.identities || [];

let identity = null;

if (params.has('external')) {
    // if external param is specified use the hardcoded jwt since auth will be unreachable
    document.getElementById('authHardCode').checked = true
}

if (params.has('sub') || params.has('randomsub')) {
    // if "external" was specified use the sub from the hardcoded jwt
    pushIdentity(document.getElementById('authHardCode').checked ? '138766AC' : null)
}

function pushIdentity (sub, fromButton = false) {
    identity = {
        iss: document.location.host,
        acr: 'loa1',
        sub: sub || params.get('sub') || Math.random().toString(36).substring(2)
    }
    lpTag.identities.push(function ident (cb) { cb(identity) })
    if (fromButton && document.getElementById('authNewPageAfterIdentity').checked) newPage()
}

lpGetAuthenticationToken = function (cb) {
    if (document.getElementById('authYourJWT').value) return cb(document.getElementById('authYourJWT').value)
    if (document.getElementById('authHardCode').checked) return cb(document.getElementById('authHardCodedJWT').value)

    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    let payload = {
        iss: identity.iss,
        sub: identity.sub
    }
    let body = JSON.stringify({ payload });

    let requestOptions = {
        method: 'POST',
        headers, body
    };

    fetch("https://supportlab.lpnet.com/api/auth/token", requestOptions)
      .then(response => response.text().then(text => cb(text)))
      .catch(error => console.log('error', error));
}