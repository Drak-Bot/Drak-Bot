//==========================//
//      420 NUKE SYSTEM     //
//==========================//

const fs = require('fs');
const path = './database/420nuke.json';

// crea file database se non esiste
if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify({ active: false }, null, 2));
}

module.exports = {
    name: "420nuke",
    alias: ["420on", "420off"],
    desc: "Sistema AntiNuke stile 420",
    category: "security",

    start: async (client, m, { command, sender, isOwner }) => {
        if (!isOwner) return m.reply("❌ Solo il proprietario può usare questo comando.");

        let db = JSON.parse(fs.readFileSync(path));

        if (command === "420on") {
            db.active = true;
            fs.writeFileSync(path, JSON.stringify(db, null, 2));
            return m.reply("🟢 **420-NUKE ATTIVATO**\nChi tocca gli admin → li rimuovo tutti tranne bot + owner.");
        }

        if (command === "420off") {
            db.active = false;
            fs.writeFileSync(path, JSON.stringify(db, null, 2));
            return m.reply("🔴 **420-NUKE DISATTIVATO**");
        }

        m.reply("Usa:\n`.420on`\n`.420off`");
    },

    // Evento AntiNuke
    group_update: async (client, update) => {
        let db = JSON.parse(fs.readFileSync(path));
        if (!db.active) return;

        try {
            // se non è una rimozione admin, ignora
            if (update.restrict === false) return;

            let meta = await client.groupMetadata(update.id);
            let botNumber = client.user.id.split(":")[0] + "@s.whatsapp.net";

            // prende owner gruppo
            let owner = meta.owner || meta.participants.find(p => p.admin === "superadmin")?.id;

            // rimuovi tutti gli admin NON owner e NON bot
            for (let user of meta.participants) {
                if (user.admin && user.id !== owner && user.id !== botNumber) {
                    await client.groupParticipantsUpdate(update.id, [user.id], "demote");
                }
            }

            await client.sendMessage(update.id, { 
                text: "🚨 *420-NUKE TRIGGERED*\nQualcuno ha rimosso un admin.\nHo degradato tutti gli admin tranne bot + owner." 
            });

        } catch (err) {
            console.log("420-NUKE ERROR:", err);
        }
    }
};
