// Customize unified window based on its state
function windowCustomizationInit () {
    window.lpTag = window.lpTag || {};
    lpTag.external = lpTag.external || {};
    lpTag.external.custWindow = {
        CONST: {
            TEXT_INPUT_PLACEHOLDER: "Type here",
            NEW_AGENT_TYPING_INDICATOR: "Incoming message",
            OLD_AGENT_TYPING_INDICATOR: "Agent is typing...",
            CHAT_WITH_US: 'Chat with us',
            MESSAGE_US: 'Message us'
        },
        addObservers: function () {
            let txtInput = document.querySelector("[data-lp-point='chat_input']");
            if (txtInput) lpTag.external.custWindow._txtInputObserver.observe(txtInput, { attributes: true });

            let headers = document.querySelectorAll("[data-lp-point='headerText']");
            headers.forEach(header => lpTag.external.custWindow._headerObserver.observe(header, { childList: true }));

            let EWWButtons = document.querySelectorAll("[data-lp-point='widget_sdk']");
            EWWButtons.forEach(button => lpTag.external.custWindow._inspicioObserver.observe(button, { attributes: true}));

            let agentTypings = document.querySelectorAll("[data-lp-point='agent_is_typing']");
            agentTypings.forEach(agentTyping => lpTag.external.custWindow._agentTypingObserver.observe(agentTyping, { attributes: true}));
        },
        _txtInputObserver: new MutationObserver(mutationsList => {
            for(let mutation of mutationsList) {
                // console.log(mutation);
                switch (mutation.attributeName) {
                    case "placeholder":
                        if (mutation.target.placeholder !== lpTag.external.custWindow.CONST.TEXT_INPUT_PLACEHOLDER) {
                            mutation.target.placeholder = lpTag.external.custWindow.CONST.TEXT_INPUT_PLACEHOLDER;
                            mutation.target.ariaLabel = lpTag.external.custWindow.CONST.TEXT_INPUT_PLACEHOLDER;
                        }
                }
            }
        }),
        _headerObserver: new MutationObserver(mutationsList => {
            for (let mutation of mutationsList) {
                // console.log(mutation);
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 3 && node.textContent === lpTag.external.custWindow.CONST.MESSAGE_US) {
                        node.textContent = lpTag.external.custWindow.CONST.CHAT_WITH_US
                    }
                })
            }
        }),
        _inspicioObserver: new MutationObserver(mutationsList => {
            for (let mutation of mutationsList) {
                // console.log(mutation.target);
                mutation.target.style.display = 'none';
            }
        }),
        _agentTypingObserver: new MutationObserver(mutationsList => {
            for (let mutation of mutationsList) {
                // console.log(mutation);
                if(mutation.target.textContent === lpTag.external.custWindow.CONST.OLD_AGENT_TYPING_INDICATOR) {
                    mutation.target.textContent = lpTag.external.custWindow.CONST.NEW_AGENT_TYPING_INDICATOR;
                }
            }
        }),
    }
    lpTag.events.bind({
        eventName: "state",
        appName: "lpUnifiedWindow",
        func: lpTag.external.custWindow.addObservers
    });
}

waitForTag(windowCustomizationInit);