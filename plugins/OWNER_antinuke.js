{
  name: '420-activate',
  usage: '.420',
  minLevel: PermissionLevel.ADMIN,   // solo admin del gruppo
  description: 'Attiva AntiNuke',
  aliases: ['.420'], // Bagley 2.0 riconosce alias come comando diretto
  handler: async (context) => {
    if (!context.remoteJid?.endsWith('@g.us')) {
      return { text: '❌ Questo comando funziona solo nei gruppi.' };
    }

    if (!context.meta.isAdmin) {
      return { text: '❌ Solo gli admin del gruppo possono attivare l\'AntiNuke.' };
    }

    await antinukeService.setState(context.remoteJid, true);
    return { text: '🛡️ AntiNuke ATTIVATO con successo.' };
  }
},
{
  name: '420-deactivate',
  usage: '.420sban',
  minLevel: PermissionLevel.ADMIN,
  description: 'Disattiva AntiNuke',
  aliases: ['.420sban'],
  handler: async (context) => {
    if (!context.remoteJid?.endsWith('@g.us')) {
      return { text: '❌ Questo comando funziona solo nei gruppi.' };
    }

    if (!context.meta.isAdmin) {
      return { text: '❌ Solo gli admin del gruppo possono disattivare l\'AntiNuke.' };
    }

    await antinukeService.setState(context.remoteJid, false);
    return { text: '🟡 AntiNuke DISATTIVATO.' };
  }
}
