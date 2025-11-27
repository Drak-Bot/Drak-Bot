import { performance } from "perf_hooks"

let handler = async (m, { conn }) => {
  const start = performance.now()

  // invia direttamente il messaggio finale
  const uptime = process.uptime() * 1000
  const status = "🟢 Online"

  const formatTime = (ms) => {
    let h = Math.floor(ms / 3600000)
    let m = Math.floor((ms % 3600000) / 60000)
    let s = Math.floor((ms % 60000) / 1000)
    return `${h}h ${m}m ${s}s`
  }

  // prepara il messaggio
  const msg = `╭─❖ 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗢 ❖─⬣
│ 🕐 *Uptime:* ${formatTime(uptime)}
│ ⚡ *Ping:* calcolando...
│ 📶 *Stato:* ${status}
╰────────────────────⬣`

  // invia il messaggio e misura quanto impiega WA
  await conn.sendMessage(m.chat, { text: msg }, { quoted: m })
  const ping = performance.now() - start

  // aggiorna il messaggio con il ping reale
  const finalMsg = `╭─❖ 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗢 ❖─⬣
│ 🕐 *Uptime:* ${formatTime(uptime)}
│ ⚡ *Ping:* ${ping.toFixed(0)} ms
│ 📶 *Stato:* ${status}
╰────────────────────⬣`

  await conn.sendMessage(m.chat, { text: finalMsg }, { quoted: m })
}

handler.help = ['status', 'uptime']
handler.tags = ['info']
handler.command = /^status|uptime$/i

export default handler
