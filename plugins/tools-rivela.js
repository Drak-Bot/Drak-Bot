let { downloadContentFromMessage } = (await import('@realvare/based'));

let handler = async (m, { conn }) => {

    if (!m.quoted) throw '𝐑𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐚 𝐮𝐧𝐚 𝐟𝐨𝐭𝐨 🖼️'

    // Controllo che sia davvero un messaggio view once
    if (m.quoted.mtype !== 'viewOnceMessageV2' && m.quoted.mtype !== 'viewOnceMessage')
        throw '𝐐𝐮𝐞𝐬𝐭𝐨 𝐧𝐨𝐧 𝐞̀ 𝐮𝐧 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐯𝐢𝐞𝐰-𝐨𝐧𝐜𝐞 ⛔'

    // Estraggo il contenuto reale
    let msg = m.quoted.message
    let type = Object.keys(msg)[0]

    if (!/image|video/i.test(type)) 
        throw '𝐐𝐮𝐞𝐬𝐭𝐨 𝐧𝐨𝐧 𝐞̀ 𝐮𝐧𝐚 𝐟𝐨𝐭𝐨/𝐯𝐢𝐝𝐞𝐨 📵'

    // Scarico il contenuto
    let media = await downloadContentFromMessage(
        msg[type], 
        type.includes('image') ? 'image' : 'video'
    )

    let buffer = Buffer.from([])

    for await (const chunk of media) {
        buffer = Buffer.concat([buffer, chunk])
    }

    // Invio foto/video recuperato
    if (/video/.test(type)) {
        return await conn.sendFile(
            m.chat,
            buffer,
            'viewonce.mp4',
            msg[type].caption || '',
            m
        )
    } else {
        return await conn.sendFile(
            m.chat,
            buffer,
            'viewonce.jpg',
            msg[type].caption || '',
            m
        )
    }
}

handler.help = ['readvo']
handler.tags = ['tools']
handler.command = ['readviewonce', 'nocap', 'rivela', 'readvo']

export default handler
