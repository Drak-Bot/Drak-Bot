// plugins/gp-gruppidth.js (ESM)
// Elenco dei gruppi dove il bot è presente

export default function gpGruppidth(sock) {
  if (!sock) {
    console.error("[gp-gruppidth] ERRORE: sock non fornito!");
    return;
  }

  console.log("[gp-gruppidth] Plugin caricato.");

  sock.ev.on('messages.upsert', async (m) => {
    try {
      if (!m.messages || m.type !== 'notify') return;

      const msg = m.messages[0];
      if (!msg || !msg.message || msg.key?.remoteJid === 'status@broadcast') return;

      const from = msg.key.remoteJid;
      if (!from.endsWith('@g.us')) return; // solo gruppi

      const sender = msg.key.participant || msg.key.remoteJid;

      let text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        '';
      text = String(text).trim().toLowerCase();

      if (text !== '.gruppidth') return; // comando diverso → ignora

      // Controllo admin
      const metadata = await sock.groupMetadata(from);
      const admins = metadata.participants.filter(p => p.admin).map(p => p.id);

      if (!admins.includes(sender)) {
        await sock.sendMessage(from, { text: "🚫 Solo gli admin possono usare questo comando." }, { quoted: msg });
        return;
      }

      // Filtra tutti i gruppi dove il bot è presente
      const chats = sock.chats.all().filter(c => c.id.endsWith('@g.us'));

      if (!chats.length) {
        await sock.sendMessage(from, { text: "😢 Non sono in nessun gruppo al momento." }, { quoted: msg });
        return;
      }

      // Costruisci elenco
      let list = "📋 *Elenco dei gruppi dove sono presente:*\n\n";
      chats.forEach((g, i) => {
        list += `${i + 1}. ${g.name || "N/A"}\nID: ${g.id}\n\n`;
      });

      await sock.sendMessage(from, { text: list }, { quoted: msg });

    } catch (err) {
      console.error("[gp-gruppidth] ERRORE interno:", err);
    }
  });
             }
