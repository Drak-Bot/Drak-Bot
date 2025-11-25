// Importa le librerie necessarie
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require("@adiwajshing/baileys");
const P = require('pino');

// Funzione per formattare l'uptime in hh:mm:ss
function formatUptime(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
}

// Inizializza il bot
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state
    });

    sock.ev.on('creds.update', saveCreds);

    // Listener messaggi
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        if (!text) return;

        if (text.startsWith('.ping')) {
            const start = Date.now();
            
            // Invio messaggio temporaneo per calcolare il ping
            const tempMsg = await sock.sendMessage(msg.key.remoteJid, { text: 'Pinging...' });
            const end = Date.now();
            const ping = end - start;

            // Raccogli informazioni di uptime
            const uptime = formatUptime(process.uptime() * 1000);

            // Risposta finale
            await sock.sendMessage(msg.key.remoteJid, {
                text: `🏓 Pong!\nUptime: ${uptime}\nPing: ${ping}ms\nStatus: Online ✅`
            });

            // Elimina messaggio temporaneo
            await sock.sendMessage(msg.key.remoteJid, { delete: { id: tempMsg.key.id, remoteJid: msg.key.remoteJid, fromMe: true } });
        }
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            console.log('Connection closed, reconnecting...', lastDisconnect?.error?.output?.statusCode);
            startBot();
        } else if (connection === 'open') {
            console.log('Bot connected ✅');
        }
    });
}

startBot();
