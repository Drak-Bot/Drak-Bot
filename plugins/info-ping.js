import fs from "fs"
import { performance } from "perf_hooks"

const handler = async (m, { conn }) => {

    // Calcolo ping
    const start = performance.now();
    await conn.sendMessage(m.chat, { text: "⏱️..." });
    const ping = (performance.now() - start).toFixed(3);

    // Uptime
    const uptime = process.uptime();
    const ore = String(Math.floor(uptime / 3600)).padStart(2, '0');
    const min = String(Math.floor((uptime % 3600) / 60)).padStart(2, '0');
    const sec = String(Math.floor(uptime % 60)).padStart(2, '0');

    const caption = `
🕒 *Uptime:* ${ore}:${min}:${sec}
⚡ *Ping:* ${ping} ms
`.trim();

    // immagine che non si può salvare (viewOnce)
    const img = fs.readFileSync("./media/ping.jpeg");

    await conn.sendMessage(m.chat, {
        image: img,
        caption: caption,
        viewOnce: true  // <<< QUESTA OPZIONE NON PERMETTE DI SALVARE L'IMMAGINE
    });
};

handler.command = /^ping$/i;
handler.help = ['ping'];
handler.tags = ['info'];

export default handler;
