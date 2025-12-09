import { sticker } from '../lib/sticker.js'
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { webp2png } from '../lib/webp2mp4.js'

let handler = async (m, { conn, args }) => {

    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''

    // nessun file trovato
    if (!mime && !args[0])
        return m.reply("❗ Rispondi a un'immagine/video/webp oppure metti un link valido.")

    m.reply('⏳ *Sto creando lo sticker...*')

    try {
        let media = await q.download()
        if (!media) return m.reply("❗ Non riesco a scaricare il file. Riprova.")

        let out
        let stiker

        try {
            // tentativo diretto — preferito
            stiker = await sticker(media, false, global.packname, global.author)
        } catch (err) {
            console.log("❌ Errore sticker diretto:", err)
        }

        // se fallisce conversione diretta
        if (!stiker) {

            // fallback conversioni
            if (/webp/.test(mime)) {
                out = await webp2png(media)
            } else if (/image/.test(mime)) {
                out = await uploadImage(media)
            } else if (/video/.test(mime)) {
                if ((q.msg || q).seconds > 10)
                    return m.reply("⚠️ Il video deve essere meno di 10 secondi")
                out = await uploadFile(media)
            }

            if (!out) return m.reply("❗ Errore nella conversione del file.")

            // ultimo tentativo sticker
            stiker = await sticker(false, out, global.packname, global.author)
        }

        if (!stiker) return m.reply("❗ Errore finale: impossibile creare lo sticker.")

        // invio sticker garantito
        return await conn.sendFile(
            m.chat,
            stiker,
            "sticker.webp",
            "",
            m,
            { asSticker: true }
        )

    } catch (e) {
        console.error("STICKER ERROR:", e)
        return m.reply("❗ Errore interno nella creazione dello sticker.")
    }
}

handler.help = ['s', 'sticker']
handler.tags = ['sticker']
handler.command = /^s(tic?ker)?(gif)?$/i

export default handler
