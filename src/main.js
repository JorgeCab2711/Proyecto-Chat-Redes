const net = require('net');

const xmppClient = new net.Socket();

xmppClient.on('data', (data) => {
    console.log('Recibido del servidor:', data.toString());
});

xmppClient.on('close', () => {
    console.log('Conexión cerrada.');
});

xmppClient.on('connect', () => {
    console.log('Conectado a alumchat.xyz.');
    // Inicia el stream XMPP después de establecer la conexión
    xmppClient.write(`<?xml version='1.0'?>
<stream:stream to='alumchat.xyz' xmlns='jabber:client' xmlns:stream='http://etherx.jabber.org/streams' version='1.0'>`);
});

xmppClient.connect(5222, 'alumchat.xyz');
