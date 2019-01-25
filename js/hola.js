//https://github.com/hakynseyer

/* //Mensaje Síncrono - Renderer.js
const syncMsgBtn = document.getElementById('sendSyncMsgBtn')
syncMsgBtn.addEventListener('click', function () {
    const reply = ipc.sendSync('synchronous-message', 'Mr. Watson, come here.')
    const message = `Synchronous message reply: ${reply}`
    document.getElementById('syncReply').innerHTML = message
})

//Mensaje Asíncrono - Renderer.js
const asyncMsgBtn = document.getElementById('sendAsyncMsgBtn')
asyncMsgBtn.addEventListener('click', function () {
    ipc.send('asynchronous-message', "That's one small step for man")
})

ipc.on('asynchronous-reply', function (event, arg) {
    const message = `Asynchronous message reply: ${arg}`
    document.getElementById('asyncReply').innerHTML = message
}) */

/* //Mensaje Síncrono - Main.js
ipc.on('synchronous-message', function (event, arg) {
    event.returnValue = 'I heard you!'
})
  
//Mensaje Asíncrono - Main.js
ipc.on('asynchronous-message', function (event, arg) {
    if (arg === "That's one small step for man") {
    event.sender.send('asynchronous-reply', ', one giant leap for mankind.')
    }
}) */

ipc.send('a')

ipc.on('b', function (event, arg) {
    sql = "INSERT INTO gente_online (id, fecha) VALUES (987, NOW())"
    con.query(sql, function (err, result) {
        if (err) throw err;
    })
})