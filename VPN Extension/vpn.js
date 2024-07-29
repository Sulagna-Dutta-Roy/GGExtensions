document.addEventListener('DOMContentLoaded', () => {
    const connectBtn = document.getElementById('connect-btn');
    const disconnectBtn = document.getElementById('disconnect-btn');
    const statusText = document.getElementById('status');

    connectBtn.addEventListener('click', () => {
        console.log('Connect button clicked');
        connectVPN();
    });

    disconnectBtn.addEventListener('click', () => {
        console.log('Disconnect button clicked');
        disconnectVPN();
    });

    function connectVPN() {
        console.log('Connecting to VPN...');
        statusText.textContent = 'Status: Connecting...';

        // Simulate a delay to mimic the VPN connection process
        setTimeout(() => {
            console.log('VPN connected');
            statusText.textContent = 'Status: Connected';
        }, 2000); // Adjust the delay as needed
    }

    function disconnectVPN() {
        console.log('Disconnecting from VPN...');
        statusText.textContent = 'Status: Disconnecting...';

        // Simulate a delay to mimic the VPN disconnection process
        setTimeout(() => {
            console.log('VPN disconnected');
            statusText.textContent = 'Status: Disconnected';
        }, 2000); // Adjust the delay as needed
    }
});
