window.params = window.params || new URLSearchParams(window.location.search);
window.lpTag = window.lpTag || {};
lpTag.identities = lpTag.identities || [];
window._auth = window._auth || {};

window._auth.identity = null;

if (params.has('externalauth')) {
    // if external param is specified use the hardcoded jwt since auth will be unreachable
    document.getElementById('authHardCode').checked = true
    window._auth.sub = '138766AC'
}

// if a sub is set/requested in the queryparams push the identity
if (params.has('sub')) {
    // if "authHardCode" is checked we need to use the sub from the hardcoded JWT, otherwise use the specified one
    window._auth.sub = window._auth.sub || params.get('sub')
    pushIdentity()
} else if (params.has('randomsub')) {
    // if "authHardCode" is checked we need to use the sub from the hardcoded JWT, otherwise generate one randomly
    window._auth.sub = window._auth.sub || randomSub()
    window.params.delete('randomsub');
    window.params.append('sub', window._auth.sub)
    history.replaceState(null, null, `?${window.params.toString()}`)
    location.reload()
}

let authDomain = 'supportlab.lpnet.com'
if (params.has('auth-ngrok')) {
    authDomain = `${params.get('auth-ngrok')}.ngrok.io`
}

function pushIdentity (sub, fromButton = false) {
    // get sub from arguments, or from js context, or from queryparams, or generate randomly
    sub = sub || window._auth.sub || params.get('sub') || randomSub()
    // fill in and disable the relevant inputs
    document.getElementById('jwtSub').value = sub;
    document.getElementById('authSub').value = sub;
    document.getElementById('authSub').disabled = true;
    window._auth.identity = {
        iss: document.location.host,
        acr: 'loa1',
        sub
    }
    // push the identity
    lpTag.identities.push(function ident (cb) { cb(window._auth.identity) })
    // send the unauth customerInfo SDE (this helps with popped-out windows, so that the sub can be identified
    // from the visitor session
    waitForTag(function sendCtmrInfoSDE () {lpTag.sdes.push({ type: "ctmrinfo", info: { customerId: sub }}) })
    // waitForTrue(function SDESendExists () { return lpTag && lpTag.sdes && lpTag.sdes.send }, function sendCtmrInfoSDE () {lpTag.sdes.send({ type: "ctmrinfo", info: { customerId: sub }})})
    // disable the button
    document.getElementById('pushIdentity').disabled = true;
    document.getElementById('stepUp').disabled = true;
    // if this came from a button click and the checkbox is checked, do the newPage
    if (fromButton && document.getElementById('authNewPageAfterIdentity').checked) newPage()
}

function stepUp (sub) {
    sub = sub || randomSub()
    window.params.append('sub', sub)
    history.replaceState(null, null, `?${window.params.toString()}`)
    location.reload()
}

lpGetAuthenticationToken = function (cb) {
    if (window._auth.identity && window._auth.identity.sub) {
        if (document.getElementById('authYourJWT').value) return cb(document.getElementById('authYourJWT').value)
        if (document.getElementById('authHardCode').checked) return cb(document.getElementById('authHardCodedJWT').value)

        let headers = new Headers();
        headers.append("Content-Type", "application/json");

        let payload = {
            iss: window._auth.identity.iss,
            sub: window._auth.identity.sub
        }

        if (document.getElementById('jwtGivenName').value) payload.given_name = document.getElementById('jwtGivenName').value
        if (document.getElementById('jwtFamilyName').value) payload.family_name = document.getElementById('jwtFamilyName').value
        if (document.getElementById('jwtEmail').value) payload.email = document.getElementById('jwtEmail').value
        // if (document.getElementById('jwtGender').value) payload.gender = document.getElementById('jwtGender').value
        if (document.getElementById('jwtPreferredUserName').value) payload.preferred_username = document.getElementById('jwtPreferredUserName').value
        if (document.getElementById('jwtPhoneNumber').value) payload.phone_number = document.getElementById('jwtPhoneNumber').value

        let body = JSON.stringify({ payload, ttl: 600 });

        let requestOptions = {
            method: 'POST',
            headers, body
        };

        fetch(`https://${authDomain}/api/auth/token`, requestOptions)
          .then(response => response.text().then(text => cb(text)))
          .catch(error => console.log('error', error));
    } else {
        cb(null, 'unauthenticated')
    }
}

lpGetAuthenticationCode = function (cb) {
    if (window._auth.identity && window._auth.identity.sub) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");

        let payload = {
            iss: window._auth.identity.iss,
            sub: window._auth.identity.sub
        }

        if (document.getElementById('jwtGivenName').value) payload.given_name = document.getElementById('jwtGivenName').value
        if (document.getElementById('jwtFamilyName').value) payload.family_name = document.getElementById('jwtFamilyName').value
        if (document.getElementById('jwtEmail').value) payload.email = document.getElementById('jwtEmail').value
        // if (document.getElementById('jwtGender').value) payload.gender = document.getElementById('jwtGender').value
        if (document.getElementById('jwtPreferredUserName').value) payload.preferred_username = document.getElementById('jwtPreferredUserName').value
        if (document.getElementById('jwtPhoneNumber').value) payload.phone_number = document.getElementById('jwtPhoneNumber').value

        let body = JSON.stringify({ payload, ttl: 600 });

        let requestOptions = {
            method: 'POST',
            headers, body
        };

        fetch(`https://${authDomain}/api/auth/code`, requestOptions)
          .then(response => response.text().then(text => cb(text)))
          .catch(error => console.log('error', error));
    } else {
        cb(null, 'unauthenticated')
    }
}

function randomSub () {
    return Math.random().toString(36).substring(2)
}

