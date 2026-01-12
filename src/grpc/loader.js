const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// proto dosyasının yolu
const PROTO_PATH = path.join(__dirname, '..', '..', 'proto', 'hatokuse.proto');

// protoyu yükle
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

// proto içerisindeki rpc bağlantılarını çıkarır 
const hatokuseProto = grpc.loadPackageDefinition(packageDefinition).hatokuse;

module.exports = { grpc, hatokuseProto };
