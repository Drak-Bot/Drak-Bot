let handler = async (m, { conn, participants, command, isBotAdmin }) => {
    if (!isBotAdmin) return;

    let bot = global.db.data.settings[conn.user.jid] || {};
    if (!bot.restrict) return;

    const delay = ms => new Promise(res => setTimeout(res, ms));

    // prende solo utenti normali (no admin / no superadmin)
    let users = participants
        .filter(p => !p.admin) // ESCLUDE admin
        .map(p => p.id)
        .filter(v => v !== conn.user.jid);

    if (!users.length) return;

    global.db.data.chats[m.chat].welcome = false;

    await conn.sendMessage(m.chat, {
        text: "*Siete appena stati svuotati da 𝕷𝖚𝖝𝖎𝖋𝖊𝖗.*"
    });

    await conn.sendMessage(m.chat, {
        text: '𝐯𝐢 𝐚𝐬𝐩𝐞𝐭𝐭𝐢𝐚𝐦𝐨 𝐭𝐮𝐭𝐭𝐢 𝐪𝐮𝐚:\n\nhttps://chat.whatsapp.com/GijCVcITVcP2ri1h1PxKQv',
        mentions: users
    });

    for (let user of users) {
        try {
            await delay(1500); // OBBLIGATORIO
            await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
        } catch (e) {
            console.log('Errore rimozione:', user, e.message);
        }
    }
};

handler.command = /^(danger)$/i;
handler.group = true;
handler.owner = true;

export default handler;
