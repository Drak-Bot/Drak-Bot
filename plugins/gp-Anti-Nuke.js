// =======================
//   ANTI NUKE PLUGIN
// =======================

const owners = ["27663845778@s.whatsapp.net", "212621266387@s.whatsapp.net"]; 
const founders = ["27663845778@s.whatsapp.net"]; 

let antiNuke = false;

let handler = async (m, { conn, command, text }) => {
    if (command === "antinuke") {
        if (text === "on") {
            antiNuke = true;
            return m.reply("🛡️ *AntiNuke attivato!* Protezione totale attiva.");
        }
        if (text === "off") {
            antiNuke = false;
            return m.reply("❌ *AntiNuke disattivato.*");
        }
        return m.reply("Usa:\n• *.antinuke on*\n• *.antinuke off*");
    }
};

// ===========================
//   EVENTI PROTEZIONE NUKING
// ===========================
handler.before = async (m, { conn }) => {
    try {
        if (!antiNuke) return;
        if (!m.isGroup) return;
        if (!m.messageStubType) return;

        let metadata = await conn.groupMetadata(m.chat);
        let participants = metadata.participants;

        let botJid = conn.user.jid;

        // ============================
        // 1️⃣ SE QUALCUNO TOGLIE UN ADMIN
        // ============================
        if (m.messageStubType === 29) { // 29 = admin rimosso
            let admins = participants.filter(p => p.admin);

            let botAdmin = admins.some(a => a.id === botJid);
            if (!botAdmin) return;

            let whitelist = [...owners, ...founders, botJid];

            let toDemote = admins
                .map(a => a.id)
                .filter(id => !whitelist.includes(id));

            if (toDemote.length > 0) {
                await conn.sendMessage(m.chat, { text: "🚨 *Tentativo di NUKE rilevato!* Sto togliendo gli admin non autorizzati..." });
                await conn.groupParticipantsUpdate(m.chat, toDemote, "demote");
                await conn.sendMessage(m.chat, { text: "🛡️ *AntiNuke:* solo Owner, Founder e Bot restano admin." });
            }
        }

        // ============================================
        // 2️⃣ SE QUALCUNO TOGLIE 3 PERSONE INSIEME
        // ============================================
        if (m.messageStubType === 28) { // 28 = rimozione membri
            let removed = m.messageStubParameters; // lista membri rimossi

            if (removed.length >= 3) {
                // Prendi admin attuali
                let admins = participants.filter(p => p.admin);
                let whitelist = [...owners, ...founders, botJid];

                let toDemote = admins
                    .map(a => a.id)
                    .filter(id => !whitelist.includes(id));

                // ⚠ ANNUNCIO
                await conn.sendMessage(m.chat, { text: "🚨 *ATTACCO MASS-KICK RILEVATO!*\n3 o più membri rimossi contemporaneamente.\n🛑 Il gruppo verrà chiuso e gli admin rimossi." });

                // ❌ CHIUSURA GRUPPO
                await conn.groupSettingUpdate(m.chat, "announcement");

                // ❌ TOLGO TUTTI GLI ADMIN NON AUTORIZZATI
                if (toDemote.length > 0) {
                    await conn.groupParticipantsUpdate(m.chat, toDemote, "demote");
                }

                // ✔ MESSAGGIO FINALE
                await conn.sendMessage(m.chat, { text: "🔒 *Gruppo chiuso.*\n🛡 Solo Owner, Founder e Bot sono rimasti admin." });
            }
        }

    } catch (e) {
        console.log("Errore AntiNuke:", e);
    }
};

export default handler;
