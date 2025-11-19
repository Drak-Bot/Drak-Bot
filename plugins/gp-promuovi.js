let handler = async (m, { conn }) => {
    if (!m.isGroup) throw '❌ Questo comando funziona solo nei gruppi.';

    // Prendo metadata gruppo
    let group = await conn.groupMetadata(m.chat);
    let admins = group.participants
        .filter(u => u.admin)
        .map(u => u.id);

    // Controllo se il mittente è admin
    if (!admins.includes(m.sender))
        throw '❌ Solo gli admin possono usare questo comando.';

    // Tag obbligatorio
    let user = m.mentionedJid[0];
    if (!user) throw '📌 Tagga qualcuno da promuovere.';

    // Promozione
    await conn.groupParticipantsUpdate(m.chat, [user], 'promote');

    // Messaggio finale
    let msg = `@${m.sender.split('@')[0]} 𝐇𝐚 𝐝𝐚𝐭𝐨 𝐢 𝐩𝐨𝐭𝐞𝐫𝐢 𝐚 @${user.split('@')[0]}`;

    await conn.sendMessage(
        m.chat,
        { text: msg, mentions: [m.sender, user] },
        { quoted: m }
    );
};

handler.command = /^(promuovi|p)$/i;
export default handler;
