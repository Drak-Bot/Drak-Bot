// plugins/gp-rsban.js (ESM)
// Roulette ban che NON espelle nessuno.
// Usa solo messaggi e tag del membro casuale.

const delay = ms => new Promise(res => setTimeout(res, ms));

export default function gpRsban(sock) {
  if (!sock) {
    console.error("[gp-rsban] ERRORE: sock non fornito!");
    return;
  }

  console.log("[gp-rsban] Plugin gp-rsban caricato correttamente.");

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

      if (text !== '.rsban') return; // comando diverso → ignora

      console.log(`[gp-rsban] Comando .rsban ricevuto in ${from} da ${sender}`);

      // Ottieni metadata
      const metadata = await sock.groupMetadata(from);
      const admins = metadata.participants.filter(p => p.admin).map(p => p.id);

      // Solo admin possono usare .rsban
      if (!admins.includes(sender)) {
        await sock.sendMessage(from, { text: "🚫 Solo gli admin possono usare questo comando." }, { quoted: msg });
        return;
      }

      const botId = (sock.user?.id || '').split(':')[0] + '@s.whatsapp.net';
      const allMembers = metadata.participants.map(p => p.id);
      const validMembers = allMembers.filter(m => m !== botId);

      if (!validMembers.length) {
        await sock.sendMessage(from, { text: "😢 Nessun membro valido trovato." }, { quoted: msg });
        return;
      }

      // Animazioni
      await sock.sendMessage(from, { text: "🎲 Avvio della roulette ban..." }, { quoted: msg });
      await delay(1000);

      await sock.sendMessage(from, { text: "🔄 Girando la ruota..." });
      await delay(1200);

      await sock.sendMessage(from, { text: "⏳ Sta per uscire un nome..." });
      await delay(1500);

      // Membro casuale
      const chosen = validMembers[Math.floor(Math.random() * validMembers.length)];

      // Messaggio finale SENZA kick
      const resultMsg =
        `✨ 𝕀𝕝 𝕡𝕣𝕖𝕤𝕔𝕖𝕝𝕥𝕠 𝕡𝕖𝕣 𝕝𝕒 𝕣𝕠𝕦𝕝𝕖𝕥𝕥𝕖 𝕓𝕒𝕟 𝕕𝕖𝕝 𝕘𝕣𝕦𝕡𝕡𝕠 è:\n\n` +
        `👉 @${chosen.split("@")[0]}\n\n` +
        `😄 *Tranquillo, non verrai espulso!*`;

      await sock.sendMessage(from, { text: resultMsg, mentions: [chosen] });

    } catch (err) {
      console.error("[gp-rsban] ERRORE interno:", err);
    }
  });
}
