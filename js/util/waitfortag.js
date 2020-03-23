function waitForTag (callback) {
    if (window.lpTag) callback();
    else {
        let hooksInterval = window.setInterval(() => {
            if (window.lpTag) {
                window.clearInterval(hooksInterval);
                callback();
            }
        },500);
    }
}