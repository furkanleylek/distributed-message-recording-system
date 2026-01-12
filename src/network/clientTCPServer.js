const net = require('net');
const { HOST, TCP_PORT } = require('../utils/constants');

const { handleGet } = require('../handlers/handleGet');
const { handleSet } = require('../handlers/handleSet');

/**
    * Komutu işler
    * SET <id> <mesaj>  →  OK veya ERROR
    * GET <id>          →  mesaj veya ERROR
 */
async function handleCommand(line) {
    const parts = line.split(' ');
    const command = parts[0].toUpperCase();

    if (command === 'SET' && parts.length >= 3) {
        const id = parts[1];
        const message = parts.slice(2).join(' ');
        return await handleSet(id, message);

    } else if (command === 'GET' && parts.length >= 2) {
        const id = parts[1];
        return await handleGet(id);

    } else {
        return 'ERROR: geçersiz komut,  kullanım : SET <id> <mesaj> veya GET <id>';
    }
}



/**
 * TCP server başlatır,
 * Client ' dan text bazlı komut alır . 
 */
function startTCPServer() {
    const server = net.createServer((socket) => {
        console.log('[TCP] client baglandı');

        socket.on('data', async (data) => {
            const line = data.toString().trim();
            console.log(`[TCP] gelen: ${line}`);

            // Komutu parse et ve işle
            const response = await handleCommand(line);
            socket.write(response + '\n');
        });

        socket.on('close', () => {
            console.log('[TCP] client ayrıldı');
        });

        socket.on('error', (err) => {
            console.error('[TCP] hata :', err.message);
        });
    });

    server.listen(TCP_PORT, HOST, () => {
        console.log(`[TCP SERVER] dinliyor : ${HOST}:${TCP_PORT}`);
    });
}


module.exports = { startTCPServer };
