waitForTag(convInfoInit);

function convInfoInit () {
    lpTag.external = lpTag.external || {};
    lpTag.external.convInfo = {
        // this can be called from the console!
        getData: function () {
            let allEvents = lpTag.events.hasFired('*','*');
            let convEvents = lpTag.events.hasFired('lpUnifiedWindow', 'conversationInfo')
            let windowStateEvents = lpTag.events.hasFired('lpUnifiedWindow', 'state')
            let renderEvents = lpTag.events.hasFired('RENDERER_STUB','AFTER_CREATE_ENGAGEMENT_INSTANCE')
            let engagementClicks = lpTag.events.hasFired('LP_OFFERS','OFFER_CLICK')
            // todo: account for proactive auto-clicker.
            let eventMap = allEvents.map(e => e.appName+e.eventName)
            let startPageIndex = eventMap.lastIndexOf('lp_monitoringSDKSP_SENT')
            let eventsAfterSP = allEvents.slice(startPageIndex);
            let engagementsAfterSP = eventsAfterSP.filter(e => {
                return e.appName === 'RENDERER_STUB' && e.eventName === 'AFTER_CREATE_ENGAGEMENT_INSTANCE'
            })
            let displayedEngagements = renderEvents.map(this._extractEngDetails) || {};
            let lastDisplayedEngagements = engagementsAfterSP.map(this._extractEngDetails) || [];
            let latestEngagementClick = this._getLatest(engagementClicks) || {};
            let clickedEngagementRender = this._findRenderEvent(renderEvents, latestEngagementClick.engagementId) || {};
            let clickedEngagement = this._extractEngDetails(clickedEngagementRender);
            let windowState = this._getLatest(windowStateEvents) || {};
            let lpVidCookie = document.cookie.split('; ').find(row => row.startsWith('LPVID'))
            let lpSidCookie = document.cookie.split('; ').find(row => row.startsWith(`LPSID-${lpTag.site}`))
            let lpVid = lpVidCookie ? lpVidCookie.split('=')[1] : undefined
            let lpSid = lpSidCookie ? lpSidCookie.split('=')[1] : undefined
            // the window's visitorId property returns the shark vid sometimes, and the pid other times
            let ceVid = this._getLatest(convEvents, 'visitorId')
            let pid = lpVid !== ceVid ? ceVid : undefined;
            return {
                clickedEngagement,
                latestSkillId: this._getLatest(convEvents, "skill"),
                latestAgentId: this._getLatest(convEvents, "agentId"),
                latestConvId: this._getLatest(convEvents, "conversationId"),
                latestAgentName: this._getLatest(convEvents, "agentName"),
                latestWindowState: this._getLatest(windowStateEvents, "state"),
                displayedEngagements,
                lastDisplayedEngagements,
                lpSid,
                lpVid,
                pid,
                siteId: lpTag.site,
                sections: lpTag.section
            }
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
            let event = undefined;
            if (datum) {
                for (var i = array.length-1; i>=0; i--) {
                    if (array[i].data && array[i].data[datum]) {
                        event = array[i];
                        break;
                    }
                }
            } else event = array[array.length-1]



            if (event && event.data) return datum ? event.data[datum] : event.data;
            else return undefined;
        },
        _findRenderEvent: function (renderEvents, engagementId) {
            return renderEvents.find(ev => {
                return ev && ev.data && ev.data.conf && (ev.data.conf.id === engagementId)
            });
        },
        _extractEngDetails: function (renderEvent) {
            let eng = renderEvent.data && renderEvent.data.eng;
            if (eng && eng.conf) {
                return {
                    campaignId: eng.conf.campaignId,
                    engagementId: eng.conf.id,
                    engagementName: eng.conf.name,
                    skillId: eng.conf.skillId,
                    skillName: eng.conf.skillName,
                    container: eng.mainContainer,
                    windowId: eng.conf.windowId
                }
            } else return undefined;
        }
    }

    lpTag.hooks.push({
        name: 'BEFORE_SEND_VISITOR_LINE',
        callback: lpTag.external.convInfo.showData
    })
}