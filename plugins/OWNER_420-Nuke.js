// plugins/420nuke.js
const fs = require('fs');
const DBPATH = './database/420nuke.json';

if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true });
if (!fs.existsSync(DBPATH)) fs.writeFileSync(DBPATH, JSON.stringify({ active: false, whitelist: [] }, null, 2));

function readDB(){
  try { return JSON.parse(fs.readFileSync(DBPATH)); }
  catch(e){ return { active:false, whitelist:[] }; }
}
function writeDB(obj){
  fs.writeFileSync(DBPATH, JSON.stringify(obj, null, 2));
}

async function safeDemoteAll(client, gid){
  try {
    const meta = await client.groupMetadata(gid);
    const botJid = (client.user && client.user.id) ? client.user.id.split(':')[0] + '@s.whatsapp.net' : null;
    // owner detection: prefer metadata.owner, fallback to superadmin or first admin
    let owner = meta.owner || meta.participants.find(p => p.isSuperAdmin || p.admin === 'superadmin')?.id || meta.participants.find(p => p.admin)?.id;

    for (let p of meta.participants){
      if (!p.admin) continue;
      if (p.id === botJid) continue;
      if (owner && p.id === owner) continue;

      try {
        // demote (Baileys method)
        await client.groupParticipantsUpdate(gid, [p.id], 'demote');
        console.log(`[420NUKE] demoted ${p.id} in ${gid}`);
      } catch (errDem){
        console.log(`[420NUKE] failed to demote ${p.id}:`, errDem?.message || errDem);
      }
    }

    // notify group
    try {
      await client.sendMessage(gid, { text: "🚨 *420-NUKE TRIGGERED*\nHo degradato tutti gli admin tranne owner + bot." });
    } catch(e){}
  } catch(e){
    console.log('[420NUKE] safeDemoteAll error:', e?.message || e);
  }
}

module.exports = {
  name: "420nuke",
  alias: ["420on","420off"],
  desc: "Anti-nuke con comandi .420on .420off",
  category: "security",

  // comando: riceve client, m (messaggio), { command, isOwner, ... }
  start: async (client, m, { command, isOwner }) => {
    if (!isOwner) return m.reply("❌ Solo il proprietario può usare questo comando.");

    const db = readDB();

    if (command === '420on') {
      db.active = true;
      writeDB(db);
      return m.reply("🟢 **420-NUKE ATTIVATO** — protezione attiva.");
    }

    if (command === '420off') {
      db.active = false;
      writeDB(db);
      return m.reply("🔴 **420-NUKE DISATTIVATO**.");
    }

    return m.reply("Usa: `.420on` o `.420off`");
  },

  // INIT: chiama questo con il tuo client per agganciare i listener
  init: (client) => {
    // listener per promozioni/demozioni (Baileys)
    client.ev.on?.('group-participants.update', async (update) => {
      try {
        const db = readDB();
        if (!db.active) return;

        // update: { id: groupJid, participants: [...], action: 'promote'|'demote'|'add'|'remove' }
        const gid = update.id || update.groupJid || update.key?.remoteJid;
        const action = update.action || update[0]; // fallback
        console.log('[420NUKE] group-participants.update', gid, action, update.participants);

        // se è una demote (qualcuno ha tolto admin a un altro) -> trigger
        if (action === 'demote' || action === 'demoted') {
          await safeDemoteAll(client, gid);
        }

        // se è una promote (qualcuno promuove un nuovo admin manualmente) -> potresti voler monitorare
        if (action === 'promote' || action === 'promoted') {
          // opzionale: se vuoi, demota chi ha promosso senza permesso. Per ora solo log
          console.log('[420NUKE] promote detected in', gid, update.participants);
        }
      } catch(e){
        console.log('[420NUKE] gp.update handler error:', e?.message || e);
      }
    });

    // listener per cambi gruppo (alcuni bot emettono eventi diversi)
    try {
      client.on?.('group-update', async (update) => {
        try {
          const db = readDB();
          if (!db.active) return;
          console.log('[420NUKE] group-update', update);
          // non trigger automatico qui: lasciamo il trigger principale a group-participants.update
        } catch(e){}
      });
    } catch(e){ /* ignore if not supported */ }

    // compatibilità con vecchie versioni di Baileys (se il tuo client usa client.on)
    if (!client.ev && client.on) {
      client.on('group-participants.update', async (update) => {
        // ripeti la stessa logica
        try {
          const db = readDB();
          if (!db.active) return;
          const gid = update.id || update.groupJid;
          const action = update.action;
          if (action === 'demote' || action === 'demoted') {
            await safeDemoteAll(client, gid);
          }
        } catch(e){ console.log('[420NUKE] legacy handler err', e); }
      });
    }

    console.log('[420NUKE] initialized listeners');
  }
};
