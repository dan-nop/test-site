function init () {
    lpTag.hooks.push({
        name: 'BEFORE_SEND_VISITOR_LINE',
        callback: opts => {
            if (opts && opts.data && opts.data.line && opts.data.line.text === '/convinfo') {
                let engagementEvents = lpTag.events.hasFired('LE_ENGAGER', '*');
                let convEvents = lpTag.events.hasFired('lpUnifiedWindow', '*');
                let renderEvents = lpTag.events.hasFired('RENDERER_STUB','AFTER_CREATE_ENGAGEMENT_INSTANCE');

                let engId = getLatest(engagementEvents, 'engagementId');
                let skillId = getLatest(convEvents, 'skill');
                let engagementConf = findRenderEventConf(renderEvents, engId) || {};

                let data = {
                    siteId: lpTag.site,
                    sections: lpTag.section,
                    campaign: getLatest(engagementEvents, 'campaignId'),
                    engagement: engagementConf.name || engId,
                    window: getLatest(engagementEvents, 'windowId'),
                    state: getLatest(convEvents, 'state'),
                    agentName: getLatest(convEvents, 'agentName'),
                    agentId: getLatest(convEvents, 'agentId'),
                    convId: getLatest(convEvents, 'conversationId'),
                    skill: engagementConf.skillName || skillId,
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
    let event = array.reverse().find(item => {
        return item.data && item.data[datum]
    });
    if (event) return event.data[datum];
    else return undefined;
}

function findRenderEventConf (renderEvents, engagementId) {
     let event = renderEvents.find(ev => {
        return ev && ev.data && ev.data.conf && (ev.data.conf.id === engagementId)
    });
    return event.data.conf
}