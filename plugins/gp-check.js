let handler = async (m, { conn }) => {
    let targetMessage;
    let user;

    // 1️⃣ Risposta a un messaggio
    if (m.quoted) {
        targetMessage = m.quoted;
        user = m.quoted.sender;
    }
    // 2️⃣ Menzione
    else if (m.mentions && m.mentions.length > 0) {
        user = m.mentions[0];

        // Prendi ultimi 50 messaggi della chat
        const chat = await conn.fetchMessages(m.chat, { limit: 50 });
        targetMessage = chat.messages.find(msg => msg.key.participant === user);
    }

    // 3️⃣ Nessun target valido
    if (!user) {
        return m.reply("❌ Devi rispondere a un messaggio o menzionare un utente!\n\nEsempio:\n• `.check @utente`\n• Rispondi ad un messaggio e fai `.check`");
    }

    // 4️⃣ Se non trovi messaggio
    if (!targetMessage) {
        return m.reply(`⚠️ Non ho trovato messaggi recenti di @${user.split("@")[0]}, non posso stimare il dispositivo`, { mentions: [user] });
    }

    // 5️⃣ Analizza ID messaggio per stimare dispositivo
    const msgId = targetMessage.key.id?.toUpperCase() || "";
    let device = "❓ Sconosciuto";

    if (msgId.startsWith("3EB0")) device = "🤖 Android Boss";
    else if (msgId.startsWith("BAE5")) device = "🍏 iPhone King";
    else if (msgId.startsWith("WEB")) device = "🖥️ WhatsApp Web";
    else if (msgId.startsWith("DESKTOP")) device = "💻 Desktop Don";

    // 6️⃣ Messaggio finale stile gangster
    const replyText = `
💀 *💣 CHECK DISPOSITIVO 💣*
────────────────────────
👤 Utente: @${user.split("@")[0]}
📱 Dispositivo stimato: ${device}
────────────────────────
🚨 *Attento, il boss ti sta guardando!*
`;

    m.reply(replyText, { mentions: [user] });
};

handler.help = ['check @user', 'check (rispondendo a un messaggio)'];
handler.tags = ['info', 'gangster'];
handler.command = /^check$/i;

export default handler;
