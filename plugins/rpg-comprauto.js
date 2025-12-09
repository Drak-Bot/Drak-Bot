let msg = message.body?.toLowerCase() || "";

// Lista auto
const cars = {
    sultan: { name: "Sultan", img: "https://i.imgur.com/2L67zUY.png", price: 15000 },
    elegy: { name: "Elegy", img: "https://i.imgur.com/JhWmY8W.png", price: 18000 },
    banshee: { name: "Banshee", img: "https://i.imgur.com/Ae1nnCV.png", price: 22000 },
    buffalo: { name: "Buffalo", img: "https://i.imgur.com/FfGgS74.png", price: 20000 },
    supergt: { name: "SuperGT", img: "https://i.imgur.com/NvQHF2A.png", price: 30000 }
};

// --- Comando listino ---
if(msg === ".comprauto") {
    let text = "🚘 *Autosalone – Seleziona un'auto:*";
    let buttons = [];

    for(const key in cars) {
        buttons.push({ id: "buy_" + key, text: cars[key].name });
    }

    sendMessage({
        chatId: message.from,
        text,
        buttons
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
        caption: `🚗 *Hai acquistato una ${car.name}* per $${car.price}!`
    });
}
