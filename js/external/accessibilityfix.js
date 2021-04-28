// Parse through script url params and associated actions
function getScriptParams() {
    for (i = 0; i < document.scripts.length; i++) {
        var s = document.scripts[i].src;
        if (s.indexOf("accessibilityfix.js?") > -1) {
            var p = s.split("?")[1].split("&");
            for (n = 0; n < p.length; n++) {
                key = p[n].split("=")[0];
                val = p[n].split("=")[1];
                switch (key) {
                    case "divids":
                        // Get div id to append
                        console.log('divids: ', val)
                }
            }
        }
    }
}