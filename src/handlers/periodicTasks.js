const ctx = require('../utils/context');
const grpcClient = require('../grpc/client');

// üye nodeların hayatta olup olmadığını kontrol eder,  
async function healthCheck() {
    const others = ctx.registry.getOthers(ctx.HOST, ctx.myPort);

    for (const node of others) {
        try {
            const client = grpcClient.createClient(node.host, node.port);
            await grpcClient.heartbeat(client, ctx.HOST, ctx.myPort);
            // Cevap geldi, node hayatta
        } catch (err) {
            // Cevap gelmedi, node öldü
            console.log(`[HEALTH] ${node.host}:${node.port} öldü, listeden çıkarılıyor`);
            ctx.registry.remove(node);
        }
    }
}

// periyodik ekran logu 
function printStatus() {
    const members = ctx.registry.getAll();

    console.log('');
    console.log('========================================');
    console.log(`Node: ${ctx.HOST}:${ctx.myPort} ${ctx.isLeader ? '(LİDER)' : '(ÜYE)'}`);
    console.log(`Zaman: ${new Date().toLocaleTimeString()}`);
    console.log(`Diskteki mesaj: ${ctx.storage.count()}`);
    console.log(`Üye sayısı: ${members.length}`);
    console.log('Üyeler:');

    for (const m of members) {
        const isMe = (m.host === ctx.HOST && m.port === ctx.myPort);
        console.log(`  - ${m.host}:${m.port}${isMe ? ' (✓)' : ''}`);
    }

    console.log('========================================');
    console.log('');
}


function startPeriodicTasks() {

    setInterval(() => {
        printStatus();
    }, 10000);

    if (ctx.isLeader) {
        setInterval(() => {
            healthCheck();
        }, 10000);
    }
}

module.exports = { startPeriodicTasks };