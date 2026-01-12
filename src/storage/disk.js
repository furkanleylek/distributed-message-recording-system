const fs = require('fs');
const path = require('path');

class DiskStorage {
    constructor(nodePort) {
        // data/node_5555, data/node_5556 vb.. olarak her node için klasor oluşturur. 

        this.dir = path.join(__dirname, '..', '..', 'data', `node_${nodePort}`);

        if (!fs.existsSync(this.dir)) {
            fs.mkdirSync(this.dir, { recursive: true });
        }
    }

    writeSync(id, message) {
        const filePath = path.join(this.dir, `${id}.msg`);
        fs.writeFileSync(filePath, message, 'utf-8');
    }

    // async writeAsync(id, message) {
    //     const filePath = path.join(this.dir, `${id}.msg`);
    //     await fs.promises.writeFile(filePath, message, 'utf-8');
    // }

    read(id) {
        const filePath = path.join(this.dir, `${id}.msg`);

        if (!fs.existsSync(filePath)) {
            return null;
        }

        return fs.readFileSync(filePath, 'utf-8');
    }

    count() {
        try {
            const files = fs.readdirSync(this.dir);
            return files.filter(f => f.endsWith('.msg')).length;
        } catch {
            return 0;
        }
    }
}

module.exports = { DiskStorage };