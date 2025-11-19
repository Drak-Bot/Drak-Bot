let handler = async (m, { conn }) => {
    // Funzione per font decorativo
    let fancyFont = (text) => {
        const chars = {
            "A":"𝓐","B":"𝓑","C":"𝓒","D":"𝓓","E":"𝓔","F":"𝓕","G":"𝓖","H":"𝓗","I":"𝓘","J":"𝓙",
            "K":"𝓚","L":"𝓛","M":"𝓜","N":"𝓝","O":"𝓞","P":"𝓟","Q":"𝓠","R":"𝓡","S":"𝓢","T":"𝓣",
            "U":"𝓤","V":"𝓥","W":"𝓦","X":"𝓧","Y":"𝓨","Z":"𝓩",
            "a":"𝓪","b":"𝓫","c":"𝓬","d":"𝓭","e":"𝓮","f":"𝓯","g":"𝓰","h":"𝓱","i":"𝓲","j":"𝓳",
            "k":"𝓴","l":"𝓵","m":"𝓶","n":"𝓷","o":"𝓸","p":"𝓹","q":"𝓺","r":"𝓻","s":"𝓼","t":"𝓽",
            "u":"𝓾","v":"𝓿","w":"𝔀","x":"𝔁","y":"𝔂","z":"𝔃"
        }
        return text.split("").map(l => chars[l] || l).join("");
    }

    // Ping reale
    let start = new Date().getTime();
    let temp = await conn.sendMessage(m.chat, { text: "⏳ 𝙿𝙸𝙽𝙶𝙸𝙽𝙶..." }, { quoted: m });
    let end = new Date().getTime();
    let ping = end - start;

    // Calcolo uptime
    let totalSeconds = process.uptime();
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = Math.floor(totalSeconds % 60);
    let uptime = `${hours}h ${minutes}m ${seconds}s`;

    // Box decorativo
    let boxTop = "╔══════════════════════╗";
    let boxBottom = "╚══════════════════════╝";
    let line = "──────────────────────";

    // Messaggio finale
    let msg = `
${boxTop}
       ✨ ${fancyFont("PING BOT")} ✨
${line}
⚡ ${fancyFont("Velocità:")} ${ping}ms
💓 ${fancyFont("Status:")} 𝙾𝙽𝙻𝙸𝙽𝙴
🕒 ${fancyFont("Online da:")} ${uptime}
🚀 ${fancyFont("Prestazioni:")} ${ping <= 150 ? "🟢 Ottime" : ping <= 400 ? "🟡 Normali" : "🔴 Lente"}
${boxBottom}
`;

    await conn.sendMessage(m.chat, { text: msg }, { quoted: temp });
};

handler.command = /^ping$/i;
export default handler;
