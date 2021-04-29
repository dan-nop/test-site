// put custom code in lpTag.external to keep the js namespace clean
lpTag.external = lpTag.external || {};
lpTag.external.accessibilityFix = {
    // handle the offer_impression event
    engagementRenderedHandler: function (data) {
        try {
            // fetch zones
            var zonesLoaded = lpTag.events.hasFired('SCRAPER','ZONES_LOADED')
            var possibleZones = onesLoaded && zonesLoaded[0] && zonesLoaded[0].data
            // is this an embedded button (engagementType 5) and an HTML engagement (renderingType 1)
            if (data.engagementType === 5 && data.renderingType === 1) {
                // find the zone
                var thisZone;
                for (var i=0; i < possibleZones.length; i++) {
                    if (possibleZones[i].id === data.zoneId) { thisZone = possibleZones[i]}
                }
                // remove role and tabindex from relevant div
                if (thisZone) {
                    const selectedDiv = document.getElementById(thisZone.name);
                    const selectedDivLpm = selectedDiv.querySelector('.LPMcontainer');
                    if (selectedDivLpm.getAttribute('role') === 'button') selectedDivLpm.removeAttribute('role');
                    if (selectedDivLpm.getAttribute('tabindex') === '0') selectedDivLpm.removeAttribute('tabindex');
                }
            }
        } catch (e) {
            console.error();
        }
    }
}

lpTag.events.bind('LP_OFFERS','OFFER_IMPRESSION', lpTag.external.accessibilityFix.engagementRenderedHandler);
