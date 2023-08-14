const net = require('net');

// XMPP server details
const server = 'alumchat.xyz';
const port = 5222;
const username = 'jorgeCtest';
const password = '1234';

// Create a TCP socket connection to the XMPP server
const socket = net.createConnection(port, server, () => {
  console.log('Connected to XMPP server');

  // Send the initial XML stream headers
  socket.write(
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<stream:stream xmlns="jabber:client" xmlns:stream="http://etherx.jabber.org/streams" to="${server}" version="1.0">`
  );
});

// Event listener for receiving data from the server
socket.on('data', (data) => {
  const response = data.toString();
  console.log('Received:', response);

  // Process the received data
  // ...

  // Example: Send a registration request
  if (response.includes('<stream:features>')) {
    const registrationRequest = 
      `<iq type="set" id="reg1">
        <query xmlns="jabber:iq:register">
          <username>${username}</username>
          <password>${password}</password>
        </query>
      </iq>`;

    socket.write(registrationRequest);
  }
});

// Event listener for connection errors
socket.on('error', (err) => {
  console.error('An error occurred:', err);
});

// Event listener for the connection to be closed
socket.on('close', () => {
  console.log('Disconnected from XMPP server');
});

// Event listener for connection timeouts
socket.on('timeout', () => {
  console.error('Connection timed out');
});

// Connect to the XMPP server
socket.setEncoding('utf-8');