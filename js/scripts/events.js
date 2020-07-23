function logEvent(data, { appName, eventName }) {
    console.groupCollapsed(`${new Date().toLocaleTimeString()}: ${appName}.${eventName}`)
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
    window.setTimeout(() => lpTag.external.retroBind('RENDERER_STUB','AFTER_CREATE_ENGAGEMENT_INSTANCE', logEvent), 1000)
}

waitForTag(initEvents);