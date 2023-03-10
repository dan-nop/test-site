// todo: find a way to make this work. promises?
function waitForTrue (test, callback) {
    if (test()) callback();
    else {
        window._intervals = window._intervals || {};
        console.log(`delaying execution of ${callback.name} until ${test.name}`)
        window._intervals[test.name][callback.name] = window.setInterval(test, callback => {
            if (test()) {
                window.clearInterval(window._intervals[test.name][callback.name]);
                callback();
            } else {
                console.log(`delaying execution of ${callback.name} until ${test.name}`)
            }
        },500);
    }
}