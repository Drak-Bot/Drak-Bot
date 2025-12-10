/*
  =============================================================
  PLUGIN: fun-shop.js (Rinox Supermarket - Versione Corretta)
  =============================================================
*/

const INITIAL_WALLET = 10000;

// Sistema creazione immagini
const createPlaceholderUrl = (text, color, width = 600, height = 300) => {
    const bgColor = color.startsWith('#') ? color.substring(1) : color;
    const fgColor = 'FFFFFF';
    return `https://dummyimage.com/${width}x${height}/${bgColor}/${fgColor}&text=${encodeURIComponent(text)}`;
};


// DATABASE IN RAM
const SHOP_ITEMS = {
    MACCHINE: {
        categoryUrl: createPlaceholderUrl("Rinox | Sezione MACCHINE", "4CAF50"),
        items: [
            { key: 'PANDA', name: 'Fiat Panda Usata', price: 500, emoji: '🚗', imageUrl: createPlaceholderUrl("Fiat Panda - Affare!", "FF5722") },
            { key: 'BMW', name: 'BMW Sportiva', price: 4500, emoji: '🏎️', imageUrl: createPlaceholderUrl("BMW - Velocità", "03A9F4") },
            { key: 'FERRARI', name: 'Ferrari F40', price: 12000, emoji: '🔥', imageUrl: createPlaceholderUrl("Ferrari - Lusso", "F44336") },
        ]
    },
    CASE: {
        categoryUrl: createPlaceholderUrl("Rinox | Sezione CASE", "2196F3"),
        items: [
            { key: 'MONOLOCALE', name: 'Monolocale in Periferia', price: 1500, emoji: '🏠', imageUrl: createPlaceholderUrl("Monolocale - Piccolo", "009688") },
            { key: 'APPARTAMENTO', name: 'Appartamento in Centro', price: 8000, emoji: '🏢', imageUrl: createPlaceholderUrl("Appartamento - Comodo", "9C27B0") },
            { key: 'VILLA', name: 'Villa con Piscina', price: 25000, emoji: '🏰', imageUrl: createPlaceholderUrl("Villa - Stupenda", "FFC107") },
        ]
    },
    SCARPE: {
        categoryUrl: createPlaceholderUrl("Rinox | Sezione SCARPE", "FF9800"),
        items: [
            { key: 'SNEAKERS', name: 'Sneakers Comode', price: 50, emoji: '👟', imageUrl: createPlaceholderUrl("Sneakers - Relax", "607D8B") },
            { key: 'STIVALI', name: 'Stivali di Pelle', price: 150, emoji: '👢', imageUrl: createPlaceholderUrl("Stivali - Tendenza", "795548") },
            { key: 'TACCHI', name: 'Tacchi a Spillo', price: 300, emoji: '👠', imageUrl: createPlaceholderUrl("Tacchi - Eleganza", "E91E63") },
        ]
    },
};

// INVENTARIO UTENTE
function getOrCreateUserInventory(conn, jid) {
    conn.shop = conn.shop || {};
    if (!conn.shop[jid]) {
        conn.shop[jid] = {
            wallet: INITIAL_WALLET,
            inventory: { MACCHINE: [], CASE: [], SCARPE: [] }
        };
    }
    return conn.shop[jid];
}

// TESTO INVENTARIO
function createInventorySummary(userData) {
    let summary = `💳 *PORTAFOGLIO:* ${userData.wallet.toLocaleString('it-IT')} Crediti\n`;
    summary += `════════════════════════\n`;

    let inventoryList = '';
    let hasItems = false;

    for (const category in userData.inventory) {
        const items = userData.inventory[category];
        if (items.length > 0) {
            hasItems = true;
            inventoryList += `\n*${category}:*\n`;
            items.forEach(item => {
                inventoryList += `  - ${item.emoji} ${item.name} (${item.key})\n`;
            });
        }
    }

    if (!hasItems) inventoryList = "\n_Non possiedi ancora alcun articolo._";

    return summary + `📦 *IL TUO INVENTARIO:*${inventoryList}\n\n`;
}


// MENU CATEGORIA
function createCategoryMenu(categoryKey, usedPrefix, command) {
    const categoryData = SHOP_ITEMS[categoryKey];
    const items = categoryData.items;

    const buttons = items.map(item => ({
        buttonId: `${usedPrefix}${command} BUY_${categoryKey}_${item.key}`,
        buttonText: { displayText: `${item.emoji} ${item.name} | ${item.price.toLocaleString('it-IT')} C` },
        type: 1
    }));

    buttons.push({
        buttonId: `${usedPrefix}${command} MAIN_MENU`,
        buttonText: { displayText: "↩️ Torna al Menu Principale" },
        type: 1
    });

    return {
        image: { url: categoryData.categoryUrl },
        caption: `🛒 *ACQUISTA ${categoryKey}*\n\nSeleziona un articolo:`,
        footer: 'Scegli saggiamente!',
        buttons
    };
}


// HANDLER PRINCIPALE
let handler = async (m, { conn, usedPrefix, command, pushname }) => {
    
    const sender = m.sender;
    const senderName = pushname || 'Utente';

    let userData = getOrCreateUserInventory(conn, sender);

    // 🔥 FIX CRITICO: identifichiamo sempre l’azione
    const btn = m?.message?.buttonsResponseMessage?.selectedButtonId || "";
    const raw = m.text || btn;

    let fullAction = raw.replace(usedPrefix + command, "").trim();  
    if (!fullAction) fullAction = "MAIN_MENU";

    // Esempi:
    // BUY_MACCHINE_PANDA
    // CATEGORY_MACCHINE
    // MAIN_MENU

    try {

        // --- CATEGORIA ---
        if (fullAction.startsWith("CATEGORY_")) {
            const categoryKey = fullAction.split("_")[1];
            if (!SHOP_ITEMS[categoryKey]) return m.reply("❌ Categoria non valida.");

            return await conn.sendMessage(m.chat, createCategoryMenu(categoryKey, usedPrefix, command), { quoted: m });
        }

        // --- ACQUISTO ---
        if (fullAction.startsWith("BUY_")) {
            const [, categoryKey, itemKey] = fullAction.split("_");

            if (!SHOP_ITEMS[categoryKey]) return m.reply("❌ Categoria non valida.");
            const item = SHOP_ITEMS[categoryKey].items.find(i => i.key === itemKey);
            if (!item) return m.reply("❌ Articolo non trovato.");

            if (userData.inventory[categoryKey].some(i => i.key === itemKey)) {
                return m.reply(`❌ Possiedi già *${item.name}*!`);
            }

            if (userData.wallet < item.price) {
                return m.reply(`💸 Fondi insufficienti: hai ${userData.wallet} crediti.`);
            }

            userData.wallet -= item.price;
            userData.inventory[categoryKey].push(item);

            await conn.sendMessage(m.chat, {
                image: { url: item.imageUrl },
                caption: `🎉 *ACQUISTO COMPLETATO*\nHai ottenuto *${item.name}*!`,
                footer: "Rinox Supermarket"
            }, { quoted: m });

            return;
        }

        // --- MENU PRINCIPALE ---
        if (fullAction === "MAIN_MENU") {

            const menuText = `🛒 *BENVENUTO AL RINOX SUPERMARKET!* 🛒\n\n`
                + createInventorySummary(userData)
                + `Seleziona una categoria per iniziare:`;


            const categoryButtons = [
                { buttonId: `${usedPrefix}${command} CATEGORY_MACCHINE`, buttonText: { displayText: "🏎️ MACCHINE" }, type: 1 },
                { buttonId: `${usedPrefix}${command} CATEGORY_CASE`, buttonText: { displayText: "🏠 CASE" }, type: 1 },
                { buttonId: `${usedPrefix}${command} CATEGORY_SCARPE`, buttonText: { displayText: "👟 SCARPE" }, type: 1 },
            ];

            const mainImage = createPlaceholderUrl("Rinox Supermarket", "795548");

            return conn.sendMessage(m.chat, {
                image: { url: mainImage },
                caption: menuText,
                footer: `Utente: ${senderName}`,
                buttons: categoryButtons
            }, { quoted: m });
        }

    } catch (e) {
        console.error(e);
        return m.reply("❌ Errore critico nella gestione dello shop.");
    }
};

handler.help = ['shop'];
handler.tags = ['fun'];
handler.command = ['shop'];
handler.group = true;

export default handler;
