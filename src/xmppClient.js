const net = require('net');

class XmppClient {
    constructor(server, port) {
        this.server = server;
        this.port = port;
        this.socket = new net.Socket();
    }

    connect() {
        this.socket.connect(this.port, this.server, () => {
            console.log('Connected to XMPP server');
            // Aquí es donde enviarías el primer stanza para iniciar la secuencia de apertura de la secuencia XMPP
        });

        this.socket.on('data', (data) => {
            console.log('Received data:', data.toString());
            // Aquí es donde analizarías el stanza XMPP recibido y decidirías qué hacer a continuación
        });

        this.socket.on('close', () => {
            console.log('Connection closed');
        });
    }

    send(data) {
        this.socket.write(data);
    }
}

module.exports = XmppClient;
