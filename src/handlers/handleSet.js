const grpcClient = require('../grpc/client');
const ctx = require('../utils/context');

let roundRobinIndex = 0;

async function handleSet(id, message) {
    console.log(`[SET] id = ${id}, mesaj = ${message}`);

    const others = ctx.registry.getOthers(ctx.HOST, ctx.myPort);

    if (others.length < ctx.config.tolerance) {
        return `ERROR: yeterli üye yok (mevcut : ${others.length}, gereken : ${ctx.config.tolerance})`;
    }

    // lider node kendi diskine yazar, 
    try {
        ctx.storage.writeSync(id, message);
        console.log(`[SET] lider diske yazdı : ${id}`);
    } catch (err) {
        return `ERROR: lider diske yazamadı : ${err.message}`;
    }

    // Round-robin ile tolerance kadar üye seç
    const selected = [];
    for (let i = 0; i < ctx.config.tolerance; i++) {
        const index = (roundRobinIndex + i) % others.length;
        selected.push(others[index]);
    }
    roundRobinIndex = (roundRobinIndex + ctx.config.tolerance) % others.length;

    console.log(`[SET] seçilen üyeler: ${selected.map(n => n.port).join(', ')}`);


    // SET değerini, seçilen üye nodelara gönder
    let successCount = 0;
    const successNodes = [];

    for (const node of selected) {
        try {
            const client = grpcClient.createClient(node.host, node.port);
            const response = await grpcClient.SET(client, id, message);

            if (response.success) {
                successCount++;
                successNodes.push(node); // message SET edilen node u kayıt altına alır
                console.log(`[SET] ${node.host}:${node.port} başarılı`);
            }
        } catch (err) {
            console.error(`[SET] ${node.host}:${node.port} hata :`, err.message);
        }
    }

    // messageIndex ile hangi mesaj hangi node da kayıtlı, RAM üzerinden kayıt altına alınır . 
    ctx.messageIndex.set(id, successNodes);

    if (successCount >= ctx.config.tolerance) {
        return 'OK';
    } else {
        return `ERROR: yeterli üyeye yazılamadı (${successCount}/${ctx.config.tolerance})`;
    }
}

module.exports = { handleSet };