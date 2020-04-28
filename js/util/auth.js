window.params = window.params || new URLSearchParams(window.location.search);

if (params.has('sub')) {
    lpTag.sdes.push({'type': 'ctmrinfo', 'info': { customerId : params.get('sub') }});
} else if (params.has('randomsub')) {
    lpTag.sdes.push({'type': 'ctmrinfo', 'info': { customerId : Math.random().toString(36).substring(2) }});
}