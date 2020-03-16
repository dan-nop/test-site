const hooks = [
    'AFTER_GET_SURVEY',
    'BEFORE_SUBMIT_SURVEY',
    'BEFORE_SEND_VISITOR_LINE',
    'AFTER_GET_SURVEY',
    'BEFORE_SEND_SDE'
];

function log (body) {
    let _body = typeof body === 'string' ?
      body : JSON.stringify(body);
}

function init () {
    hooks.map(hook => {
        lpTag.hooks.push({
            name: hook,
            callback: log
        })
    })
}

if (window.lpTag) init();
else let hooksInterval = window.setInterval(() => {
    if (window.lpTag) {
        window.clearInterval(hooksInterval);
        init();
    }
});