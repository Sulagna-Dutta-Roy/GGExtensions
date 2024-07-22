const signalingServer = 'wss://your-signaling-server.com';
const connection = new WebSocket(signalingServer);

connection.onopen = () => {
    console.log('WebSocket connection established');
};

connection.onmessage = (message) => {
    const data = JSON.parse(message.data);
    // Handle signaling data here
};

const peerConnection = new RTCPeerConnection();

peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
        connection.send(JSON.stringify({ candidate: event.candidate }));
    }
};

peerConnection.ondatachannel = (event) => {
    const dataChannel = event.channel;
    dataChannel.onmessage = (event) => {
        document.getElementById('collabContent').value = event.data;
    };
};

const dataChannel = peerConnection.createDataChannel('collabChannel');
dataChannel.onopen = () => {
    console.log('Data channel open');
};

document.getElementById('collabContent').addEventListener('input', (event) => {
    const content = event.target.value;
    dataChannel.send(content);
});