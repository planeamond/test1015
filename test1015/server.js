const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = new Set();

// 'src' 폴더에서 정적 파일 제공
app.use(express.static(path.join(__dirname, 'src')));

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('A new client connected. Current number of clients:', clients.size);
    
    ws.on('close', () => {
        clients.delete(ws);
        console.log('A client disconnected. Current number of clients:', clients.size);
    });

    ws.on('message', (message) => {
        // Broadcast the mouse position to all connected clients
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});