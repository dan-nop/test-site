function pushSDE(type) {
    let payload = {type};
    switch (type) {
        case 'service':
            payload.service = {}
            if (document.getElementById('serviceActivityTopic').value) {
                payload.service.topic = document.getElementById('serviceActivityTopic').value
            }
            if (document.getElementById('serviceActivityStatus').value !== 'Undefined') {
                payload.service.status = parseInt(document.getElementById('serviceActivityStatus').value)
            }
            if (document.getElementById('serviceActivityCategory').value) {
                payload.service.category = document.getElementById('serviceActivityCategory').value
            }
            if (document.getElementById('serviceActivityServiceId').value) {
                payload.service.serviceId = document.getElementById('serviceActivityServiceId').value
            }
            break;
        case 'error':
            payload.error = {}
            if (document.getElementById('errorContextId').value) {
                payload.error.contextId = document.getElementById('errorContextId').value
            }
            if (document.getElementById('errorMessage').value) {
                payload.error.message = document.getElementById('errorMessage').value
            }
            if (document.getElementById('errorCode').value) {
                payload.error.code = document.getElementById('errorCode').value
            }
            if (document.getElementById('errorLevel').value !== 'Undefined') {
                payload.error.level = parseInt(document.getElementById('errorLevel').value)
            }
            if (document.getElementById('errorResolved').value) {
                payload.error.resolved = document.getElementById('errorResolved').checked
            }
            break;
    }
    console.log(`push payload: ${JSON.stringify(payload)}`)
    lpTag.sdes.push(payload);
}