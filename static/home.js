let activeID;
const ws = new WebSocket('ws://localhost');
(async () =>{
    const res = await fetch('http://localhost/chats');
    const id_emailArr = await res.json();

    if(id_emailArr.length && (id_emailArr.length > 0)){
        for(let id_email of id_emailArr){
            const chatElem = document.createElement("div");

            chatElem.addEventListener('click', () => {
                activeID = id_email.id;
                const contentDiv = document.getElementById('content');
                contentDiv.innerHTML = '<span>Loading...</span>';

                fetch(`http://localhost/chat/${id_email.id}`)
                    .then(res => res.json())
                    .then((msgArr)=>{
                        contentDiv.innerHTML = '';
                        for(const msg of msgArr){
                            pushMessage(msg, activeID);
                        }

                    })
            })
            chatElem.innerText = id_email.email;
            document.getElementById('chat_column').appendChild(chatElem)

        }
        document.getElementById('btnSend').addEventListener('click', () => {
            send(activeID);
        })

    }
})();

function pushMessage(msg, activeID){
    const contentDiv = document.getElementById('content');

    const timeElem = document.createElement('span')
    timeElem.innerText = msg.time;
    const textElem = document.createElement("p")
    textElem.innerText = msg.content;
    const msgDiv = document.createElement("div")
    if(msg.sender_id === activeID){ msgDiv.className = 'foreign'; }
    msgDiv.appendChild(timeElem)
    msgDiv.appendChild(textElem)
    contentDiv.appendChild(msgDiv);
}

function send(rid){
    const messageField  = document.getElementById('message-field');
    ws.send(JSON.stringify({
        receiver_id: rid,
        content: messageField.value
    }));
    messageField.value = '';
}

ws.addEventListener('message', (message)=>{
    const msgObj = JSON.parse(message.data); //{content: "", sender_email: ""}
    pushMessage(msgObj, activeID);
})