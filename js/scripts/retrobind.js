lpTag.external = lpTag.external || {}
lpTag.external.retroBind = function (app, event, callback) {
    let pastEvents = lpTag.events.hasFired(app, event)
    pastEvents.forEach(function (event) {
        callback(event.data, { appName: event.appName, eventName: event.eventName })
    })
    return lpTag.events.bind(app, event, callback)
}