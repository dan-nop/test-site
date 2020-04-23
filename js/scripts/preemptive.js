// only add this listener on the relevant pages to avoid tons of unnecessary lpTag.newPage events
document.addEventListener('mouseleave', function (event) {
    // detect mouse leave at the top of the window, and only trigger this once
    if (event.clientY <= 0 && lpTag && lpTag.section && lpTag.section.indexOf('preemptiveLeave') <= -1) {
        let section = (lpTag && lpTag.section) || [];
        section.push('preemptiveLeave');
        lpTag.newPage(document.URL, {
            section,
            taglets: {
                rendererStub: {
                    divIdsToKeep: {
                        LP_SALES_HOME_EMBEDDED: true	// this should be whatever divid we use for your embedded button
                    }
                }
            }
        })
    }
});