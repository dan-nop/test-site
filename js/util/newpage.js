function newPageInit() {
    document.getElementById('newPageSections').value = lpTag.section ? lpTag.section.join(',') : ''
}

function newPage() {
    lpTag.newPage(document.URL, {
        section: document.getElementById('newPageSections').value.split(',')
    })
}

waitForTag(newPageInit);