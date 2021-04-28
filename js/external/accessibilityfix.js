lpTag.external = lpTag.external || {};
lpTag.external.accessibilityFix = {
    getZones: function () {
        var zonesLoaded = lpTag.events.hasFired("SCRAPER","ZONES_LOADED");
        if (zonesLoaded && zonesLoaded[0] && zonesLoaded[0].data) {
            this.zones = zonesLoaded[0].data;
        }
        return this.zones;
    },
    engagementRenderedHandler: function (data, b, c) {
        console.log(data,b,c)
        try {
            var possibleZones = this.zones || this.getZones();
            if (data.data.engagementType === 5) {
                var offerZone = data.data.zoneId;
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

lpTag.events.bind('LP_OFFERS','OFFER_IMPRESSION', lpTag.external.engagementRenderedHandler);
console.log('accessibilityfix loaded');
