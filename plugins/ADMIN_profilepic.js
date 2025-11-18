// Plugins Di Gabs333 - Velocizzato
let handler = async (m, { conn }) => {
    let who = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
    if (who === conn.user.jid) return m.reply('🚫 𝐈𝐦𝐩𝐨𝐬𝐬𝐢𝐛𝐢𝐥𝐞 𝐨𝐭𝐭𝐞𝐧𝐞𝐫𝐞 𝐥𝐚 𝐟𝐨𝐭𝐨 𝐝𝐢 𝐬𝐭𝐨 𝐧𝐞𝐠𝐫𝐨.');
    try {
        let pic = await conn.profilePictureUrl(who, 'image');
        conn.sendMessage(m.chat, { image: { url: pic }, caption: '📸' }, { quoted: m, mentions: [who] });
    } catch {
        m.reply(`@${who.split('@')[0]} 𝐒𝐭𝐨 𝐧𝐞𝐠𝐫𝐨 𝐧𝐨𝐧 𝐡𝐚 𝐟𝐨𝐭𝐨 𝐩𝐫𝐨𝐟𝐢𝐥𝐨 🚫`, null, { mentions: [who] });
    }
};
handler.command = /^(pic)$/i;
handler.group = true;
handler.admin = true;
export default handler;                         
