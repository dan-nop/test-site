//Add each language's widget toggle phrase to this array. It will be used to check to see if the widget needs to toggle.
//This is here due to the fact that this script may not have any access to a specific language variable or information.
//This will never be triggered by the events caused when reloading a page or navigating.
//This will only trigger once off of a single hook call.

lpTag = window.lpTag || {};
lpTag.external = lpTag.external || {};
lpTag.external.agentInitWidget = {
    activationRegex: /Widget Activate: (https:\/\/.+)/g,
    firstMessage: true,
    isWidgetDisplayed: function () { return document.querySelector(".lp_slider_open") != null },
    processLines: function (lineData) {
        // console.log(lineData);

        // is this data from the current conversation?
        var currentConversation = true;
        lineData.data.lines.forEach(function (line) {
            if (line.history) currentConversation = false;
        })

        var toggleElement = document.querySelector("button[data-lp-point='widget_sdk']");
        if (toggleElement) {
            // console.log("first message", lpTag.external.agentInitWidget.firstMessage);

            lineData.data.lines.forEach(function (line) {
                if (line.source === "agent") {
                    let match = lpTag.external.agentInitWidget.activationRegex.exec(line.text);
                    // console.log(match);
                    if (match) {
                        // open the widget if this line is from the current conversation and this is not the initial
                        // burst of messages from a page refresh
                        if (currentConversation && !lpTag.external.agentInitWidget.firstMessage) {
                            if (!lpTag.external.agentInitWidget.isWidgetDisplayed()) toggleElement.click()
                            var iframeElement = document.querySelector('div#LP_WidgetViewController_1>iframe');
                            iframeElement.src = match[1]
                        }
                        // if this was the first burst of messages set firstMessage to false so the next will be processed
                        if (currentConversation && lpTag.external.agentInitWidget.firstMessage) {
                            lpTag.external.agentInitWidget.firstMessage = false;
                        }
                        // remove the line from the visitor's view
                        delete line.text;
                    }
                }
            });

        }

    }
}

lpTag.hooks = lpTag.hooks || [];
lpTag.hooks.push({
    name: "AFTER_GET_LINES",
    callback: lpTag.external.agentInitWidget.processLines
});