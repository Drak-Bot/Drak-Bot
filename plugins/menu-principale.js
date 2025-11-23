const handler = async (m, { conn }) => {

const msg = `🏠 *MENU PRINCIPALE*

*Founder* :
➥ 𝕯𝖊ⱥ𝖙𝖍 💀

*Co-Founder* :
➥ 𝑩𝑳𝑶𝑶𝑫 🩸

────────────────────────────────

➥ anesa 💎

➥ ari 👱‍♀️

➥ consigliafilm 🎬

➥ foxa 🦊

➥ tiamo ❤️

➥ pokeball 🏐

➥ bestemmiometro on/off 😠

➥ ping 🚀

➥ staff 🤖

➥ creatore 👑

_Versione_: *1.0*
_Collab_: 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕

`;

await conn.sendMessage(
  m.chat,
  { text: msg },
  { quoted: m }
);

};

handler.command = /^menu$/i;
export default handler;
