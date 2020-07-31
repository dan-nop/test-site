const CONST = {
    TEXT_INPUT_PLACEHOLDER: "Type here",
    NEW_AGENT_TYPING_INDICATOR: "Incoming message",
    OLD_AGENT_TYPING_INDICATOR: "Agent is typing...",
    CHAT_WITH_US: 'Chat with us',
    MESSAGE_US: 'Message us'
}

// change text input placeholder
let txtInputObserver = new MutationObserver(mutationsList => {
    for(let mutation of mutationsList) {
        // console.log(mutation);
        switch (mutation.attributeName) {
            case "placeholder":
                if (mutation.target.placeholder !== CONST.TEXT_INPUT_PLACEHOLDER) {
                    mutation.target.placeholder = CONST.TEXT_INPUT_PLACEHOLDER;
                    mutation.target.ariaLabel = CONST.TEXT_INPUT_PLACEHOLDER;
                }
        }
    }
});

// change window header
let headerObserver = new MutationObserver(mutationsList => {
    for (let mutation of mutationsList) {
        // console.log(mutation);
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 3 && node.textContent === CONST.MESSAGE_US) {
                node.textContent = CONST.CHAT_WITH_US
            }
        })
    }
});

// hide inspicio button
let inspicioObserver = new MutationObserver(mutationsList => {
    for (let mutation of mutationsList) {
        // console.log(mutation.target);
        mutation.target.style.display = 'none';
    }
});

// change "agent is typing" message
let agentTypingObserver = new MutationObserver(mutationsList => {
    for (let mutation of mutationsList) {
        // console.log(mutation);
        if(mutation.target.textContent === CONST.OLD_AGENT_TYPING_INDICATOR) {
            mutation.target.textContent = CONST.NEW_AGENT_TYPING_INDICATOR;
        }
    }
});

// Customize unified window based on its state
function windowCustomizationInit () {
    window.lpTag = window.lpTag || {};
    lpTag.external = lpTag.external || {};
    lpTag.events.bind({
        eventName: "state",
        appName: "lpUnifiedWindow",
        func: function processThis(data) {
            let txtInput = document.querySelector("[data-lp-point='chat_input']");
            if (txtInput) txtInputObserver.observe(txtInput, { attributes: true });

            let headers = document.querySelectorAll("[data-lp-point='headerText']");
            headers.forEach(header => headerObserver.observe(header, { childList: true }));

            let inspicio = document.querySelectorAll("[data-lp-point='widget_sdk']");
            inspicio.forEach(inspicio => inspicioObserver.observe(inspicio, { attributes: true}));

            let agentTyping = document.querySelectorAll("[data-lp-point='agent_is_typing']");
            agentTyping.forEach(agentTyping => agentTypingObserver.observe(agentTyping, { attributes: true}));
        }
    });
}

waitForTag(windowCustomizationInit);