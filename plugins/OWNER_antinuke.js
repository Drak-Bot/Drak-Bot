// ===== Anti-Nuke .420 Plugin =====
// Compatibile con bot basati su baileys/whiskeysockets

let antiNuke = {};

module.exports = {
   comando: ['420', '420sban'],
   descrizione: 'AntiNuke .420 – protegge gli admin del gruppo',
   
   async run(sock, msg, args) {
      const from = msg.key.remoteJid;
      const sender = msg.key.participant || msg.participant;
      const comando = msg.body?.toLowerCase();

      if (!msg.isGroup) {
         return sock.sendMessage(from, { text: "Questo comando funziona solo nei gruppi." });
      }

      // Controllo che il bot sia admin
      const metadata = await sock.groupMetadata(from);
      const botId = sock.user.id.split(":")[0] + "@s.whatsapp.net";
      const botAdmin = metadata.participants.find(m => m.id === botId)?.admin;

      if (!botAdmin) {
         return sock.sendMessage(from, { text: "Devo essere admin per usare l'Anti-Nuke." });
      }

      // ATTIVA
      if (comando === ".420") {
         antiNuke[from] = true;
         return sock.sendMessage(from, { text: "🛡️ Anti-Nuke .420 ATTIVATO" });
      }

      // DISATTIVA
      if (comando === ".420sban") {
         antiNuke[from] = false;
         return sock.sendMessage(from, { text: "🛑 Anti-Nuke .420 DISATTIVATO" });
      }
   }
};

// ===== WATCHER PER EVENTI DEL GRUPPO =====
module.exports.groupUpdate = async (sock, update) => {
   try {
      const grupo = update.id;

      if (!antiNuke[grupo]) return; // antinuke disabilitato

      for (let action of update.participants) {
         // qualcuno è stato rimosso dal ruolo admin?
         if (action.admin === 'demote') {

            const metadata = await sock.groupMetadata(grupo);
            const botId = sock.user.id.split(":")[0] + "@s.whatsapp.net";

            // lista di tutti gli admin
            let admins = metadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');

            // Rimuove admin a tutti tranne al bot
            for (let adm of admins) {
               if (adm.id !== botId) {
                  await sock.groupParticipantsUpdate(grupo, [adm.id], "demote");
               }
            }

            await sock.sendMessage(grupo, { text: "⚠️ *Attacco rilevato!* Anti-Nuke .420 attivato.\nTutti gli admin sono stati rimossi eccetto il bot." });
         }
      }
   } catch (e) {
      console.log("Errore Anti-Nuke:", e);
   }
};
