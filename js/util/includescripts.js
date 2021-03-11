window.params = window.params || new URLSearchParams(window.location.search);
let scripts = [];
let styles = [];

if (params.get('scripts')) {
    scripts = params.get('scripts').split(',')
}
scripts.forEach(script => {
    let s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = 'js/scripts/' + script + '.js';
    document.head.appendChild(s);
});

if (params.get('styles')) {
    styles = params.get('styles').split(',')
}

styles.forEach(style => {
    let s = document.createElement('link');
    s.type = 'text/css';
    s.rel = 'stylesheet';
    s.href = 'css/styles/' + style + '.css';
    document.head.appendChild(s);
});