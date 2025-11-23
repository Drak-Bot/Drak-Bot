// plugin-menu.js

let handler = async (m, { conn }) => {

let menu = `
🤖 *ᴍᴇɴᴜ ʙᴏᴛ* 🤖

𝔽𝕠𝕦𝕟𝕕𝕖𝕣 :
➠ 𝕯𝖊ⱥ𝖙𝖍 💀

ℂ𝕠-𝔽𝕠𝕦𝕟𝕕𝕖𝕣 :
➠ 𝐁𝐋𝐎𝐎𝐃#ᵛᵉˡᶦᵗʰ 🩸

_versione_ : *1.0*
-------------------------------------------------------------

➠ ari 👩🏻‍🦳
➠consigliafilm 🎬
➠ foxa 🦊
➠ tiamo ❤️
➠ pokeball 🏐
➠ bestemmiometro on/off 🤬
➠ ping 🚀
➠ staff 🤖
➠ creatore 👑
`

await conn.reply(m.chat, menu, m)

}

handler.command = /^menu$/i
export default handler
