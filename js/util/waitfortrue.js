window._intervals = window._intervals || {};
function waitForTrue (test, callback, interval = 1000) {
    if (test()) callback();
    else {
        let testName = test.name || 'anonymous';
        let callbackName = callback.name || 'anonymous';
        console.log(`delaying execution of ${callbackName} until ${testName}`)
        window._intervals[testName] = window._intervals[testName] || {};
        window._intervals[testName][callback.name || 'anonymous'] = window.setInterval((test, callback) => {
            let testName = test.name || 'anonymous';
            let callbackName = callback.name || 'anonymous';
            if (test()) {
                console.log(`${testName} passed, executing ${callbackName}`)
                window.clearInterval(window._intervals[testName][callbackName]);
                callback();
            } else {
                console.log(`delaying execution of ${callbackName} until ${testName}`)
            }
        }, interval, test, callback);
    }
}

function waitForTag(callback) {
    waitForTrue(function _waitForTagTest () { return window.lpTag?.isDom }, callback)
}