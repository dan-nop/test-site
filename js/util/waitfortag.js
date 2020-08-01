function waitForTag (callback) {
    if (window.lpTag.loaded) callback();
    else {
        console.log(`delaying execution of ${callback.name} ${lpTag._timing && lpTag._timing.start ? ' :: '+(new Date().getTime() - lpTag._timing.start) : ''}`)
        let _interval = window.setInterval(() => {
            if (window.lpTag && window.lpTag.loaded) {
                window.clearInterval(_interval);
                callback();
            } else {
                console.log(`delaying execution of ${callback.name} ${lpTag._timing && lpTag._timing.start ? ' :: '+(new Date().getTime() - lpTag._timing.start) : ''}`)
            }
        },500);
    }
}