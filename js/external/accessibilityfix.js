// put custom code in lpTag.external to keep the js namespace clean
lpTag.external = lpTag.external || {};
lpTag.external.accessibilityFix = {
    // handle the offer_impression event
    engagementRenderedHandler: function (data) {
        try {
            // is this an embedded button (engagementType 5) and an HTML engagement (renderingType 1)
            if (data.engagementType === 5 && data.renderingType === 1) {
                // find the zone
                var zonesLoaded = lpTag.events.hasFired('SCRAPER','ZONES_LOADED');
                var possibleZones = zonesLoaded && zonesLoaded[0] && zonesLoaded[0].data;
                var thisZone;
                for (var i=0; i < possibleZones.length; i++) {
                    if (possibleZones[i].id === data.zoneId) {
                        thisZone = possibleZones[i];
                        break;
                    }
                }
                // remove role from and update tabindex on relevant div if necessary
                if (thisZone) {
                    const selectedDiv = document.getElementById(thisZone.name);
                    const selectedDivLpm = selectedDiv.querySelector('.LPMcontainer');
                    const clickableElement = selectedDivLpm.querySelector('[data-lp-event=click]');

                    // if the clickable element doesn't have role=button add it
                    if (clickableElement.getAttribute('role') !== 'button') {
                        clickableElement.setAttribute('role', 'button');
                        console.log('01216353 '+thisZone.name+' role added')
                    }

                    // if the container div has role=button remove it
                    if (selectedDivLpm.getAttribute('role') === 'button') {
                        selectedDivLpm.removeAttribute('role');
                        console.log('01216353 '+thisZone.name+' role removed');
                    }

                    // do both the clickable element and the container div have role=button?
                    // if (clickableElement.getAttribute('role') === 'button' && selectedDivLpm.getAttribute('role') === 'button') {
                    //     selectedDivLpm.removeAttribute('role');
                    // }

                    // if the clickable element doesn't have tab index > -1 set it
                    if (!(parseInt(clickableElement.getAttribute('tabindex')) > -1)) {
                        clickableElement.setAttribute('tabIndex', '0');
                        console.log('01216353 '+thisZone.name+' tabindex 0');
                    }

                    // if the container div has tabindex > -1 change it
                    if (parseInt(selectedDivLpm.getAttribute('tabindex')) > -1) {
                        selectedDivLpm.setAttribute('tabindex', '-1');
                        console.log('01216353 '+thisZone.name+' tabindex -1');
                    }

                    // do both the clickable element and the container div have tab indices > -1?
                    // if (parseInt(clickableElement.getAttribute('tabindex')) > -1 && parseInt(selectedDivLpm.getAttribute('tabindex')) > -1) {
                    //     selectedDivLpm.setAttribute('tabindex', '-1');
                    // }
                }
            }
        } catch (e) {
            console.error();
        }
    }
}

lpTag.events.bind('LP_OFFERS','OFFER_IMPRESSION', lpTag.external.accessibilityFix.engagementRenderedHandler);