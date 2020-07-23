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
    }
    console.log(`push payload: ${JSON.stringify(payload)}`)
    lpTag.sdes.push(payload);
}