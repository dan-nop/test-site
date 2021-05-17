(function () {

    function _getLatest(array, datum) {
        var event = undefined;
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
    }

    function _findRenderEvent(renderEvents, engagementId) {
        return renderEvents.find(function(ev) {
            return (ev && ev.data && ev.data.conf && ev.data.conf.id === engagementId);
        });
    }

    function _extractEngDetails(renderEvent) {
        var eng = renderEvent.data && renderEvent.data.eng;
        if (eng && eng.conf) {
            var details = {
                campaignId: eng.conf.campaignId,
                engagementId: eng.conf.id,
                engagementName: eng.conf.name,
                skillId: eng.conf.skillId,
                skillName: eng.conf.skillName,
                container: eng.mainContainer,
                windowId: eng.conf.windowId
            }
        }
        return details;
    }

    try {
        var allEvents = lpTag.events.hasFired("*","*");
        var convEvents = lpTag.events.hasFired("lpUnifiedWindow", "conversationInfo");
        var windowStateEvents = lpTag.events.hasFired("lpUnifiedWindow", "state");
        var renderEvents = lpTag.events.hasFired("RENDERER_STUB", "AFTER_CREATE_ENGAGEMENT_INSTANCE");
        var engagementClicks = lpTag.events.hasFired("LP_OFFERS", "OFFER_CLICK");
        var eventMap = allEvents.map(function (e) {return e.appName + e.eventName})
        var startPageIndex = eventMap.lastIndexOf("lp_monitoringSDKSP_SENT")
        var eventsAfterSP = allEvents.slice(startPageIndex)
        var engagementsAfterSP = eventsAfterSP.filter(function (e) {
            return e.appName === "RENDERER_STUB" && e.eventName === "AFTER_CREATE_ENGAGEMENT_INSTANCE"
        })
        var lastDisplayedEngagements = engagementsAfterSP.map(_extractEngDetails) || [];
        var displayedEngagements = renderEvents.map(_extractEngDetails) || [];
        var latestEngagementClick = _getLatest(engagementClicks) || {};
        var clickedEngagementRender = _findRenderEvent(renderEvents, latestEngagementClick.engagementId) || {};
        var clickedEngagement = _extractEngDetails(clickedEngagementRender)
        var lpVidCookie = document.cookie.split("; ").find(function(row) {
            return row.startsWith("LPVID");
        });
        var lpSidCookie = document.cookie.split("; ").find(function(row) {
            return row.startsWith("LPSID-".concat(lpTag.site));
        });
        var lpVid = lpVidCookie ? lpVidCookie.split("=")[1] : undefined;
        var lpSid = lpSidCookie ? lpSidCookie.split("=")[1] : undefined;
        var ceVid = _getLatest(convEvents, "visitorId");
        var pid = lpVid !== ceVid ? ceVid : undefined;
        console.log({
            clickedEngagement: clickedEngagement,
            latestSkillId: _getLatest(convEvents, "skill"),
            latestAgentId: _getLatest(convEvents, "agentId"),
            latestConvId: _getLatest(convEvents, "conversationId"),
            latestAgentName: _getLatest(convEvents, "agentName"),
            latestWindowState: _getLatest(windowStateEvents, "state"),
            displayedEngagements: displayedEngagements,
            lastDisplayedEngagements: lastDisplayedEngagements,
            lpSid: lpSid,
            lpVid: lpVid,
            pid: pid,
            siteId: lpTag.site,
            sections: lpTag.section
        });

    } catch (e) {
        console.error(e)
    }
})()