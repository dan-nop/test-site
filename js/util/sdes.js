window.sdes = {}

function pushSDEs(array = [], type) {
    if (type) addSDE(array, type)
    console.log(`push payload: ${JSON.stringify(array)}`)
    lpTag.sdes.push(array);
}

function sendSDEs(array = [], type) {
    if (type) addSDE(array, type)
    console.log(`send payload: ${JSON.stringify(array)}`)
    lpTag.sdes.send(array);
}

function addSDE(array = [], type) {
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
        case 'mrktInfo':
            payload.info = {}
            if (document.getElementById('mrktInfoChannel').value !== 'Undefined') {
                payload.info.channel = parseInt(document.getElementById('mrktInfoChannel').value)
            }
            if (document.getElementById('mrktInfoAffiliate').value) {
                payload.info.affiliate = document.getElementById('mrktInfoAffiliate').value
            }
            if (document.getElementById('mrktInfoCampaignId').value) {
                payload.info.campaignId = document.getElementById('mrktInfoCampaignId').value
            }
            break;
        case 'searchInfo':
            payload.keywords = [];
            if (document.getElementById('searchInfoKeywords').value) {
                payload.keywords = document.getElementById('searchInfoKeywords').value.split(',')
            }
    }

    array.push(payload);
    return array;
}