This app establishes one-way communication between client 1 and client 2 i.e., client 1 sending video to client 2

WebRTC Call is P2P call{communication happens directly between the parties}

1. Creating Signalling Server[Backend will contain logic for this]

Let's say there are two clients and client 1 initiates the video call[sending his video to client 2];

2. client 1 will createOffer(containing SDP(Session Description Protocol)) and will send it to client 2
3. Client 2 will respond back with its SDP(Session Description Protocol)

The Above the 3 points will be enough to start the communication between the 2 parties.

Trickle Ice: Whenever the client receives ice candidates from the stun server, it needs to share the ice candidates with the other party

4. client 1 will send addIceCandidate to client 2 and vice-versa