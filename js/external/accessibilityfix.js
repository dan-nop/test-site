// Parse through script url params and associated actions
function getScriptParams() {
    let params = {}
    for (i = 0; i < document.scripts.length; i++) {
        var s = document.scripts[i].src;
        if (s.indexOf("accessibilityfix.js?") > -1) {
            var p = s.split("?")[1].split("&");
            for (n = 0; n < p.length; n++) {
                key = p[n].split("=")[0];
                val = p[n].split("=")[1];
                switch (key) {
                    case "divids":
                        // Get div ids
                        console.log('divids: ', val)
                        params.divids = val.split(',')
                }
            }
        }
    }
    return params;
}

function engagementRenderedHandler () {
    try {
        const divs = getScriptParams().divids;

        // remove role and tabindex from specified divs above
        divs.forEach((divName) => {
            const selectedDiv = document.getElementById(divName);
            const selectedDivLpm = selectedDiv.querySelector('.LPMcontainer');
            if (selectedDivLpm.getAttribute('role') === 'button') selectedDivLpm.removeAttribute('role');
            if (selectedDivLpm.getAttribute('tabindex') === '0') selectedDivLpm.removeAttribute('tabindex');
        });
    } catch (e) {
        console.error();
    }
}

engagementRenderedHandler();