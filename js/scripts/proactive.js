waitForTag(proactivePopInit);

function proactivePopInit () {
    lpTag.external = lpTag.external || {};
    lpTag.external.autoClickProactive = {
        invited: false,
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
            2066463830, // Sales-Home_Tech_SMB-DT
            1927935130 // LP MM Test Campaign
        ],
        blockReInvite: function (section) {
            // set the cookie that will indicate that this visitor is excluded from pop-ups in this section
            document.cookie = `blockInvites_${section}=true;max-age=86400`
        },
        reInviteBlocked: function (section) {
            // check cookie to see if this person is blocked from receiving a pop-up in this section
            // return bool (true = prevent the popUp)
            return (document.cookie.indexOf(`blockInvites_${section}`) > -1 || lpTag.external.autoClickProactive.blockForThisPage)
        },
        openWindow: function (data) {
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
            if (lpTag.external.autoClickProactive.reInviteBlocked('thisSection')) return false;

            // is there availability in the relevant skill?
            // Maybe you can add a callback to the getSkillData function, like getSkillData(postParams, callback)
            // and then if availability = true call the callback? Then you could pass in the rendererStub click as the callback

            // a short timeout is necessary because the engagement is not yet clickable when the event fires.
            // If you check availability or do something else that takes some time you won't need the timeout
            window.setTimeout(() => {
                lpTag.taglets.rendererStub.click(data.eng.engData.engagementId)
                lpTag.external.autoClickProactive.invited = true;
                // set cookie with 24 hour expiration indicating that this person has had an engagement of this sort presented to them
            }, 100);
        },
        dismissalDetector: function () {
            // get window state events from this page visit
            let windowStateEvents = lpTag.events.hasFired('lpUnifiedWindow', 'state')
            // has the window been in the "chatting" state during this page visit?
            let conv = windowStateEvents.find(event => {
                return event.data.state === 'chatting'
            })
            // if the window was opened programmatically and closed without a conversation, prevent subsequent invites
            if (lpTag.external.autoClickProactive.invited && !conv) {
                lpTag.external.autoClickProactive.blockReInvite('thisSection')
            }

            // prevent re-open for this page load
            lpTag.external.autoClickProactive.blockForThisPage = true;
        }
    }

    lpTag.events.bind({
        eventName: 'AFTER_CREATE_ENGAGEMENT_INSTANCE',
        appName: 'RENDERER_STUB',
        func: lpTag.external.autoClickProactive.openWindow
    });

    // this event is going to fire when the window is CLOSED, not just minimized
    lpTag.events.bind({
        eventName: 'windowClosed',
        appName: 'lpUnifiedWindow',
        func: lpTag.external.autoClickProactive.dismissalDetector
    });
}

