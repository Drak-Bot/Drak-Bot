const handler = async (m, { conn }) => {

const msg = `🏠 *MENU PRINCIPALE*

*Founder* :
➥ 𝕯𝖊ⱥ𝖙𝖍 💀

*Co-Founder* :
➥ 𝑩𝑳𝑶𝑶𝑫 🩸

_versione_ : *1.0*
────────────────────────────────

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

await conn.sendMessage(
  m.chat,
  { text: msg },
  { quoted: m }
);

};

handler.command = /^menu$/i;
export default handler;
