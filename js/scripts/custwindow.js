const CONST = {
    TEXT_INPUT_PLACEHOLDER: "Type here",
    AGENT_TYPING_INDICATOR: "Incoming message"
}

waitForTag(windowCustomizationInit);

// change the text input placeholder when it changes
let txtInputObserver = new MutationObserver((mutationsList, observer) => {
    for(let mutation of mutationsList) {
        switch (mutation.attributeName) {
            case "placeholder":
                console.log(mutation);
                if (mutation.target.placeholder !== CONST.TEXT_INPUT_PLACEHOLDER) {
                    mutation.target.placeholder = CONST.TEXT_INPUT_PLACEHOLDER;
                    mutation.target.ariaLabel = CONST.TEXT_INPUT_PLACEHOLDER;
                }
        }
    }
})

// Customize unified window based on its state
function windowCustomizationInit () {
    lpTag.events.bind({
        eventName: "state",
        appName: "lpUnifiedWindow",
        func: function processThis(data, eventInfo) {
            let state = data.state;
            console.log("unified window state: "+data.state);
            switch (state) {
                case "waiting":
                case "chatting":
                case "ended":
                case "interactive":
                    let txtInput = document.querySelector("[data-lp-point='chat_input']");
                    if (txtInput) txtInputObserver.observe(txtInput, { attributes: true });
                    break;
            }
        }
    });
}