waitForTag(customEngagement);

function customEngagement () {
    lpTag.external = lpTag.external || {};
    lpTag.external.custEngagement = {
        // new error
        error: 'This is a long sample error message that can be inserted into the engagement when necessary.  It will wrap and stuff.',
        // identifying string from engagement name
        engNameString: 'ContextualError',
        // this is the "opener" configured on the error engagment / window which needs to be replaced with the new string
        placeholder: 'We see you are experiencing issues with your order. Chat now to connect to a live agent for further assistance.',
        customizeProactive: function (data) {
            // is this an engagement we want to customize?
            if (!data.eng.engData.engagementName.includes(lpTag.external.custEngagement.engNameString)) return false;
            // select the engagement element on the page
            let element = document.getElementById(data?.eng?.mainContainer?.id)
            // find the text node containing the placeholder string
            let textNode = lpTag.external.custEngagement._findNode(lpTag.external.custEngagement.placeholder, element)
            // replace the text node with a new one with the new wording
            textNode.parentNode.replaceChild(document.createTextNode(lpTag.external.custEngagement.error || textNode.innerText), textNode)
        },
        customizeOpener: function () {
            // select the transcript area of the conversation window
            let transcriptAreas = document.querySelectorAll("[data-lp-point='lines_area']");
            // add the mutation observer to the transcript area
            transcriptAreas.forEach(area => {
                lpTag.external.custEngagement._transcriptObserver.observe(area, { childList: true })
            })
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
        },
        _transcriptObserver: new MutationObserver(mutationsList => {
            for (let mutation of mutationsList) {
                if (mutation.addedNodes.length > 0) {
                    // find a text node containing the placeholder string
                    let textNode = lpTag.external.custEngagement._findNode(lpTag.external.custEngagement.placeholder, mutation.target)
                    // replace the text node with a new one with the new wording
                    if (textNode) textNode.parentNode.replaceChild(document.createTextNode(lpTag.external.custEngagement.error || textNode.innerText), textNode)
                }
            }
        })
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
