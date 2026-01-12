/**
     * hangi message hangi üyelerde tutuluyor kaydını tutar, 
     * sadece lider kullanır, 
     * RAM üzerinde kayıt tutulur. 
 */
class MessageIndex {
    constructor() {
        // messageId -> [{ host, port }, { host, port }]
        this.index = new Map();
    }

    set(messageId, members) {
        this.index.set(messageId, [...members]);
    }

    get(messageId) {
        return this.index.get(messageId) || [];
    }

}

module.exports = { MessageIndex };