// antinuke: attivazione immediata quando qualcuno toglie admin ad un utente
const plugin = {
  all: async function (m, { conn }) {
    try {
      if (!m.isGroup) return;

      const chatSettings = (global.db?.data?.chats?.[m.chat]) || {};
      const antinukeEnabled = ('antinuke' in chatSettings) ? !!chatSettings.antinuke : true;
      if (!antinukeEnabled) return;

      // 🟥 ATTIVAZIONE SOLO QUANDO QUALCUNO TOGLIE ADMIN (stubType 29)
      if (m.messageStubType !== 29) return;

      const metadata = await conn.groupMetadata(m.chat).catch(() => null);
      if (!metadata) return;

      const chatId = m.chat;
      const target = m.messageStubParameters?.[0]; // chi ha perso admin
      const actor = conn.decodeJid(m.participant || m.key?.participant); // chi ha tolto admin
      if (!actor) return;

      const participants = metadata.participants || [];
      const normalizedParticipants = participants.map(u => {
        const normalizedId = conn.decodeJid(u.id);
        return { ...u, id: normalizedId, jid: u.jid || normalizedId };
      });

      if (!global.groupAdminWhitelist) global.groupAdminWhitelist = {};
      if (!global.groupAdminWhitelist[chatId]) global.groupAdminWhitelist[chatId] = new Set();

      const botNumber = conn.decodeJid(conn.user.jid);
      const groupWhitelist = Array.from(global.groupAdminWhitelist[chatId] || []);

      // 🔥 SOLO IL BOT + whitelist sono autorizzati
      const autorizzati = new Set([
        botNumber,
        ...groupWhitelist
      ]);

      // Se l'attore è autorizzato, non fare nulla
      if (autorizzati.has(actor)) return;

      // L'attore è un sospetto → antinuke parte
      const toDemote = [actor];

      await conn.groupParticipantsUpdate(chatId, toDemote, "demote").catch(() => null);
      await conn.groupSettingUpdate(chatId, "announcement").catch(() => null);

      await conn.sendMessage(chatId, {
        text: `🚨 *ANTINUKE ATTIVATO* 🚨\n\n@${actor.split("@")[0]} ha rimosso un admin senza permesso.\n🔒 Sicurezza automatica attivata.`,
        mentions: [actor + "@s.whatsapp.net"]
      }).catch(() => null);

    } catch (e) {
      console.error(e);
    }
  },
  tags: ['admin'],
  group: true
}

export default plugin;
