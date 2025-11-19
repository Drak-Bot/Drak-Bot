let handler = async (m, { conn }) => {

    if (!m.quoted) {
        return m.reply("❌ *Devi rispondere ad un messaggio per fare il check!*");
    }

    let target = m.quoted.sender;
    let device = m.quoted.device || "unknown";

    let tipo = "Sconosciuto";

    device = device.toString().toLowerCase();

    if (device.includes("android")) tipo = "📱 Android";
    else if (device.includes("ios") || device.includes("iphone")) tipo = "📱 iPhone";
    else if (device.includes("web")) tipo = "🖥️ Web WhatsApp";
    else if (device.includes("desktop")) tipo = "💻 PC Desktop";

    m.reply(`🔍 *Analisi dispositivo*\n\n👤 Utente: @${target.split("@")[0]}\n📱 Dispositivo: *${tipo}*`, {
        mentions: [target]
    });

};

handler.help = ['check'];
handler.tags = ['info'];
handler.command = /^check$/i;

export default handler;
