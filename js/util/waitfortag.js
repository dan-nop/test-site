function waitForTag (callback) {
    if (window.lpTag.loaded) callback();
    else {
        window._intervals = window._intervals || {};
        console.log(`delaying execution of ${callback.name} ${lpTag._timing && lpTag._timing.start ? ' :: '+(new Date().getTime() - lpTag._timing.start) : ''}`)
        window._intervals[callback.name] = window.setInterval(() => {
            if (window.lpTag && window.lpTag.loaded) { 
                window.clearInterval(window._intervals[callback.name]);
                callback();
            } else {
                console.log(`delaying execution of ${callback.name} ${lpTag._timing && lpTag._timing.start ? ' :: '+(new Date().getTime() - lpTag._timing.start) : ''}`)
            }
        },500);
    }
}