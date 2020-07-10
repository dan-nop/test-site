lpTag.external = lpTag.external || {}
lpTag.external.retroBind = function (app, event, callback) {
    let pastEvents = lpTag.events.hasFired(app, event)
    pastEvents.forEach(function ({ data, appName, eventName }) {
        callback(data, { appName, eventName })
    })
    return lpTag.events.bind(app, event, callback)
}