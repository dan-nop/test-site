function waitForTag (callback) {
    if (_waitForTagTest()) callback();
    else {
        window._intervals = window._intervals || {};
        console.log(`delaying execution of ${callback.name} ${lpTag._timing && lpTag._timing.start ? ' :: '+(new Date().getTime() - lpTag._timing.start) : ''}`)
        window._intervals[callback.name] = window.setInterval(() => {
            if (_waitForTagTest()) {
                window.clearInterval(window._intervals[callback.name]);
                callback();
            } else {
                console.log(`delaying execution of ${callback.name} ${lpTag._timing && lpTag._timing.start ? ' :: '+(new Date().getTime() - lpTag._timing.start) : ''}`)
            }
        },500);
    }
}

function _waitForTagTest () { return window.lpTag?.isDom }