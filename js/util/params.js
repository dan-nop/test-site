window.lpTag = window.lpTag || {};
lpTag.external = lpTag.external || {}
window.params = window.params || new URLSearchParams(window.location.search);

// set account
lpTag.site = params.get('account') || '85085921';

// alpha tag
if (params.has('alpha')) lpTag.ovr = { domain: 'lptag-a.liveperson.net', tagjs: 'tags-a.liveperson.net' }

// sections
if (params.get('sections')) lpTag.section = params.get('sections').split(',')

// autostart
if (params.get('autostart') === 'false') lpTag.autoStart = false;

// tag version
lpTag.external._tagV = '1.10'
if (params.get('tag')) {
    let versions = ['1.0','1.1','1.2','1.3','1.4','1.5','1.6','1.7','1.8','1.9','1.10']
    let _tag = params.get('tag')
    if (versions.indexOf(_tag) > -1) lpTag.external._tagV = _tag
}

let s = document.createElement('script');
s.type = 'text/javascript';
s.src = 'js/lptag/' + lpTag.external._tagV + '.js';
document.head.appendChild(s)

// button divs

if (params.has('divids')) {
    document.addEventListener('DOMContentLoaded', () => {
        let ids = params.get('divids').split(',');
        ids.forEach(id => {
            let a = document.createElement('div'), b = document.createElement('div'), c = document.createElement('div');
            a.id = id+'_label';
            a.innerText = 'container for '+id;
            b.id = id+'_container';
            b.className = 'divcontainer';
            c.id = id;
            document.body.appendChild(a);
            a.appendChild(b);
            b.appendChild(c);
        });
    })
}