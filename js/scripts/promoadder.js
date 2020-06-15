lpTag = window.lpTag || {};
// putting this stuff in lpTag.external.promoAdder so as not to pollute the global namespace
lpTag.external = lpTag.external || {};
lpTag.external.promoAdder = {
    // here you will define the regular expression that indicates that a promo adding agent message was sent
    activationRegex: /Add Promo: .+/,
    // this makes sure that the first burst of messages on a page load doesn't trigger the widget based on prior qualifying agent messages
    firstMessage: true,
    // function to process incoming conversation lines
    processLines: function (lineData) {
        // console.log("firstMessage", lpTag.external.promoAdder.firstMessage)
        // console.log("lineData", lineData);
        var lines = lineData && lineData.data && lineData.data.lines;
        if (!lines) return false;
        // console.log("lines", lines)

        // is this data from the current conversation?
        var currentConversation = true;
        for (var i = 0, l = lines.length; i < l; i++) {
            if (lines[i].history) {
                currentConversation = false;
                break;
            }
        }
        // console.log("currentConversation", currentConversation);

        // cycle through lines, hide those that match, and if this is a new agent message from the current conversation do the promo adding stuff
        lines.forEach(function (line) {
            if (line.source === "agent") {
                let match = lpTag.external.promoAdder.activationRegex.exec(line.text);
                // console.log("match", match);
                if (match) {
					console.log('run script here')
					// report this event here
					delete line.text;
                }
            }
        })

        // if this was the first set of messages from the initial page load set that flag to false now
        if (lpTag.external.promoAdder.firstMessage) {
            lpTag.external.promoAdder.firstMessage = false;
        }
        // console.log("firstMessage", lpTag.external.promoAdder.firstMessage)
    }
}

// attach the hook
lpTag.hooks = lpTag.hooks || [];
lpTag.hooks.push({
    name: "AFTER_GET_LINES",
    callback: lpTag.external.promoAdder.processLines
});
