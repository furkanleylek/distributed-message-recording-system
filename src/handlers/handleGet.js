const grpcClient = require('../grpc/client');
const ctx = require('../utils/context');

async function handleGet(id) {
    console.log(`[GET] id=${id}`);

    // 1- lider node un diskine bakar, 
    const localContent = ctx.storage.read(id);
    if (localContent !== null) {
        console.log(`[GET] lider node da bulundu : ${id}`);
        return localContent;
    }

    // 2- lider node da yok ise, messageIndex den hangi üyelerde olduğunu bul,
    const members = ctx.messageIndex.get(id);

    if (members.length === 0) {
        return 'ERROR: mesaj bulunamadı';
    }

    // 3- bulunan nodelar a sırayla sor
    for (const node of members) {
        try {
            const client = grpcClient.createClient(node.host, node.port);
            const response = await grpcClient.GET(client, id);

            if (response.success) {
                console.log(`[GET] ${node.host}:${node.port} üyesinden alındı`);
                return response.message;
            }
        } catch (err) {
            console.log(`[GET] ${node.host}:${node.port} cevap vermedi, sonraki deneniyor `);
        }
    }

    return 'ERROR: mesaj hiçbir üyeden alınamadı';
}

module.exports = { handleGet };
