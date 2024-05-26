import { FC, useEffect, useState } from "react";

const Sender: FC = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const handleSendingVideo = async () => {
        // create an offer
        if (!socket) return;
        alert("Reaching here");
        const pc = new RTCPeerConnection();
        pc.onnegotiationneeded = async () => {
            const offer = await pc.createOffer(); // creating an offer
            await pc.setLocalDescription(offer); // setting offer in local description 
            // sending offer to client 2 over websocket connection
            socket?.send(JSON.stringify({ type: "create-offer", offer: pc.localDescription }))
        }

        socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            // create-answer if block is used to handle answers from client 2 or receiver side
            if (data.type === "create-answer") {
                // setting the answer received from client 2 or receiver in remoteDescription
                pc.setRemoteDescription(data.answer);
            } else if (data.type === "ice-candidate") {
                pc.addIceCandidate(data.candidate);
            }
        }

        pc.onicecandidate = (event) => {
            console.log(event);
            if (event.candidate) {
                // We are sending ice candidates to client 2 and this process of trickling ice candidate is known as trickle
                alert("sending ice candidate")
                socket.send(JSON.stringify({ type: "ice-candidate-from-sender", candidate: event.candidate }))
            }
        }
        // const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

        // pc.addTrack(stream.getVideoTracks()[0]);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            stream.getTracks().forEach(track => {
                pc.addTrack(track, stream)
                alert("Media track added");
            })
        } catch (error) {
            console.error("Error accessing media devices: ", error);
        }
    };

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8998");
        socket.onopen = () => {
            socket.send(JSON.stringify({ type: "identify-as-sender" }));
        }
        setSocket(socket);
    }, [])

    return (
        <div>
            Sender
            <button onClick={handleSendingVideo}>Start Video Sharing</button>
        </div>
    );
}

export default Sender;