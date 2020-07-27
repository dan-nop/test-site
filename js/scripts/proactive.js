waitForTag(proactivePopInit);

function proactivePopInit () {
    lpTag.external = lpTag.external || {};
    lpTag.external.autoClickProactive = {
        // note that this list of campaign IDs will be different for the Production account
        campaignWhiteList: [
            1956042030, // Sales-Home-DT
            1956044130, // Sales-Home-DT-Default
            1956047130, // Sales-Home-DT-Returning
            1963153530, // Sales-Home_SMB-DT
            1963194030, // Sales-Home_SMB_Service-DT
            1963195930, // Sales-Mobile-DT-Default
            1963630130, // Sales-Home_Credit-DT
            1972077430, // Sales-Mobile-DT
            1972077730, // Sales-Mobile-D
            1972078230, // Sales-Mobile-T
            1972078830, // Sales-Mobile-DT-Returning
            2066463830 // Sales-Home_Tech_SMB-DT
        ],
        autoClicker: function (data) {
            console.groupCollapsed(`engagement ${data.eng.engData.engagementName} displayed`)
                console.log(`engagmentId ${data.eng.engData.engagementId}`)
                console.log(`skill ${data.conf.skillName}`)
                console.dir(data)
            console.groupEnd()
            // is this a proactive engagement?
            if (!(data && data.eng && data.eng.engData && data.eng.engData.engagementType === 1)) return false;

            // is the engagement from a whitelisted campaign?
            if (lpTag.external.autoClickProactive.campaignWhiteList.indexOf(data.eng.engData.campaignId) < 0) return false;

            // has this person already dismissed an invitation in this section in the past 24 hours?
            // check here for the cookie that indicates they have received a proactive of this sort in the past 24 hours
            if (cookieExistsIndicatingVisitorHasReceivedThisProactiveRecently()) return false;

            // is there availability in the relevant skill?
            // Maybe you can add a callback to the getSkillData function, like getSkillData(postParams, callback)
            // and then if availability = true call the callback? Then you could pass in the rendererStub click as the callback

            // a short timeout is necessary because the engagement is not yet clickable when the event fires.
            // If you check availability or do something else that takes some time you won't need the callback
            window.setTimeout(() => {
                lpTag.taglets.rendererStub.click(data.eng.engData.engagementId)
                // set cookie with 24 hour expiration indicating that this person has had an engagement of this sort presented to them
            }, 100);
        }
    }

    lpTag.events.bind({
        eventName: 'AFTER_CREATE_ENGAGEMENT_INSTANCE',
        appName: 'RENDERER_STUB',
        func: lpTag.external.autoClickProactive.autoClicker()
    });
}

