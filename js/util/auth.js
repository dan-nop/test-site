window.params = window.params || new URLSearchParams(window.location.search);
window.lpTag = window.lpTag || {};
lpTag.identities = lpTag.identities || [];

let identity = null;

if (params.has('sub')) pushIdentity(params.get('sub'))
else if (params.has('randomsub')) pushIdentity()

function pushIdentity (sub) {
    let identity = {
        iss: document.location.host,
        acr: 'loa1',
        sub: sub || Math.random().toString(36).substring(2)
    }
    lpTag.identities.push(function ident (cb) { cb(identity) })
}

lpGetAuthenticationToken = function (cb) {
    cb('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImFsZ29yaXRobSI6IlJTMjU2In0.eyJzdWIiOiI5OTk5OTk5OTk5IiwiZXhwIjoxNTk3MTAzNDA5LCJpYXQiOjE1OTQ0MjUwMDksImlzcyI6Imh0dHBzOi8vd3d3LnNpbmd0ZWwuY29tIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiSm9obkRvZSIsInBob25lX251bWJlciI6Iig5OTkpOTk5LTk5OTkiLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImN1c3RvbWVySWQiOiIxMzg3NjZBQyIsInNvY2lhbElkIjoiMTEyNTYzMjQ3ODAiLCJpbWVpIjoiMzU0MzU0NjU0MzU0NTY4OCIsInVzZXJOYW1lIjoidXNlcjAwMCJ9fSx7InR5cGUiOiJwZXJzb25hbCIsInBlcnNvbmFsIjp7ImZpcnN0bmFtZSI6IkpvaG4iLCJsYXN0bmFtZSI6IkRvZSIsImFnZSI6eyJhZ2UiOjM0LCJ5ZWFyIjoxOTgwLCJtb250aCI6NCwiZGF5IjoxNX0sImNvbnRhY3RzIjpbeyJlbWFpbCI6Im15bmFtZUBleGFtcGxlLmNvbSIsInBob25lIjoiKDk5OSk5OTktOTk5OSJ9XSwiZ2VuZGVyIjoiTUFMRSIsImxhbmd1YWdlIjoiZW4tVVMifX1dfQ.o2AMqog3QyT8CYYS8veZ_ayefVt7u9sUJedDmshde6Pgna66F_Mok1Uu6AtdKru6uXSqxExNHcuVXEQ86hcdKaeY2j42QBclHP-ykDw7EItfenJRrVfvxzsEBndmLDzrRhPg9sSb2JE25TIoFtaK9mhMQVx3hQfsNGr0JI8pdfMmqwEov2jaTD-_FLXqjPgKXZk-yPUNJFGQGCkuD6cCercZ_KPTxjtWPA1ARMoqjsLhH9lRcAaTItQXOA2IS1FYv42JtvsjLdAbP2_KsnAifD9k442f4rjo_kKxO7l8CHWoVMN8PPMjVj4WNBnIBaurRLaj1lFv37ixUJROfMY84w')
}