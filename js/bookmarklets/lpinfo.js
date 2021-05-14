(function () {
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
    var lastDisplayedEngagements = engagementsAfterSP.map(this._extractEngDetails) || [];
    var displayedEngagements = renderEvents.map(this._extractEngDetails) || [];
    var latestEngagementClick = this._getLatest(engagementClicks) || {};
    var clickedEngagementRender = this._findRenderEvent(renderEvents, latestEngagementClick.engagementId) || {};
    var clickedEngagement = this._extractEngDetails(clickedEngagementRender)
    var lpVidCookie = document.cookie.split("; ").find(function(row) {
        return row.startsWith("LPVID");
    });
    var lpSidCookie = document.cookie.split("; ").find(function(row) {
        return row.startsWith("LPSID-".concat(lpTag.site));
    });
    var lpVid = lpVidCookie ? lpVidCookie.split("=")[1] : undefined;
    var lpSid = lpSidCookie ? lpSidCookie.split("=")[1] : undefined;
    var ceVid = this._getLatest(convEvents, "visitorId");
    var pid = lpVid !== ceVid ? ceVid : undefined;
    console.log({
        clickedEngagement: clickedEngagement,
        latestSkillId: this._getLatest(convEvents, "skill"),
        latestAgentId: this._getLatest(convEvents, "agentId"),
        latestConvId: this._getLatest(convEvents, "conversationId"),
        latestAgentName: this._getLatest(convEvents, "agentName"),
        latestWindowState: this._getLatest(windowStateEvents, "state"),
        displayedEngagements: displayedEngagements,
        lastDisplayedEngagements: lastDisplayedEngagements,
        lpSid: lpSid,
        lpVid: lpVid,
        pid: pid,
        siteId: lpTag.site,
        sections: lpTag.section
    });
})()