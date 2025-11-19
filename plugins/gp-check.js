let handler = async (m, { conn }) => {
    let user;

    // Risposta a un messaggio
    if (m.quoted) {
        user = m.quoted.sender;
    }
    // Menzione
    else if (m.mentions && m.mentions.length > 0) {
        user = m.mentions[0];
    }
    // Nessuno selezionato
    else {
        return m.reply("❌ Devi rispondere a un messaggio o menzionare un utente!\nEsempio:\n• `.check @utente`\n• Rispondi ad un messaggio e fai `.check`");
    }

    // Garantiamo che sia una stringa valida JID
    if (!user || typeof user !== 'string') user = m.sender;

    // Messaggio gangster finale
    const replyText = `
💀 *💣 CHECK DISPOSITIVO 💣*
────────────────────────
👤 Utente: @${user.split("@")[0]}
📱 Dispositivo stimato: ❓ Sconosciuto
────────────────────────
🚨 *Attento, il boss ti sta guardando!*
`;

    // Invia con menzione
    await m.reply(replyText, { mentions: [user] });
};

handler.help = ['check @user', 'check (rispondendo a un messaggio)'];
handler.tags = ['info', 'gangster'];
handler.command = /^check$/i;

export default handler;
