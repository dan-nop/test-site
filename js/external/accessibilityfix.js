// put custom code in lpTag.external to keep the js namespace clean
lpTag.external = lpTag.external || {};
lpTag.external.accessibilityFix = {
    // get and cache all of the zones on the account
    getZones: function () {
        var zonesLoaded = lpTag.events.hasFired("SCRAPER","ZONES_LOADED");
        if (zonesLoaded && zonesLoaded[0] && zonesLoaded[0].data) {
            lpTag.external.accessibilityFix.zones = zonesLoaded[0].data;
        }
        return lpTag.external.accessibilityFix.zones;
    },
    // handle the offer_impression event
    engagementRenderedHandler: function (data) {
        try {
            // fetch zones
            var possibleZones = lpTag.external.accessibilityFix.zones || lpTag.external.accessibilityFix.getZones();
            // is this an embedded button (engagementType 5) and an HTML engagement (renderingType 1)
            if (data.engagementType === 5 && data.renderingType === 1) {
                // find the zone
                var thisZone = possibleZones.find(function (possibleZone) { return possibleZone.id === data.zoneId})
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
console.log('accessibilityfix loaded');
