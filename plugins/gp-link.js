const handler = async (m, { conn, args }) => {
    const metadata = await conn.groupMetadata(m.chat)
    
    await conn.sendMessage(m.chat, {
  text: `Link del gruppo: *${metadata.subject}*`,
  footer: 'Clicca sta merda di bottone e copiati sto link',
  interactiveButtons: [
    { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '𝐓𝐞𝐬𝐭𝐚 𝐝𝐢 𝐜𝐚𝐳𝐳𝐨', copy_code: 'https://chat.whatsapp.com/' + await conn.groupInviteCode(m.chat) }) }
  ],
}, { quoted: m })
}

handler.help = ['linkgroup']
handler.tags = ['group']
handler.command = /^link(gro?up)?$/i
handler.group = true
handler.botAdmin = true

export default handler
