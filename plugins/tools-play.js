import yts from "yt-search"
import fetch from "node-fetch"

const handler = async (m, { conn, text, command, usedPrefix }) => {
  if (!text)
    return m.reply(`❗ Inserisci il titolo o il link YouTube`)

  const search = await yts(text)
  const video = search.videos[0]
  if (!video) return m.reply("❗ Nessun risultato trovato.")

  const url = video.url
  const title = video.title

  // 🔥 API SICURE FUNZIONANTI
  const AUDIO_API = `https://api.guruapi.tech/api/ytmp3?url=${encodeURIComponent(url)}`
  const VIDEO_API = `https://api.guruapi.tech/api/ytmp4?url=${encodeURIComponent(url)}`

  try {
    if (command === "play" || command === "play2") {
      return conn.sendMessage(m.chat, {
        text: `🎵 *${title}*\n\nScegli cosa scaricare 👇`,
        buttons: [
          { buttonId: `${usedPrefix}playaudio ${url}`, buttonText: { displayText: "🎧 Audio" }, type: 1 },
          { buttonId: `${usedPrefix}playvideo ${url}`, buttonText: { displayText: "🎬 Video" }, type: 1 }
        ]
      }, { quoted: m })
    }

    if (command === "playaudio") {
      let res = await fetch(AUDIO_API).then(a => a.json())
      if (!res?.url) return m.reply("❗ Errore nel download audio")

      return conn.sendMessage(m.chat, {
        audio: { url: res.url },
        mimetype: "audio/mpeg",
        fileName: `${title}.mp3`
      }, { quoted: m })
    }

    if (command === "playvideo") {
      let res = await fetch(VIDEO_API).then(a => a.json())
      if (!res?.url) return m.reply("❗ Errore nel download video")

      return conn.sendMessage(m.chat, {
        video: { url: res.url },
        mimetype: "video/mp4",
        fileName: `${title}.mp4`,
        caption: title
      }, { quoted: m })
    }

  } catch (e) {
    console.log(e)
    return m.reply("❗ Errore interno, riprova tra poco")
  }
}

handler.command = ['play', 'play2', 'playaudio', 'playvideo']
handler.tags = ['downloader']

export default handler
