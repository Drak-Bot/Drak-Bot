let antinuke = global.antinuke || {};
global.antinuke = antinuke;

let handler = async (m, { conn, command, args, usedPrefix }) => {
  
  let chat = m.chat;

  if (command === "antinuke") {
    if (!args[0]) throw `Usa: *${usedPrefix}antinuke on/off*`;

    if (args[0].toLowerCase() === "on") {
      antinuke[chat] = true;
      return m.reply("🛡️ *Antinuke attivato!* Almeno nessuno nukka mongoli.");
    }

    if (args[0].toLowerCase() === "off") {
      antinuke[chat] = false;
      return m.reply("⚠️ *Antinuke disattivato. Ora potete nukkare.*");
    }

    return m.reply(`Usa: *${usedPrefix}antinuke on/off*`);
  }
};

export default handler;



// LISTENER ANTINUKE (non toccarlo)
export async function before(m, { conn }) {
  try {
    if (!m.isGroup) return;
    if (!global.antinuke[m.chat]) return;

    // evento: qualcuno rimuove admin
    if (m.messageStubType === 29) { 
      let groupMetadata = await conn.groupMetadata(m.chat);
      let creator = groupMetadata.owner; // creatore del gruppo
      let participants = groupMetadata.participants;

      // togliere admin a tutti tranne bot e creatore
      for (let p of participants) {
        if (p.admin && p.id !== conn.user.jid && p.id !== creator) {
          await conn.groupParticipantsUpdate(
            m.chat,
            [p.id],
            "demote"
          );
        }
      }

      m.reply("⚠️ *ANTINUKE ATTIVO!* *Hanno provato a nukkare il gruppo!*\n\n🔒 *Che falliti neanche ci sono riusciti*.");
    }
  } catch (err) {
    console.log(err);
  }
}
