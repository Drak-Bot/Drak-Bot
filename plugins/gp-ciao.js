let handler = async (m, { conn }) => {
    // Controlla se il bot è stato aggiunto al gruppo
    if (!m.isGroup) return;  // Solo gruppi

    const botNumber = conn.user.id.split(":")[0];

    // Se tra i nuovi membri c'è il bot
    if (m.action === "add" && m.participants.includes(botNumber)) {
        await conn.sendMessage(m.chat, { text: "𝐂𝐢𝐚𝐨 𝐟𝐫𝐨𝐜𝐢 𝐝𝐞 𝐦𝐞𝐫𝐝𝐚" });
    }
}

handler.all = true;  // Deve ascoltare tutti gli eventi
handler.help = ['greetOnJoin']
handler.tags = ['group']
handler.command = /^$/  // Non richiede comando

export default handler;
