let handler = async (m, { conn }) => {
  const start = Date.now()
  const uptime = process.uptime() * 1000
  const ping = Date.now() - start
  const status = '🟢 Online'

  const formatTime = (ms) => {
    let h = Math.floor(ms / 3600000)
    let m = Math.floor((ms % 3600000) / 60000)
    let s = Math.floor((ms % 60000) / 1000)
    return `${h}h ${m}m ${s}s`
  }

  const message = `╭─❖ 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗢 ❖─⬣
│ 🕐 *Uptime:* ${formatTime(uptime)}
│ ⚡ *Ping:* ${ping} ms
│ 📶 *Stato:* ${status}
╰────────────────────⬣`

  await conn.sendMessage(m.chat, { text: message }, { quoted: m })
}

handler.help = ['status', 'uptime']
handler.tags = ['info']
handler.command = /^status|uptime$/i

export default handler
