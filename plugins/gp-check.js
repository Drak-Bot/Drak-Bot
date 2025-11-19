// check-gangster.js
let handler = async (m, { conn }) => {
    let targetMessage;
    let user;

    // 1️⃣ Se rispondi a un messaggio
    if (m.quoted) {
        targetMessage = m.quoted;
        user = m.quoted.sender;
    }
    // 2️⃣ Se menzioni qualcuno
    else if (m.mentions && m.mentions.length > 0) {
        user = m.mentions[0];

        // Prendi ultimi 50 messaggi per trovare l'ultimo dell'utente
        const chat = await conn.fetchMessages(m.chat, { limit: 50 });
        targetMessage = chat.messages.find(msg => msg.key.participant === user);

        if (!targetMessage)
            return m.reply("❌ Non trovo messaggi recenti di questo utente, sei troppo veloce 😎");
    }
    // 3️⃣ Nessuno selezionato
    else {
        return m.reply("📌 *Uso del comando gangster*:\n• `.check @utente`\n• Rispondi a un messaggio e fai `.check` 🔥");
    }

    // 4️⃣ Analizza ID del messaggio
    const msgId = targetMessage.key.id.toUpperCase();
    let device = "❓ Sconosciuto";

    if (msgId.startsWith("3EB0")) device = "🤖 *Android Gangster*";
    else if (msgId.startsWith("BAE5")) device = "🍏 *iPhone Boss*";
    else if (msgId.startsWith("WEB")) device = "🖥️ *WhatsApp Web*";
    else if (msgId.startsWith("DESKTOP")) device = "💻 *Desktop King*";

    // 5️⃣ Messaggio finale stile gangster
    const replyText = `
💀 *💣 CHECK DISPOSITIVO 💣*
────────────────────────
👤 Utente: @${user.split("@")[0]}
📱 Dispositivo stimato: ${device}
────────────────────────
🚨 *Stai attento, il boss ti sta guardando!*
`;

    m.reply(replyText, { mentions: [user] });
};

handler.help = ['check @user', 'check (rispondendo a un messaggio)'];
handler.tags = ['info', 'gangster'];
handler.command = /^check$/i;

export default handler;
