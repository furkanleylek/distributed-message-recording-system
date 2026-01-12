const { grpc, hatokuseProto } = require('./loader');

/**
    * node a bağlanmak için client oluşturur,
    * @param {string} host 
    * @param {number} port
    * @returns {FamilyServiceClient} 
 */
function createClient(host, port) {
    return new hatokuseProto.FamilyService(
        `${host}:${port}`,
        grpc.credentials.createInsecure()
    );
}

// join ile family e katılır 
function join(client, myHost, myPort) {
    return new Promise((resolve, reject) => {
        client.Join({ host: myHost, port: myPort }, (err, response) => {
            if (err) reject(err);
            else resolve(response);
        });
    });
}

// üye listesini alır
function getFamily(client) {
    return new Promise((resolve, reject) => {
        client.GetFamily({}, (err, response) => {
            if (err) reject(err);
            else resolve(response);
        });
    });
}

// node crash kontrol 
function heartbeat(client, fromHost, fromPort) {
    return new Promise((resolve, reject) => {
        client.Heartbeat({ from_host: fromHost, from_port: fromPort }, (err, response) => {
            if (err) reject(err);
            else resolve(response);
        });
    });
}

// SET ile mesaj kaydet
function SET(client, messageId, message) {
    return new Promise((resolve, reject) => {
        client.SET({ message_id: messageId, message: message }, (err, response) => {
            if (err) reject(err);
            else resolve(response);
        });
    });
}

// GET ile mesaj getir
function GET(client, messageId) {
    return new Promise((resolve, reject) => {
        client.GET({ message_id: messageId }, (err, response) => {
            if (err) reject(err);
            else resolve(response);
        });
    });
}

module.exports = {
    createClient,
    join,
    getFamily,
    heartbeat,
    SET,
    GET,
};