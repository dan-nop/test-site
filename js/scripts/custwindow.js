function windowCustomizationInit () {
    // Customize unified window based on its state
    lpTag.events.bind({
        eventName: "state",
        appName: "lpUnifiedWindow",
        func: function processThis(data, eventInfo) {
            let state = data.state;
            console.log("unified window state: "+data.state);
            switch (state) {
                case "init":
                    let txtInput = document.querySelector("[data-lp-point='chat_input']");
                    txtInput.ariaLabel = "new text here";
                    txtInput.placeholder = "new text here";
                    console.log(state & ": *** NEW TEXT HERE***");
                    break;
                case "waiting":
                    break;
                case "preChat" :
                    break;
                case "chatting":
                case "interactive":
                    break;
                case "offline" :
                    break;
                case "ended":
                    break;
            }
        }
    });
}

waitForTag(windowCustomizationInit);