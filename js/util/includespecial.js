window.params = window.params || new URLSearchParams(window.location.search);
let scripts = [];

if (params.get('scripts')) {
    scripts = params.get('scripts').split(',')
}
scripts.forEach(script => {
    let s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = 'js/special/' + script + '.js';
    document.head.appendChild(s)
});