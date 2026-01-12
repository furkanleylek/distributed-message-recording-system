/**
     * gRPC handlerları oluşturur, 
     * bu fonksiyonlar diğer nodelar var olan node u çağırınca çalışır
 */
function createHandlers(registry, storage) {
    return {
        // yeni üye katılmak istedigi zaman aktif olur 
        Join: (call, callback) => {
            const newNode = call.request;
            console.log(`[JOIN] yeni üye : ${newNode.host}:${newNode.port}`);

            registry.add(newNode);

            callback(null, { members: registry.getAll() });
        },

        // üye listesini listeler
        GetFamily: (call, callback) => {
            callback(null, { members: registry.getAll() });
        },

        // node hayatta mı ? 
        Heartbeat: (call, callback) => {
            callback(null, { alive: true, message_count: 0 });
        },

        // mesaj kaydet, lider ister
        SET: (call, callback) => {
            const { message_id, message } = call.request;
            console.log(`[SET] id = ${message_id}, mesaj = ${message}`);

            try {
                storage.writeSync(message_id, message);
                console.log(`[SET] diske yazıld : ${message_id}`);
                callback(null, { success: true, error: '' });
            } catch (err) {
                console.error(`[SET] hata : ${err.message}`);
                callback(null, { success: false, error: err.message });
            }
        },

        // mesaj getir, lider ister
        GET: (call, callback) => {
            const { message_id } = call.request;
            console.log(`[GET] id = ${message_id}`);

            const content = storage.read(message_id);

            if (content !== null) {
                callback(null, { success: true, message: content, error: '' });
            } else {
                callback(null, { success: false, message: '', error: 'mesaj bulunamadı' });
            }
        },

    };
}


module.exports = { createHandlers };