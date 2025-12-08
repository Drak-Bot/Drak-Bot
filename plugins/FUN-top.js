import fetch from 'node-fetch'

let handler = async (m, { conn, args, participants }) => {
    // Escludi il bot dalla lista partecipanti
    let utenti = participants
        .filter(p => p.id !== conn.user.jid)
        .map(p => {
            let userData = global.db.data.users[p.id] || {};
            return {
                jid: p.id,
                messaggi: userData.messaggi || 0
            };
        });

    // Ordina in base ai messaggi
    utenti.sort((a, b) => b.messaggi - a.messaggi);

    // Limite classifica
    let limite = args[0] ? Math.min(100, Math.max(1, parseInt(args[0]))) : 10;

    // Posizione dell'utente che ha inviato il comando
    let posizione = utenti.findIndex(u => u.jid === m.sender) + 1;

    // Testo classifica
    let testo = `𝐓𝐨𝐩 ${limite} 𝐮𝐭𝐞𝐧𝐭𝐢 𝐜𝐨𝐧 𝐩𝐢𝐮̀ 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢\n\n`;

    let getMedaglia = (pos) => {
        if (pos === 1) return "🥇";
        if (pos === 2) return "🥈";
        if (pos === 3) return "🥉";
        return "🏅";
    };

    utenti.slice(0, limite).forEach((u, i) => {
        testo += `${getMedaglia(i + 1)} « *${u.messaggi}* » @${u.jid.split("@")[0]}\n`;
    });

    // Aggiungi posizione personale
    testo = testo.trim();
    if (m.sender !== conn.user.jid) {
        testo += `\n\n𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞: *${posizione}°* di *${utenti.length}*`;
    }

    // Thumbnail
    let thumbnail = await (await fetch("https://telegra.ph/file/b311b1ffefcc34f681e36.png")).buffer();

    // Messaggio "finto" stile WhatsApp business
    let fakeContact = {
        key: {
            participants: "0@s.whatsapp.net",
            fromMe: false,
            id: "Halo"
        },
        message: {
            locationMessage: {
                name: "𝐂𝐥𝐚𝐬𝐬𝐢𝐟𝐢𝐜𝐚 𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢",
                jpegThumbnail: thumbnail,
                vcard: `BEGIN:VCARD
VERSION:3.0
N:;Unlimited;;;
FN:Unlimited
ORG:Unlimited
TITLE:
item1.TEL;waid=19709001746:+1 (970) 900-1746
item1.X-ABLabel:Unlimited
X-WA-BIZ-DESCRIPTION:ofc
X-WA-BIZ-NAME:Unlimited
END:VCARD`
            }
        },
        participant: "0@s.whatsapp.net"
    };

    // Risposta finale
    conn.reply(m.chat, testo, fakeContact, {
        mentions: utenti.slice(0, limite).map(u => u.jid)
    });
};

handler.command = /^(top)$/i;
handler.group = true;

export default handler;
