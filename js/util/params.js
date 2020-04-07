window.lpTag = window.lpTag || {};
window.params = window.params || new URLSearchParams(window.location.search);

lpTag.site = params.get('account') || '85085921';

if (params.has('alpha')) {
    lpTag.ovr = {
        domain: 'lptag-a.liveperson.net',
        tagjs: 'tags-a.liveperson.net'
    }
}

if (params.get('sections')) {
    lpTag.section = params.get('sections').split(',')
}

if (params.get('autostart') === 'false') {
    lpTag.autoStart = false;
}