// foxa.js
// Plugin Baileys - comando .foxa (accessibile a tutti i membri)
// Requisiti: @adiwajshing/baileys, pino
// Salva come plugins/foxa.js e importalo nel main con require('./plugins/foxa.js')

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
      console.log('Connesso ✅ (plugin .foxa attivo)');
    }
  });

  sock.ev.on('messages.upsert', async (m) => {
    try {
      if (!m.messages || m.type !== 'notify') return;
      const msg = m.messages[0];
      if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;

      const from = msg.key.remoteJid;
      // accettiamo sia gruppi che chat private
      const sender = (msg.key.participant || msg.key.remoteJid) + '';

      let text = '';
      if (msg.message.conversation) text = msg.message.conversation;
      else if (msg.message.extendedTextMessage) text = msg.message.extendedTextMessage.text || '';
      else if (msg.message.imageMessage?.caption) text = msg.message.imageMessage.caption;
      text = (text || '').trim();

      if (text.toLowerCase() !== '.foxa') return;

      // Testo da inviare (esattamente come richiesto)
      const reply = `Una cosa Facsa😈😡 Te mi uccideresti veramente per un voip?!?! per un fottuto cazzo di voip?!?! 😭😭`;

      await sock.sendMessage(from, { text: reply }, { quoted: msg });

    } catch (err) {
      console.error('Errore plugin .foxa:', err);
    }
  });
}

start().catch(e => console.error(e));
