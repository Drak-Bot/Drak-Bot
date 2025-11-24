import path from 'path';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (message, { conn }) => {

    const start = performance.now();
    const ping = Math.round(performance.now() - start);

    const uptimeMs = process.uptime() * 1000;
    const uptime = formatTime(uptimeMs);

    const imgPath = path.join(__dirname, '../media/ping.jpeg');

    const caption = `
🏓 *Ping:* ${ping}ms
⏳ *Uptime:* ${uptime}
`.trim();

    await conn.sendMessage(message.chat, {
        image: { url: imgPath },
        caption: caption
    });
};

handler.help = ['ping'];
handler.tags = ['info'];
handler.command = /^ping$/i;

export default handler;


function formatTime(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return `${h}h ${m}m ${s}s`;
}
