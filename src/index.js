const { startServer } = require('./grpc/server');
const { findFreePort } = require('./utils/portFinder');
const { HOST, START_PORT } = require('./utils/constants');
const { NodeRegistry } = require('./utils/registry');
const { DiskStorage } = require('./storage/disk');
const { loadConfig } = require('./utils/config');
const { createHandlers } = require('./handlers/createHandlers');
const { discoverNodes } = require('./network/discoverNodes');
const { startTCPServer } = require('./network/clientTCPServer');
const { startPeriodicTasks } = require('./handlers/periodicTasks');
const { MessageIndex } = require('./storage/messageIndex');


const ctx = require('./utils/context');

async function main() {
    const myPort = await findFreePort();
    const isLeader = (myPort === START_PORT);

    const config = loadConfig();

    const registry = new NodeRegistry();
    const storage = new DiskStorage(myPort);
    const messageIndex = new MessageIndex();


    registry.add({ host: HOST, port: myPort });

    ctx.HOST = HOST;
    ctx.myPort = myPort;
    ctx.isLeader = isLeader;
    ctx.registry = registry;
    ctx.storage = storage;
    ctx.config = config;
    ctx.messageIndex = messageIndex;

    // gRPC serveri başlatır
    await startServer(myPort, createHandlers(registry, storage));

    console.log('========================================');
    console.log(`Node başladı : ${HOST}:${myPort}`);
    console.log(`Rol : ${isLeader ? 'LİDER' : 'ÜYE'}`);
    console.log('========================================');

    await discoverNodes(myPort, registry);

    // lider ise client ile iletişim kuracak olan serveri başlat
    if (isLeader) {
        startTCPServer();
    }

    // healtcheck , periodic log
    startPeriodicTasks();
}

main().catch(err => {
    console.error('Hata:', err);
    process.exit(1);
});