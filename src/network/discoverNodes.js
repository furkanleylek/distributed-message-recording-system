const { HOST, START_PORT } = require('../utils/constants');
const grpcClient = require('../grpc/client');

// mevcut nodeları arar, bulur 
async function discoverNodes(myPort, registry) {
    console.log('[DISCOVERY] mevcut nodelar aranıyor');

    // kendi portundan, START_PORT=5555 değerine kadar olan portları arar 
    for (let port = START_PORT; port < myPort; port++) {
        try {

            const client = grpcClient.createClient(HOST, port);

            const response = await grpcClient.join(client, HOST, myPort);

            // Gelen üye listesini ekle
            if (response.members && response.members.length > 0) {
                registry.addAll(response.members);
                console.log(`[DISCOVERY] ${HOST}:${port} üzerinden katıldım`);
                console.log(`[DISCOVERY] aile boyutu : ${registry.size()}`);
            }

        } catch (err) {
            // Hata varsa yazdır (debug için)
            console.log(`[DISCOVERY] ${HOST}:${port} - baglanamadı : ${err.message}`);
        }
    }

    console.log('[DISCOVERY] keşif tamamlandı');
}

module.exports = { discoverNodes };