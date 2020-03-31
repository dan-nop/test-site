function waitForTag (callback) {
    if (window.lpTag) callback();
    else {
        let _interval = window.setInterval(() => {
            if (window.lpTag) {
                window.clearInterval(_interval);
                callback();
            }
        },500);
    }
}