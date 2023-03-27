import {WebSocketServer} from "ws";
import {MessageModel} from "../models/MessageModel.js";
import Chat from "./Chat.js";
export class WebSocketController {

    static init(server, sessionParser) {
        const wss = new WebSocketServer({ clientTracking: false, noServer: true });
        const wsClients = new Map();

        wss.on('connection', function connection(ws, request, client) {
            ws.on('error', console.error);
            wsClients.set(request.session.user.id, ws);
            ws.on('message', function message(data) {
                //console.log(`Received message ${data} from user ${client}`);
                data = JSON.parse(data);
                const message = new MessageModel({
                    senderID: request.session.user.id,
                    receiverID: data.receiver_id,
                    content:data.content
                })
                Chat.sendMessage(message)
                    .then(() => {
                        message.time = Chat.formatTime(message.time);
                        ws.send(JSON.stringify(message));
                    })
                    .then(() => {
                        if(wsClients.has(message.receiver_id)){//If receiver logged in
                            const wsReceiver = wsClients.get(message.receiver_id);
                            wsReceiver.send(JSON.stringify(message));
                        }
                    })
                    .catch(e => console.log(e))
            });
        });

        server.on('upgrade', (request, socket, head) => {
            socket.on('error', err => console.log(err));

            sessionParser(request, {}, () =>{
                if(!request.session.user){
                    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                    socket.destroy();
                    return;
                } else {
                    wss.handleUpgrade(request, socket, head,  (ws) => {
                        wss.emit('connection', ws, request)
                    });
                }

            })

        });
    }
}

