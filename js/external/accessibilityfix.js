lpTag.external = lpTag.external || {};
lpTag.external.accessibilityFix = {
    getZones: function () {
        var zonesLoaded = lpTag.events.hasFired("SCRAPER","ZONES_LOADED");
        if (zonesLoaded && zonesLoaded[0] && zonesLoaded[0].data) {
            lpTag.external.accessibilityFix.zones = zonesLoaded[0].data;
        }
        return lpTag.external.accessibilityFix.zones;
    },
    engagementRenderedHandler: function (data) {
        console.log(data)
        try {
            var possibleZones = lpTag.external.accessibilityFix.zones || lpTag.external.accessibilityFix.getZones();
            if (data.engagementType === 5 && data.renderingType === 1) {
                var offerZone = data.zoneId;
                var thisZone = possibleZones.find(function (possibleZone) { return possibleZone.id === offerZone})
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
