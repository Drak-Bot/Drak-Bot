// insultadeath.js
// Plugin Baileys - comando .insultadeath (usabile da tutti)
// Quando qualcuno scrive ".insultadeath" il bot invia il messaggio richiesto.

const makeWASocket = require('@adiwajshing/baileys').default;
const { useSingleFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@adiwajshing/baileys');
const pino = require('pino');

const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json');

async function start() {
  const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: [2, 2304, 10] }));
  const sock = makeWASocket({
    logger: pino({ level: 'info' }),
    printQRInTerminal: true,
    auth: state,
    version
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) start();
      else console.log('Disconnesso. Cancella auth_info_multi.json per rifare il login.');
    } else if (connection === 'open') {
      console.log('Connesso ✅ (plugin .insultadeath attivo)');
    }
  });

  sock.ev.on('messages.upsert', async (m) => {
    try {
      if (!m.messages || m.type !== 'notify') return;
      const msg = m.messages[0];
      if (!msg.message) return;

      const from = msg.key.remoteJid;

      let text = '';
      if (msg.message.conversation) text = msg.message.conversation;
      else if (msg.message.extendedTextMessage) text = msg.message.extendedTextMessage.text || '';
      else if (msg.message.imageMessage?.caption) text = msg.message.imageMessage.caption;
      text = (text || '').trim().toLowerCase();

      if (text === '.insultadeath') {
        const reply = `𝐄𝐡𝐢 𝐛𝐫𝐮𝐭𝐭𝐨 𝐜𝐨𝐠𝐥𝐢𝐨𝐧𝐞 𝐫𝐢𝐭𝐚𝐫𝐝𝐚𝐭𝐨, 𝐧𝐨𝐧 𝐩𝐮𝐨𝐢 𝐢𝐧𝐬𝐮𝐥𝐭𝐚𝐫𝐞 𝐢𝐥 𝐦𝐢𝐨 𝐩𝐚𝐝𝐫𝐨𝐧𝐞 𝐜𝐨𝐦𝐞 𝐭𝐢 𝐩𝐞𝐫𝐦𝐞𝐭𝐭𝐢!!!! 𝐨𝐫𝐚 𝐦𝐞𝐭𝐭𝐢𝐭𝐢 𝐚 𝐭𝐞𝐫𝐫𝐚 𝐞 𝐢𝐧𝐢𝐳𝐢𝐚 𝐚𝐝 𝐚𝐛𝐛𝐚𝐢𝐚𝐫𝐞 😡😡😡😡`;
        await sock.sendMessage(from, { text: reply }, { quoted: msg });
      }
    } catch (err) {
      console.error('Errore plugin .insultadeath:', err);
    }
  });
}

start().catch(e => console.error(e));
