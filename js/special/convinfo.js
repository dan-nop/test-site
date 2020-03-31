function init () {
    lpTag.hooks.push({
        name: 'BEFORE_SEND_VISITOR_LINE',
        callback: opts => {
            if (opts && opts.data && opts.data.line && opts.data.line.text === '/convinfo') {
                console.log(opts.data.line.text);
                let engagementEvents = lpTag.events.hasFired('LE_ENGAGER', '*');
                let convEvents = lpTag.events.hasFired('lpUnifiedWindow', '*');

                let data = {
                    siteId: lpTag.site,
                    sections: lpTag.section,
                    campaign: getLatest(engagementEvents, 'campaignId'),
                    engagement: getLatest(engagementEvents, 'engagementId'),
                    window: getLatest(engagementEvents, 'windowId'),
                    state: getLatest(convEvents, 'state'),
                    agentName: getLatest(convEvents, 'agentName'),
                    agentId: getLatest(convEvents, 'agentId'),
                    convId: getLatest(convEvents, 'conversationId'),
                    skillId: getLatest(convEvents, 'skill'),
                    visitorId: getLatest(convEvents, 'visitorId')
                };

                let div = document.createElement('div');
                div.id = 'lp_line_convinfo';
                div.innerText = JSON.stringify(data, null, '\t');
                document.getElementsByClassName('lpc_transcript')[0].appendChild(div);

                opts.data.line.text = '';
                let scrollable = document.getElementsByClassName('lp_location_center')[0];
                scrollable.scrollTop = scrollable.scrollHeight

            }
        }
    })
}

waitForTag(init);

function getLatest (array, datum) {
    let _array = array.reverse();
    let event = _array.find(item => {
        return item.data && item.data[datum]
    });
    if (event) return event.data[datum];
    else return undefined;
}
