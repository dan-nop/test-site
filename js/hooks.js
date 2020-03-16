const hooks = [
    'AFTER_GET_SURVEY',
    'BEFORE_SUBMIT_SURVEY',
    'BEFORE_SEND_VISITOR_LINE',
    'AFTER_GET_LINES',
    'BEFORE_SEND_SDE'
];

function init () {
    console.log('initing');
    hooks.forEach(hook => {
        lpTag.hooks.push({
            name: hook,
            callback: data => console.log(data)
        })
    })
}

if (window.lpTag) init();
else {
    console.log('intervaling');
    let hooksInterval = window.setInterval(() => {
        console.log('checking');
        if (window.lpTag) {
            window.clearInterval(hooksInterval);
            init();
        }
    },500);
}