window.params = window.params || new URLSearchParams(window.location.search);
window.lpTag = window.lpTag || {};
lpTag.identities = lpTag.identities || [];

let identity = null;

if (params.has('sub')) {
    identity = {
        iss: document.location.host,
        acr: 'loa1',
        sub: params.get('sub')
    }
} else if (params.has('randomsub')) {
    identity = {
        iss: document.location.host,
        acr: 'loa1',
        sub: Math.random().toString(36).substring(2)
    }
}

lpTag.identities.push(function (cb) { cb(identity) })

lpGetAuthenticationToken = function (cb) {
    cb("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImFsZ29yaXRobSI6IlJTMjU2In0.eyJzdWIiOiI5OTk5OTk5OTk5IiwiZXhwIjoxNTE5NzQxMzgwLCJpYXQiOjE1MTkzMDgwMDAsImlzcyI6Imh0dHBzOi8vd3d3LnNpbmd0ZWwuY29tIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiSm9obkRvZSIsInBob25lX251bWJlciI6Iig5OTkpOTk5LTk5OTkiLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImN1c3RvbWVySWQiOiIxMzg3NjZBQyIsInNvY2lhbElkIjoiMTEyNTYzMjQ3ODAiLCJpbWVpIjoiMzU0MzU0NjU0MzU0NTY4OCIsInVzZXJOYW1lIjoidXNlcjAwMCJ9fSx7InR5cGUiOiJwZXJzb25hbCIsInBlcnNvbmFsIjp7ImZpcnN0bmFtZSI6IkpvaG4iLCJsYXN0bmFtZSI6IkRvZSIsImFnZSI6eyJhZ2UiOjM0LCJ5ZWFyIjoxOTgwLCJtb250aCI6NCwiZGF5IjoxNX0sImNvbnRhY3RzIjpbeyJlbWFpbCI6Im15bmFtZUBleGFtcGxlLmNvbSIsInBob25lIjoiKDk5OSk5OTktOTk5OSJ9XSwiZ2VuZGVyIjoiTUFMRSIsImxhbmd1YWdlIjoiZW4tVVMifX1dfQ.D8RZcGlUTRrs-u7iJnb2eCqRPRq8d0kUXOXxxVRSNwnSpkmYDqc2qiKeJZWOI2HVxjzGx9Ye5cdfaQAK3tvTL3J4rFZeDq6hEdYjVm2yMa_SVTCXmXizK0CZwofXGFYtzljzFr02RvIKuyROU1l3Yys1HXkFK49H_fS3ncUsqA2DdjB_JdleAqrbjHl8XJ7XO7VWlJjDxMGUyosDEudkImR5dPxafRibVScMAp_fva9o9WQcCUcwaBbzi0j8P-9fu2p0Gdu61Ij9Z-vEFegWRpwB5jogRIVWBt946tfI-hhshV_3OGm_8LyHxJ7gX-Tl3wuTD8DxAuNYsTdPlcTDcA")
}