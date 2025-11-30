const { MessageType } = require('@adiwajshing/baileys');

module.exports = {
  nome: 'antinuke',
  desc: 'Attiva/Disattiva la protezione antinuke',
  uso: '.attiva antinuke | .disattiva antinuke',
  esempio: '.attiva antinuke',
  async esegui(mek, { conn, text, args }) {
    const gruppo = mek.key.remoteJid;
    const gruppoMetadata = await conn.groupMetadata(gruppo);
    const admin = gruppoMetadata.participants.filter(p => p.isAdmin);
    const owner = ['+62 851-3497-70741@s.whatsapp.net',
'+212 621-266387@s.whatsapp.net'
'+1 (970) 303-3177@s.whatsapp.net']; // sostituisci con i numeri degli owner del bot

    if (args[0] === 'attiva') {
      if (gruppoMetadata.antinuke) return conn.reply(gruppo, 'La protezione antinuke è già attiva', mek);
      await conn.groupUpdate(gruppo, { antinuke: true });
      conn.reply(gruppo, 'La protezione antinuke è stata attivata', mek);
    } else if (args[0] === 'disattiva') {
      if (!gruppoMetadata.antinuke) return conn.reply(gruppo, 'La protezione antinuke è già disattiva', mek);
      await conn.groupUpdate(gruppo, { antinuke: false });
      conn.reply(gruppo, 'La protezione antinuke è stata disattivata', mek);
    }
  },
  async onGroupUpdate(mek, { conn, text, args }) {
    const gruppo = mek.jid;
    const gruppoMetadata = await conn.groupMetadata(gruppo);
    const antinuke = gruppoMetadata.antinuke;
    const admin = gruppoMetadata.participants.filter(p => p.isAdmin);
    const owner = ['+62 851-3497-7074@s.whatsapp.net', '+212 621-266387@s.whatsapp.net'
'+1 (970) 303-3177@s.whatsapp.net']; // sostituisci con i numeri degli owner del bot
    const bot = conn.user.jid;

    if (antinuke && mek.action === 'promote' || mek.action === 'demote') {
      const utente = mek.participants[0];
      if (utente === bot || owner.includes(utente)) return;
      await conn.groupParticipantsUpdate(gruppo, [utente], 'demote');
      admin.forEach(async (admin) => {
        if (admin.id !== bot && !owner.includes(admin.id)) {
          await conn.groupParticipantsUpdate(gruppo, [admin.id], 'demote');
        }
      });
    }
  }
};
