const net = require('net');
/**
     * boş port bulur, 
     * işleyiş ; 
     *         - port:5555 den başlar, 5556, 5557 ... boşluk bulana kadar ilerler. 
     * @returns {Promise<number>}
 */
const START_PORT = 5555;

function findFreePort() {
    return new Promise((resolve) => {
        let port = START_PORT;

        function tryPort() {
            const server = net.createServer();

            server.once('error', () => {
                // port dolu, portu arttır tekrar dene
                port++;
                tryPort();
            });

            server.once('listening', () => {
                // port boş, portu kapat, return port
                server.close(() => {
                    resolve(port);
                });
            });

            server.listen(port, '0.0.0.0');
        }

        tryPort();
    });
}

module.exports = { findFreePort, START_PORT };


