const { grpc, hatokuseProto } = require('./loader');
/**
    * grpc server başlatır, 
    * @param {number} port - dinlenecek port, 
    * @param {object} handlers - RPC fonksiyonları, createHandlers.js 'den gelir . 
    * @returns {Promise<grpc.Server>}  
 */

function startServer(port, handlers) {
    return new Promise((resolve, reject) => {
        const server = new grpc.Server();

        // FamilyService in fonksiyonlarını bağla
        server.addService(hatokuseProto.FamilyService.service, handlers);

        // server i başlat 
        server.bindAsync(
            `0.0.0.0:${port}`,
            grpc.ServerCredentials.createInsecure(),
            (err, boundPort) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log(`[gRPC SERVER] dinliyor : port ${boundPort}`);
                resolve(server);
            }
        );
    });
}

module.exports = { startServer };
