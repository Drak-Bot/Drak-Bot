const { MessageType } = require('@adiwajshing/baileys');

module.exports = {
  nome: 'anticambio',
  desc: 'Impedisce il cambio link del gruppo',
  uso: '.anticambio on/off',
  esempio: '.anticambio on',
  async esegui(mek, { conn, text, args }) {
    const gruppo = mek.key.remoteJid;
    const owner = ['+6285134977074@s.whatsapp.net', '+212621266387@s.whatsapp.net']; // numeri degli owner del bot
    const bot = conn.user.jid;

    if (args[0] === 'on') {
      await conn.groupUpdateSetting(gruppo, 'anticambio', true);
      conn.reply(gruppo, 'La protezione anticambio è stata attivata', mek);
    } else if (args[0] === 'off') {
      await conn.groupUpdateSetting(gruppo, 'anticambio', false);
      conn.reply(gruppo, 'La protezione anticambio è stata disattivata', mek);
    } else {
      conn.reply(gruppo, 'Utilizzo: .anticambio on/off', mek);
    }
  },
  async onGroupUpdate(mek, { conn, text, args }) {
    const gruppo = mek.jid;
    const anticambio = await conn.groupGetSetting(gruppo, 'anticambio');
    const owner = ['+6285134977074@s.whatsapp.net', '+212621266387@s.whatsapp.net']; // numeri degli owner del bot
    const bot = conn.user.jid;

    if (anticambio && mek.action === 'updateGroupSettings' && mek.update.groupSettingsChange === 'inviteLink') {
      await conn.groupRevokeInvite(gruppo);
      conn.reply(gruppo, 'Il cambio link del gruppo non è permesso', mek);
    }
  }
};
