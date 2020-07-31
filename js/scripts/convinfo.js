waitForTag(convInfoInit);

function convInfoInit () {
    lpTag.external = lpTag.external || {};
    lpTag.external.convInfo = {
        // this can be called from the console!
        getData: function () {
            let engagementEvents = lpTag.events.hasFired('LE_ENGAGER', '*')
            let convEvents = lpTag.events.hasFired('lpUnifiedWindow', 'conversationInfo')
            let windowStateEvents = lpTag.events.hasFired('lpUnifiedWindow', 'state')
            let renderEvents = lpTag.events.hasFired('RENDERER_STUB','AFTER_CREATE_ENGAGEMENT_INSTANCE')
            let engagementClicks = lpTag.events.hasFired('LP_OFFERS','OFFER_CLICK')

            let clickedEngagement = this._getLatest(engagementClicks) || {};
            let skillId = this._getLatest(convEvents, 'skill');
            let windowState = this._getLatest(windowStateEvents) || {};
            let engagementConf = this._findRenderEventConf(renderEvents, clickedEngagement.engagementId) || {};

            let lpVidCookie = document.cookie.split('; ').find(row => row.startsWith('LPVID'))
            let lpSidCookie = document.cookie.split('; ').find(row => row.startsWith(`LPSID-${lpTag.site}`))

            let lpVid = lpVidCookie ? lpVidCookie.split('=')[1] : undefined
            let lpSid = lpSidCookie ? lpSidCookie.split('=')[1] : undefined

            let data = {
                siteId: lpTag.site,
                sections: lpTag.section,
                campaignId: clickedEngagement.campaignId || this._getLatest(engagementEvents, 'campaignId'),
                engagementName: clickedEngagement.engagementName || engagementConf.name,
                engagementId: clickedEngagement.engagementId || this._getLatest(engagementEvents, 'engagementId'),
                window: clickedEngagement.windowId || this._getLatest(engagementEvents, 'windowId'),
                windowState: windowState.state,
                agentName: this._getLatest(convEvents, 'agentName'),
                agentId: this._getLatest(convEvents, 'agentId'),
                convId: this._getLatest(convEvents, 'conversationId'),
                skill: engagementConf.skillName || skillId,
                lpVid,
                lpSid,
                visitorId: this._getLatest(convEvents, 'visitorId')
            };

            return data;
        },
        showData: function (opts) {
            if (opts && opts.data && opts.data.line && opts.data.line.text === '/convinfo') {

                // get the data that will be inserted into the window
                let data = lpTag.external.convInfo.getData()

                // appended the data to the conversation transcript in the window
                let div = document.createElement('div');
                div.id = 'lp_line_convinfo';
                div.innerText = JSON.stringify(data, null, '\t');
                document.getElementsByClassName('lpc_transcript')[0].appendChild(div);

                // don't send anything to the agent (unless this is the first message; that can't be stopped)
                opts.data.line.text = '';

                // scroll to the bottom of the window
                let scrollable = document.getElementsByClassName('lp_location_center')[0];
                scrollable.scrollTop = scrollable.scrollHeight
            }
        },
        // the "datum" parameter is optional
        _getLatest: function (array, datum) {
            let event = array.reverse().find(item => {
                return item.data && datum ? item.data[datum] : true
            });
            if (event && event.data) return datum ? event.data[datum] : event.data;
            else return undefined;
        },
        _findRenderEventConf: function (renderEvents, engagementId) {
            let event = renderEvents.find(ev => {
                return ev && ev.data && ev.data.conf && (ev.data.conf.id === engagementId)
            });
            return event && event.data && event.data.conf
        }
    }

    lpTag.hooks.push({
        name: 'BEFORE_SEND_VISITOR_LINE',
        callback: lpTag.external.convInfo.showData
    })
}