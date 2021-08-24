function logEvent(data, { appName, eventName }) {
    if (params && params.has('events:appfilter')) {
        let apps = params.get('events:appfilter').split(',').map(a => a.toLowerCase())
        if (!apps.includes(appName.toLowerCase())) {
            return null;
        }
    }
    console.groupCollapsed(`~&~ ${new Date().getTime()}: ${appName}.${eventName}`)
    console.dir(data)
    console.groupEnd()
}

function initEvents () {
    lpTag.external = lpTag.external || {};
    lpTag.external.retroBind = lpTag.external.retroBind || function (app, event, callback) {
          let pastEvents = lpTag.events.hasFired(app, event)
          pastEvents.forEach(function ({ data, appName, eventName }) {
              callback(data, { appName, eventName })
          })
          return lpTag.events.bind(app, event, callback)
      }
    window.setTimeout(() => lpTag.external.retroBind('*','*', logEvent), 1000)
}

waitForTag(initEvents);