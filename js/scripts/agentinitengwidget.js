lpTag = window.lpTag || {};
// putting this stuff in lpTag.external.agentInitWidget so as not to pollute the global namespace
lpTag.external = lpTag.external || {};
lpTag.external.agentInitWidget = {
    // here you will define the regular expression that indicates that a widget link has been sent
    activationRegex: /Please <a href="(https:\/\/.+)" target="_parent">Click Here<\/a> to enter your credit check information\. Completion of this form is permission to run your credit\./,
    // this makes sure that the first burst of messages on a page load doesn't trigger the widget based on prior qualifying agent messages
    firstMessage: true,
    // function to determine whether the widget is already displayed
    isWidgetDisplayed: function () { return document.querySelector(".lp_slider_open") != null },
    // function to process incoming conversation lines
    processLines: function (lineData) {
        // console.log("firstMessage", lpTag.external.agentInitWidget.firstMessage)
        console.log("lineData", lineData);
        var lines = lineData && lineData.data && lineData.data.lines;
        if (!lines) return false;
        // console.log("lines", lines)

        // identify whether the widget is available on this window
        var toggleElement = document.querySelector("button[data-lp-point='widget_sdk']");
        if (!toggleElement) return false;
        // console.log("toggleElement", toggleElement)

        // is this data from the current conversation?
        var currentConversation = true;
        for (var i = 0, l = lines.length; i < l; i++) {
            if (lines[i].history) {
                currentConversation = false;
                break;
            }
        }
        // console.log("currentConversation", currentConversation);

        // cycle through lines, hide those that match, and if this is a new agent message from the current conversation pop the widget and populate the src url
        lines.forEach(function (line) {
            if (line.source === "agent") {
                let match = lpTag.external.agentInitWidget.activationRegex.exec(line.text);
                console.log("match", match);
                if (match) {
                    if (currentConversation && !lpTag.external.agentInitWidget.firstMessage) {
                        if (!lpTag.external.agentInitWidget.isWidgetDisplayed()) toggleElement.click()
                        var iframeElement = document.querySelector('div#LP_WidgetViewController_1>iframe');
                        iframeElement.src = match[1]
                    }
                    // remove the line from the conversation (optional)
                    delete line.text;
                }
            }
        })

        // if this was the first set of messages from the initial page load set that flag to false now
        if (lpTag.external.agentInitWidget.firstMessage) {
            lpTag.external.agentInitWidget.firstMessage = false;
        }
        // console.log("firstMessage", lpTag.external.agentInitWidget.firstMessage)
    }
}

// attach the hook
lpTag.hooks = lpTag.hooks || [];
lpTag.hooks.push({
    name: "AFTER_GET_LINES",
    callback: lpTag.external.agentInitWidget.processLines
});