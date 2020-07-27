waitForTag(proactivePopInit);

function proactivePopInit () {
    lpTag.external = lpTag.external || {};
    lpTag.external.flags = lpTag.external.flags || {};
    lpTag.external.flags.eligibleForAutoClick = determineAutoClickEligibility();
    lpTag.events.bind({
        eventName: 'AFTER_CREATE_ENGAGEMENT_INSTANCE',
        appName: 'RENDERER_STUB',
        func: autoClickProactive
    });
}

function determineAutoClickEligibility() {}

function autoClickProactive (data) {
    console.groupCollapsed(`engagement ${data.eng.engData.engagementName} displayed`)
        console.log(`engagmentId ${data.eng.engData.engagementId}`)
        console.log(`skill ${data.conf.skillName}`)
        console.dir(data)
    console.groupEnd()
    // is this a proactive engagement?
    if (!(data && data.eng && data.eng.engData && data.eng.engData.engagementType === 1)) return false;

    // has this person already dismissed an invitation in this section in the past 24 hours?
    // recommend setting a 24 hour cookie when auto-clicking the engagement, then checking for that cookie here and not popping the engagement if present

    // is there availability in the relevant skill?
    window.setTimeout(() => {
        lpTag.taglets.rendererStub.click(data.eng.engData.engagementId)
        lpTag.external.flags.eligibleForAutoClick = false;
    }, 100);
}