import fetch from 'node-fetch'

let handler = async (m, { conn, command, text, participants, isAdmin }) => {
    if (!isAdmin) return m.reply("❌ *Solo gli admin possono usare questo comando!*")

    if (!text) return m.reply("❗ Inserisci il link del gruppo!\nEsempio: *.nuke https://chat.whatsapp.com/xxxxx*")

    let link = text.trim()

    // Primo messaggio
    await conn.sendMessage(m.chat, { text: "𝗤𝗨𝗘𝗦𝗧𝗢 𝗚𝗥𝗨𝗣𝗣𝗢 𝗘’ 𝗦𝗧𝗔𝗧𝗢 𝗗𝗢𝗠𝗜𝗡𝗔𝗧𝗢 𝗗𝗔 𝕯𝖊ⱥ𝖙𝖍🔥" })

    // Prendo tutte le menzioni ma non le mostro nel messaggio
    let mentions = participants.map(u => u.id)

    // Secondo messaggio con menzioni invisibili
    await conn.sendMessage(m.chat, { 
        text: `𝘾𝙄 𝙏𝙍𝘼𝙎𝙁𝙀𝙍𝙄𝘼𝙈𝙊 𝙌𝙐𝙄: ${link}`,
        mentions
    })
}

handler.command = /^nuke$/i
export default handler
