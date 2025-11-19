let handler = async (m, { conn }) => {
    let user;
    let msgId = "";

    // 1️⃣ Reply
    if (m.quoted) {
        user = m.quoted.sender;
        msgId = m.quoted?.key?.id || "";
    }
    // 2️⃣ Mention
    else if (m.mentions && m.mentions.length > 0) {
        user = m.mentions[0];

        // Prendiamo ultimi 50 messaggi
        const chat = await conn.fetchMessages(m.chat, { limit: 50 });
        const targetMsg = chat.messages.find(msg => msg.key?.participant === user);
        msgId = targetMsg?.key?.id || "";
    }
    // 3️⃣ Nessuno selezionato
    else {
        user = m.sender;
        msgId = m.key?.id || "";
    }

    // Stimiamo il dispositivo da ID
    const id = msgId.toUpperCase();
    let device = "❓ Sconosciuto";

    if (id.startsWith("3EB0")) device = "🤖 Android Boss";
    else if (id.startsWith("BAE5")) device = "🍏 iPhone King";
    else if (id.startsWith("WEB")) device = "🖥️ WhatsApp Web";
    else if (id.startsWith("DESKTOP")) device = "💻 Desktop Don";

    const replyText = `
💀 *💣 CHECK DISPOSITIVO 💣*
────────────────────────
👤 Utente: ${user.split("@")[0]}
📱 Dispositivo stimato: ${device}
────────────────────────
🚨 *Attento, il boss ti sta guardando!*
`;

    await m.reply(replyText);
};

handler.help = ['check @user', 'check (rispondendo a un messaggio)'];
handler.tags = ['info', 'gangster'];
handler.command = /^check$/i;

export default handler;
