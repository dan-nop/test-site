function init () {
    lpTag.hooks.push({
        name: 'BEFORE_SEND_VISITOR_LINE',
        callback: opts => {
            if (opts && opts.data && opts.data.line && opts.data.line.text === '/convinfo') {
                console.log(opts.data.line.text);
                let engagement = lpTag.events.hasFired('LE_ENGAGER', 'OPEN')[0].data;
                let convEvents = lpTag.events.hasFired('lpUnifiedWindow', 'conversationInfo');
                let agentInfo = convEvents.find(c => { return (c.data.agentId || c.data.agentName) }) || {};
                let convInfo = convEvents.find(c => { return c.data.conversationId }) || {};
                let skillInfo = convEvents.find(c => { return c.data.skill }) || {};

                let data = {
                    siteId: lpTag.site,
                    sections: lpTag.section,
                    campaign: engagement.campaignId,
                    engagement: engagement.engagementId,
                    window: engagement.windowId,
                    agentName: agentInfo.data.agentName,
                    agentId: agentInfo.data.agentId,
                    convId: convInfo.data.conversationIÍd,
                    skill: skillInfo.data.skill

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

