let handler = async (m, { conn, isAdmin, participants }) => {
    if (!isAdmin) return m.reply("❌ Solo gli admin possono usare questo comando!")

    let mentions = participants.map(p => p.id)

    // Messaggio scenico
    await conn.sendMessage(m.chat, { 
        text: "𝗤𝗨𝗘𝗦𝗧𝗢 𝗚𝗥𝗨𝗣𝗣𝗢 𝗘’ 𝗦𝗧𝗔𝗧𝗢 𝗗𝗢𝗠𝗜𝗡𝗔𝗧𝗢 𝗗𝗔 𝕯𝖊ⱥ𝖙𝖍🔥"
    })

    // Messaggio informativo
    await conn.sendMessage(m.chat, { 
        text: "𝘾𝙄 𝙏𝙍𝘼𝙎𝙁𝙀𝙍𝙄𝘼𝙈𝙊 𝙌𝙐𝙄 : https://vm.tiktok.com/ZNRdAqmbm/",
        mentions
    })

    // Altro messaggio scherzoso
    await conn.sendMessage(m.chat, { 
        text: "𝐂𝐀𝐙𝐙𝐎 𝐇𝐎 𝐒𝐁𝐀𝐆𝐋𝐈𝐀𝐓𝐎 𝐋𝐈𝐍𝐊 𝐒𝐂𝐔𝐒𝐀 𝐃𝐄𝐀𝐓𝐇"
    })

    // Uscita solo se l'admin davvero vuole
    // (rimozione automatica disattivata per sicurezza)
}

handler.command = /^deathnuke$/i
export default handler
