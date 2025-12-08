import yts from "yt-search";
import axios from "axios";

const MAX_DURATION = 600; // 5 minuti

// API stabile
const API = "https://api.akuari.my.id/downloader/yt1?link=";

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) {
      return conn.sendMessage(m.chat, { 
        text: `❗ *Inserisci un titolo o un link YouTube*`
      }, { quoted: m });
    }

    // ────── PLAY AUDIO ──────
    if (command === "playaudio") {
      const search = await yts(text);
      if (!search.all.length) {
        return conn.sendMessage(m.chat, { text: "❗ Nessun risultato trovato" }, { quoted: m });
      }

      const video = search.videos[0];
      const res = await axios.get(API + video.url);
      const link = res.data?.mp3?.url;

      if (!link) return conn.sendMessage(m.chat, { text: "❗ Errore nel download" });

      await conn.sendMessage(m.chat, { text: "🎵 *Audio in arrivo…*" });

      return conn.sendMessage(m.chat, {
        audio: { url: link },
        mimetype: "audio/mpeg",
        fileName: video.title + ".mp3"
      }, { quoted: m });
    }

    // ────── PLAY VIDEO ──────
    if (command === "playvideo") {
      const search = await yts(text);
      if (!search.all.length) {
        return conn.sendMessage(m.chat, { text: "❗ Nessun risultato trovato" }, { quoted: m });
      }

      const video = search.videos[0];
      const res = await axios.get(API + video.url);
      const link = res.data?.mp4?.url;

      if (!link) return conn.sendMessage(m.chat, { text: "❗ Errore nel download" });

      await conn.sendMessage(m.chat, { text: "🎬 *Video in arrivo…*" });

      return conn.sendMessage(m.chat, {
        video: { url: link },
        mimetype: "video/mp4",
        caption: `🎬 *${video.title}*`
      }, { quoted: m });
    }

    // ────── COMANDO PLAY (solo bottoni) ──────
    if (command === "play") {
      const search = await yts(text);
      if (!search.all.length) {
        return conn.sendMessage(m.chat, { text: "❗ Nessun risultato trovato" });
      }

      const video = search.videos[0];

      if (video.seconds > MAX_DURATION) {
        return conn.sendMessage(m.chat, { 
          text: `❗ *Video troppo lungo*\nDurata massima: 5 minuti\nDurata: ${video.timestamp}`
        });
      }

      const thumb = (await conn.getFile(video.thumbnail)).data;

      return conn.sendMessage(m.chat, {
        text: `🎵 *Risultato trovato*\n\n🎬 Titolo: ${video.title}\n⏳ Durata: ${video.timestamp}\n👀 Views: ${video.views}`,
        buttons: [
          { buttonId: `${usedPrefix}playaudio ${video.url}`, buttonText: { displayText: "🎵 Scarica Audio" }, type: 1 },
          { buttonId: `${usedPrefix}playvideo ${video.url}`, buttonText: { displayText: "🎬 Scarica Video" }, type: 1 },
        ],
        headerType: 4,
        contextInfo: {
          externalAdReply: {
            title: video.title,
            mediaUrl: video.url,
            sourceUrl: video.url,
            thumbnail: thumb,
            mediaType: 1,
            showAdAttribution: true,
          }
        }
      }, { quoted: m });
    }

  } catch (e) {
    console.log(e);
    conn.sendMessage(m.chat, { text: `❗ Errore: ${e.message}` });
  }
};

handler.help = ["play", "playaudio", "playvideo"];
handler.tags = ["downloader"];
handler.command = ["play", "playaudio", "playvideo"];

export default handler;
