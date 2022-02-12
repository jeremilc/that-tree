import * as ws from 'ws';
import * as fs from 'fs';

const wss = new ws.WebSocketServer({ port: 3001 });
function readNode(path: string, node: string) {
    const currentPath = (path ? path + '/' : '') + node;
    if (fs.lstatSync(currentPath).isDirectory()) {
        const folderContent = fs.readdirSync(currentPath);
        return {
            path: node,
            nodes: folderContent.map((fileOrFolder) => readNode(currentPath, fileOrFolder)),
        };
    } else {
        return {
            path: node,
        };
    }
}

const [, , ...rootPaths] = process.argv;
function readRootNodes() {
    return rootPaths.map((path) => readNode('', path));
}

wss.on('connection', function connection(ws) {
    ws.send(JSON.stringify(readRootNodes()));
});

rootPaths.forEach((path) => {
    fs.watch(path, { recursive: true }, () => {
        wss.clients.forEach(function each(client) {
            if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify(readNode('', path)));
            }
        });
    })
})

