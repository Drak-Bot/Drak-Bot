let msg = message.body?.toLowerCase() || "";

// LISTA AUTO
const cars = {
    sultan: { name: "Sultan", img: "https://i.imgur.com/2L67zUY.png" },
    elegy: { name: "Elegy", img: "https://i.imgur.com/JhWmY8W.png" },
    banshee: { name: "Banshee", img: "https://i.imgur.com/Ae1nnCV.png" },
    buffalo: { name: "Buffalo", img: "https://i.imgur.com/FfGgS74.png" },
    supergt: { name: "SuperGT", img: "https://i.imgur.com/NvQHF2A.png" }
};

// ------------------------------------------------------
// COMANDO PRINCIPALE: MOSTRA LISTINO CON I PULSANTI
// ------------------------------------------------------
if (msg === ".compra_auto") {
    sendMessage({
        chatId: message.from,
        text: "🚘 *Autosalone – Auto disponibili*\n\nScegli un'auto dai pulsanti qui sotto:",
        buttons: [
            { id: "buy_sultan", label: "Sultan" },
            { id: "buy_elegy", label: "Elegy" },
            { id: "buy_banshee", label: "Banshee" },
            { id: "buy_buffalo", label: "Buffalo" },
            { id: "buy_supergt", label: "SuperGT" }
        ]
    });
    return;
}

// ------------------------------------------------------
// CLICK DEI PULSANTI – ACQUISTO AUTO
// ------------------------------------------------------
if (message.buttonResponseId?.startsWith("buy_")) {
    const key = message.buttonResponseId.replace("buy_", ""); // es: "elegy"
    const car = cars[key];

    if (!car) {
        sendMessage({
            chatId: message.from,
            text: "❌ Errore: auto non trovata."
        });
        return;
    }

    sendMessage({
        chatId: message.from,
        image: car.img,
        caption: `🚗 *Hai acquistato una ${car.name}!*`
    });

    return;
}
