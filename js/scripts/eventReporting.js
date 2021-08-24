function initEventReporter () {
    lpTag.external = lpTag.external || {};
    lpTag.external.eventReporter = lpTag.external.eventReporter || {
        offerClickCallback: () => {
            console.log('++clicked')
        },
        windowStateCallback: (data) => {
            if (data && data.state === 'waiting') {
                // by only adding this listener when state = waiting we only add this event binding if the window loads without an active conversation (i.e. not during navigation with active convo)
                document.getElementsByClassName('lpc_composer__text-area')[0].addEventListener('input', lpTag.external.eventReporter._inputListener);
                // by only binding to the state = chatting event after state = waiting we only trigger this if we go from waiting to chatting in this page
                lpTag.events.bind({
                    appName: 'lpUnifiedWindow',
                    eventName: 'state',
                    func: (data) => {
                        if (data.state === 'chatting' && !lpTag.external.eventReporter._started) {
                            // lpTag.external.eventReporter._started = true;
                            console.log('++started');
                        }
                    },
                    triggerOnce: true
                })
            }
            // if the visitor ends the conversation we probably want to reset the "dirty" state of the input so that if they start typing again we fire an event
            if (data && data.state === 'ended') {
                lpTag.external.eventReporter._inputDirty = false;
                // lpTag.external.eventReporter._started = false;
            }
        },
        _inputListener: (data) => {
            if (data && data.inputType === 'insertText' && !lpTag.external.eventReporter._inputDirty) {
                lpTag.external.eventReporter._inputDirty = true;
                console.log('++typed');
            }
        }
    }

    lpTag.events.bind('LP_OFFERS','OFFER_CLICK', lpTag.external.eventReporter.offerClickCallback)
    lpTag.events.bind('lpUnifiedWindow','state', lpTag.external.eventReporter.windowStateCallback)
}

// Cases to think about:
// Visitor clicks engagement, types, doesn't send, navigates, then types again (will get a click and a type on page one, then a type on page two, unless you persist the "hastyped" indicator in storage or only listen to input after click, but what if....
// ... visitor clicks engagement, doesn't type, navigates, then types (will get a click on one page, a type on the next page)

waitForTag(initEventReporter);