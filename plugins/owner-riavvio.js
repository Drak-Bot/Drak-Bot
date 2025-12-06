const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const handler = async (m, { conn }) => {
    if (!process.send) throw '❌ Usa: node index.js\nNon usare: node main.js';

    const { key } = await conn.sendMessage(m.chat, { text: `Sto riavviando...` }, { quoted: m });
    
    await delay(1000);
    await conn.sendMessage(m.chat, { text: `🚀🚀🚀🚀`, edit: key });

    await delay(1000);
    await conn.sendMessage(m.chat, { text: `🚀🚀🚀🚀🚀🚀`, edit: key });

    await delay(1000);
    await conn.sendMessage(m.chat, { text: `Riavviato con successo`, edit: key });

    process.exit(0);
}

handler.help = ['riavvia'];
handler.tags = ['owner'];
handler.command = ['riavvia', 'reiniciar'];
handler.owner = true;

export default handler;
