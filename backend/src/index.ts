import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8998 }, () => {
    console.log("WebSocket Server running on Port : 8998")
});

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

/**
 * create offer
 * create answer
 * add ice candidate
 */

wss.on('connection', (ws) => {
    ws.on('error', console.error);
    console.log('Connection Established');
    ws.on("message", (data: any) => {
        const message = JSON.parse(data);
        if (message.type === "identify-as-sender") {
            senderSocket = ws;
        } else if (message.type === "identify-as-receiver") {
            receiverSocket = ws;
        } else if (message.type === "create-offer") {
            console.log(message.offer);
            receiverSocket?.send(JSON.stringify({ type: "create-offer", offer: message.offer }));
        } else if (message.type === "create-answer") {
            senderSocket?.send(JSON.stringify({ type: "create-answer", answer: message.offer }));
        } else if (message.type === "ice-candidate-from-receiver") {
            senderSocket?.send(JSON.stringify({ type: "ice-candidate", candidate: message.candidate }))
        } else if (message.type === "ice-candidate-from-sender") {
            receiverSocket?.send(JSON.stringify({ type: "ice-candidate", candidate: message.candidate }))
        }
    })
    ws.send(JSON.stringify({ type: "welcome-msg", msg: "Thank you for establishing connection with me!" }))
})