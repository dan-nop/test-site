window.params = window.params || new URLSearchParams(window.location.search);
let scripts = [];

if (params.get('scripts')) {
    scripts = params.get('scripts').split(',')
}
scripts.forEach(script => {
    let s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = 'js/scripts/' + script + '.js';
    document.head.appendChild(s);
    let p = document.createElement('p');
    p.innerText = `${script}.js loaded`;
    setTimeout(() => document.body.appendChild(p),1000);
});