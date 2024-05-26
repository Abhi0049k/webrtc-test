import { FC, useEffect } from "react";
// import { useRef } from "react";

const Receiver: FC = () => {
    // const videoRef = useRef<HTMLVideoElement>(null)
    // const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        let pc: RTCPeerConnection | null = null;
        const socket = new WebSocket("ws://localhost:8998");
        socket.onopen = () => {
            socket.send(JSON.stringify({ type: "identify-as-receiver" }));
        }
        // setSocket(socket);
        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            if (message.type === "create-offer") {
                pc = new RTCPeerConnection(); // creating RTCPeerConnection instance
                // setting offer which we received from client 1 in remote description
                pc.setRemoteDescription(message.offer);
                // creating an answer using pc.createAnswer();
                const answer = await pc.createAnswer();
                // setting the created answer in local description
                await pc.setLocalDescription(answer);
                socket.send(JSON.stringify({ type: "create-answer", offer: pc.localDescription }))
                pc.onicecandidate = (event) => {
                    console.log(event);
                    if (event.candidate) {
                        // We are sending ice candidates to client 1 and this process of trickling ice candidate is known as trickle
                        socket.send(JSON.stringify({ type: "ice-candidate-from-receiver", candidate: event.candidate }))
                    }
                }
                pc.ontrack = (event) => {
                    alert("adding tracks");
                    const video = document.createElement('video');
                    document.body.appendChild(video);
                    video.srcObject = new MediaStream([event.track]);
                    video.play();
                }
            } else if (message.type === "ice-candidate") {
                alert("adding ice candidates")
                if (pc) {
                    pc.addIceCandidate(message.candidate);
                }
            }
        }
        return () => {
            socket.close();
            if (pc) pc.close();
        }
    }, [])
    return (
        <div>
            Receiver
            {/* <video className="border-white" src={videoRef.current} ref={videoRef} autoPlay></video> */}
        </div>
    );
}

export default Receiver