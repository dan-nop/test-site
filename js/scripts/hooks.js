const hooks = [
    'AFTER_GET_SURVEY',
    'BEFORE_SUBMIT_SURVEY',
    'BEFORE_SEND_VISITOR_LINE',
    'AFTER_GET_LINES',
    'BEFORE_SEND_SDE',
    'BEFORE_ENG_CHANNEL_OPEN',
    'BEFORE_ENG_DISPLAY'
];

function initHooks () {
    hooks.forEach(hook => {
        lpTag.hooks.push({
            name: hook,
            callback: data => console.log(data)
        })
    })
}

waitForTag(initHooks);