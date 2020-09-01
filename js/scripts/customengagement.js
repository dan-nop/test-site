waitForTag(customEngagement);

function customEngagement () {
    lpTag.external = lpTag.external || {};
    lpTag.external.custEngagement = {
        // identifying string from engagement name.  If the engagement name doesn't contain this string we won't modify it
        engNameString: 'ContextualError',
        // this is the "opener" configured on the error engagement / window which needs to be replaced with the new string
        placeholder: 'We see you are experiencing issues with your order. Chat now to connect to a live agent for further assistance.',
        // event callback for displayed engagement, which replaces the creative text with the new error message
        customizeProactive: function (data) {
            // is this an engagement we want to customize?
            if (!data.eng.engData.engagementName.includes(lpTag.external.custEngagement.engNameString)) return false;
            // do we have an error message?
            let error = lpTag.external.custEngagement._getErrorText();
            if (!error) return false;
            // select the engagement element on the page
            let element = document.getElementById(data?.eng?.mainContainer?.id)
            // find the text node containing the placeholder string
            let textNode = lpTag.external.custEngagement._findNode(lpTag.external.custEngagement.placeholder, element)
            // replace the text node with a new one containing the error message
            textNode.parentNode.replaceChild(document.createTextNode(error), textNode)
        },
        // event callback for the window opening, which replaces the welcome message with the new error message
        customizeOpener: function () {
            // do we have an error message?
            let error = lpTag.external.custEngagement._getErrorText();
            if (!error) return false;

            // select the transcript area(s) of the conversation window(s)
            let transcriptAreas = document.querySelectorAll("[data-lp-point='lines_area']");
            if (!transcriptAreas) return false;

            // create the observer
            let transcriptObserver = new MutationObserver(mutationsList => {
                for (let mutation of mutationsList) {
                    if (mutation.addedNodes.length > 0) {
                        // find a text node containing the placeholder string
                        let textNode = lpTag.external.custEngagement._findNode(lpTag.external.custEngagement.placeholder, mutation.target)
                        // replace the text node with a new one containing the error message
                        if (textNode) textNode.parentNode.replaceChild(document.createTextNode(error), textNode)
                    }
                }
            })

            // add the mutation observer to the transcript area(s)
            transcriptAreas.forEach(area => {
                transcriptObserver.observe(area, { childList: true })
            })
        },
        // Get the text of the error message from wherever you have it stored.
        _getErrorText: function () {
            return 'This is a long sample error message that can be inserted into the engagement when necessary.  It will wrap and stuff.'
        },
        // find the text node with the placeholder error text
        _findNode: function (text, currentNode) {
            if (currentNode.nodeType === 3 && currentNode.textContent.includes(text)) {
                return currentNode;
            } else {
                for (let i = 0; i < currentNode.childNodes.length; i += 1) {
                    let currentChild = currentNode.childNodes[i];
                    let result = lpTag.external.custEngagement._findNode(text, currentChild);
                    if (result !== false) return result;
                }
                return false;
            }
        }
    }

    // customize the engagement creative
    lpTag.events.bind({
        eventName: 'AFTER_CREATE_ENGAGEMENT_INSTANCE',
        appName: 'RENDERER_STUB',
        func: lpTag.external.custEngagement.customizeProactive
    });

    // customize the opener
    lpTag.events.bind({
        eventName: "state",
        appName: "lpUnifiedWindow",
        func: lpTag.external.custEngagement.customizeOpener
    });
}
