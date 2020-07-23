waitForTag(proactivePopInit);

function proactivePopInit () {
    lpTag.external = lpTag.external || {};
    lpTag.external.flags = lpTag.external.flags || {};
    lpTag.events.bind({
        eventName: 'AFTER_CREATE_ENGAGEMENT_INSTANCE',
        appName: 'RENDERER_STUB',
        func: autoClickProactive
    });
}

function autoClickProactive (data) {
    console.groupCollapsed(`engagement displayed`)
        console.log(`proactive ${data.eng.engData.engagementName}`)
        console.log(`engagmentId ${data.eng.engData.engagementId}`)
        console.log(`skill ${data.conf.skillName}`)
        console.dir(data)
    console.groupEnd()

    // is engagement proactive (engagementType = 1) and has this visitor already been invited on this page
    if (data && data.eng && data.eng.engData && data.eng.engData.engagementType === 1 && !lpTag.external.flags.invited) {
        window.setTimeout(() => {
            lpTag.taglets.rendererStub.click(data.eng.engData.engagementId)
            lpTag.external.flags.invited = true;
        }, 100);
    }
}