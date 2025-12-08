let handler = async (m, { conn }) => {
    try {
        const { participants, action, id } = m;

        // Non è un update di partecipanti → ignora
        if (!participants || !action) return;

        // Numero del bot
        const botId = conn.user.id.split(":")[0];

        // Se il bot è stato aggiunto o è entrato
        if ((action === "add" || action === "invite") && participants.includes(botId)) {
            await conn.sendMessage(m.chat, { 
                text: "𝐂𝐢𝐚𝐨 𝐟𝐫𝐨𝐜𝐢 𝐝𝐞 𝐦𝐞𝐫𝐝𝐚" 
            });
        }

    } catch (err) {
        console.error("Errore evento join bot:", err);
    }
}

handler.participants = true; // 🔥 fondamentale
handler.help = ['greetOnJoin'];
handler.tags = ['group'];
handler.command = /^$/; // nessun comando

export default handler;
