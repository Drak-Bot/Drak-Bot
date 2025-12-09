let msg = message.body?.toLowerCase() || "";

// Lista auto
const cars = {
    sultan: { name: "Sultan", img: "https://i.imgur.com/2L67zUY.png" },
    elegy: { name: "Elegy", img: "https://i.imgur.com/JhWmY8W.png" },
    banshee: { name: "Banshee", img: "https://i.imgur.com/Ae1nnCV.png" },
    buffalo: { name: "Buffalo", img: "https://i.imgur.com/FfGgS74.png" },
    supergt: { name: "SuperGT", img: "https://i.imgur.com/NvQHF2A.png" }
};

// --- Comando listino ---
if(msg === ".compra_auto") {
    sendMessage({
        chatId: message.from,
        text: "🚘 *Autosalone – Seleziona un'auto:*",
        buttons: [
            { id: "buy_sultan", text: "Sultan" },
            { id: "buy_elegy", text: "Elegy" },
            { id: "buy_banshee", text: "Banshee" },
            { id: "buy_buffalo", text: "Buffalo" },
            { id: "buy_supergt", text: "SuperGT" }
        ]
    });
    return;
}

// --- Risposta pulsanti ---
if(message.selectedButtonId) {
    const key = message.selectedButtonId.replace("buy_", "");
    const car = cars[key];

    if(!car){
        sendMessage({
            chatId: message.from,
            text: "❌ Auto non valida."
        });
        return;
    }

    sendMessage({
        chatId: message.from,
        image: car.img,
        caption: `🚗 *Hai acquistato una ${car.name}!*`
    });
}
