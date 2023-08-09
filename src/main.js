const net = require('net');
const readline = require('readline');
const { encode } = require('js-base64');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const xmppClient = new net.Socket();

xmppClient.on('data', processServerData);
xmppClient.on('close', handleConnectionClose);

function startApp() {
    console.log('Conexión establecida.');
    displayMainMenu();
}

function displayMainMenu() {
    console.log('\n--- Menú Principal ---');
    console.log('1. Iniciar sesión');
    console.log('2. Crear cuenta');
    console.log('3. Salir');
    rl.question('Elige una opción: ', choice => {
        switch (choice) {
            case '1':
                promptLogin();
                break;
            case '2':
                promptRegister();
                break;
            case '3':
                console.log('Hasta luego.');
                xmppClient.end();
                break;
            default:
                console.log('Opción no reconocida.');
                displayMainMenu();
        }
    });
}

function promptLogin() {
    rl.question('Usuario: ', user => {
        rl.question('Contraseña: ', pass => {
            authenticate(user, pass);
        });
    });
}

function authenticate(username, password) {
    if (!xmppClient.connecting && !xmppClient.connected) {
        xmppClient.connect(5222, 'alumchat.xyz', () => {
            xmppClient.write(`<?xml version='1.0'?>
    <stream:stream to='alumchat.xyz' xmlns='jabber:client' xmlns:stream='http://etherx.jabber.org/streams' version='1.0'>`);
        });
    }

    const authPayload = `<auth xmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='PLAIN'>${encode('\0' + username + '\0' + password)}</auth>`;
    xmppClient.write(authPayload);
}

function promptRegister() {
    rl.question('Usuario: ', user => {
        rl.question('Contraseña: ', pass => {
            registerAccount(user, pass);
        });
    });
}

function registerAccount(username, password) {
    if (!xmppClient.connecting && !xmppClient.connected) {
        xmppClient.connect(5222, 'alumchat.xyz', () => {
            xmppClient.write(`<?xml version='1.0'?>
    <stream:stream to='alumchat.xyz' xmlns='jabber:client' xmlns:stream='http://etherx.jabber.org/streams' version='1.0'>`);
        });
    }

    const registerPayload = `
    <iq type='set' id='reg2'>
      <query xmlns='jabber:iq:register'>
        <username>${username}</username>
        <password>${password}</password>
      </query>
    </iq>`;
    xmppClient.write(registerPayload);
}

function processServerData(data) {
    const dataStr = data.toString();
    if (dataStr.includes('<success')) {
        console.log('Inicio de sesión exitoso.');
        // Aquí puedes continuar con otras funcionalidades o mostrar otro menú.
    } else if (dataStr.includes('<failure')) {
        console.log('Error al iniciar sesión. Intenta nuevamente.');
        displayMainMenu();
    } else if (dataStr.includes('<stream:features>')) {
        // Aquí puedes manejar otras características del stream si es necesario.
    }
    // Puedes agregar más condiciones para manejar otras respuestas del servidor.
}

function handleConnectionClose() {
    console.log('Conexión con el servidor cerrada.');
    rl.close();
}

startApp(); // Lanza la aplicación
