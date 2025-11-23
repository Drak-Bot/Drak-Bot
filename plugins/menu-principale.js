const handler = async (m, { conn }) => {

const msg = `🏠 *MENU PRINCIPALE*

Founder :
➥ 𝘿𝙚𝙖𝙩𝙝 💀

Co-Founder :
➥ BLOOD#velith 🔥

_versione_ : *1.0*
───────────────────────────
➥ ari 👱‍♀️
➥ consigliafilm 🎬
➥ foxa 🦊
➥ tiamo ❤️
➥ pokeball 🏐
➥ bestemmiometro on/off 😠
➥ ping 🚀
➥ staff 🤖
➥ creatore 👑
`;

await conn.sendMessage(m.chat, {
    text: msg,
    footer: "Scegli un menu:",
    templateButtons: [
        { index: 1, quickReplyButton: { displayText: "🏠 Menu Principale", id: ".menu" }},
        { index: 2, quickReplyButton: { displayText: "🛡️ Menu Admin", id: ".menuadmin" }},
        { index: 3, quickReplyButton: { displayText: "🚨 Menu Sicurezza", id: ".menusicurezza" }},
        { index: 4, quickReplyButton: { displayText: "👥 Menu Gruppo", id: ".menugruppo" }},
        { index: 5, quickReplyButton: { displayText: "🤖 Menu IA", id: ".menuia" }}
    ]
}, { quoted: m });

};

handler.command = /^menu$/i;
export default handler;
