function availabilityInit () {
    window.engagements = [];
    lpTag.events.bind('RENDERER_STUB', 'BEFORE_CREATE_ENGAGEMENT_INSTANCE', data => {
        if (data && data.conf) {
            engagements.push({
                id: data.conf.id,
                name: data.conf.name,
                skillName: data.conf.skillName,
                skillId: data.conf.skillId,
            });
        }
    });
    lpTag.events.bind('RENDERER_STUB', 'AFTER_CREATE_ENGAGEMENT_INSTANCE', data => {
        console.log(data);
        console.log(data.eng);
        console.log(data.eng.containerId);
        console.log(data.eng.offerId);
    })
}

waitForTag(availabilityInit);