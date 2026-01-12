/**
    * NodeRegistry - family üyelerini tutar
 */
class NodeRegistry {
    constructor() {
        // Map: "host:port" -> { host, port }
        this.nodes = new Map();
    }

    // üye ekle
    add(node) {
        const key = `${node.host}:${node.port}`;
        this.nodes.set(key, { host: node.host, port: node.port });
    }

    // birden fazla üye ekle
    addAll(nodeList) {
        for (const node of nodeList) {
            this.add(node);
        }
    }

    // üye çıkar
    remove(node) {
        const key = `${node.host}:${node.port}`;
        this.nodes.delete(key);
    }

    // tüm üyeleri dizi olarak döndür
    getAll() {
        return Array.from(this.nodes.values());
    }

    // kendi hariç diğerlerini döndür
    getOthers(myHost, myPort) {
        return this.getAll().filter(n =>
            !(n.host === myHost && n.port === myPort)
        );
    }

    // üye sayısı
    size() {
        return this.nodes.size;
    }
}

module.exports = { NodeRegistry };
