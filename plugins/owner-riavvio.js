const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const handler = async (m, { conn }) => {

    // Avviso iniziale
    await conn.sendMessage(m.chat, { text: "🔄 Sto riavviando il bot..." }, { quoted: m });

    await delay(1000);
    await conn.sendMessage(m.chat, { text: "🚀 Avvio sequenza di riavvio..." });

    await delay(1000);
    await conn.sendMessage(m.chat, { text: "⏳ Riavvio in corso..." });

    await delay(1000);
    await conn.sendMessage(m.chat, { text: "✅ Bot riavviato con successo!" });

    // Chiude il processo (ChatUnity lo riapre automaticamente)
    process.exit(0);
};

handler.help = ["riavvia"];
handler.tags = ["owner"];
handler.command = ["riavvia", "reiniciar"];
handler.owner = true;

export default handler;
