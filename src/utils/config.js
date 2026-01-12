const fs = require('fs');
const path = require('path');

/**
     * tolerance.conf dosyasını okur
     * format: TOLERANCE=2
 */

function loadConfig() {
    const configPath = path.join(__dirname, '..', '..', 'tolerance.conf');

    try {
        const content = fs.readFileSync(configPath, 'utf-8');

        // TOLERANCE dan sonra gelen tüm rakamları alır
        const match = content.match(/TOLERANCE=(\d+)/);

        if (match) {
            return { tolerance: parseInt(match[1], 10) };
        }
    } catch (err) {

    }
    // okuma yapamazsa default değer : 2 
    return { tolerance: 2 };
}
module.exports = { loadConfig };
