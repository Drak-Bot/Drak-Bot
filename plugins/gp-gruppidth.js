// plugins/gp-gruppidth.js (ESM)
// Comando: .gruppidth
// Il bot mostra l’elenco di tutti i gruppi dove è presente

export default function gpGruppidth(sock) {
  sock.ev.on("messages.upsert", async (m) => {
    try {
      if (!m.messages || m.type !== "notify") return;

      const msg = m.messages[0];
      if (!msg || !msg.message || msg.key.remoteJid === "status@broadcast") return;

      const from = msg.key.remoteJid;
      if (!from.endsWith("@g.us")) return;

      const sender = msg.key.participant || msg.key.remoteJid;

      let text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        "";

      text = String(text).trim().toLowerCase();

      if (text !== ".gruppidth") return;

      // Controllo admin del gruppo
      const metadata = await sock.groupMetadata(from);
      const admins = metadata.participants.filter(p => p.admin).map(p => p.id);

      if (!admins.includes(sender)) {
        await sock.sendMessage(from, { text: "🚫 Solo gli admin possono usare questo comando." }, { quoted: msg });
        return;
      }

      // Ottieni tutti i gruppi dove il bot è presente
      const groups = await sock.groupFetchAllParticipating();
      const ids = Object.keys(groups);

      if (!ids.length) {
        await sock.sendMessage(from, { text: "😢 Non sono in nessun gruppo." }, { quoted: msg });
        return;
      }

      // Costruisci lista
      let result = "📋 *Gruppi dove sono presente:*\n\n";

      ids.forEach((id, i) => {
        const g = groups[id];
        result += `${i + 1}. *${g.subject || "Senza nome"}*\nID: ${id}\n\n`;
      });

      await sock.sendMessage(from, { text: result }, { quoted: msg });

    } catch (err) {
      console.error("[gp-gruppidth] Errore:", err);
    }
  });
}
