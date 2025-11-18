let handler = async (m, { conn }) => {

    const createVCard = (name, number, role) => {
        return `BEGIN:VCARD
VERSION:3.0
FN:${name}
ORG:𝔻𝕋ℍ-𝔹𝕆𝕋;
TEL;type=CELL;type=VOICE;waid=${number}:+${number}
X-ABLabel:${role}
END:VCARD`.replace(/\n/g, '\r\n');
    };

    await conn.sendMessage(m.chat, { 
        contacts: { 
            displayName: '👥 𝔻𝕋ℍ-𝔹𝕆𝕋 Staff', 
            contacts: [
                { vcard: createVCard('Creatore', '27763845778', 'Founder') },
            ]
        }
    }, { quoted: m });
};

handler.help = ['staff'];
handler.tags = ['info'];
handler.command = ['staff', 'team'];

export default handler;
