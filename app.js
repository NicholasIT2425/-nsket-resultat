const express = require('express');
const path = require('path');
const http = require('http');
const { WebSocketServer } = require('ws');
const fs = require('fs');

const app = express();
const port = 3000;
const server = http.createServer(app);

// Opprett WebSocket-server
const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
    console.log('WebSocket connection established');
});

// Send live-reload-melding til alle klienter
const broadcastReload = () => {
    wss.clients.forEach((client) => {
        if (client.readyState === 1) { // WebSocket er åpen
            client.send('reload');
        }
    });
};

// Overvåk filendringer i `public`-mappen
fs.watch(path.join(__dirname, 'public'), { recursive: true }, (eventType, filename) => {
    console.log(`File changed: ${filename}`);
    broadcastReload();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'view', 'index.html'));
});



app.get('/Hei', (req, res) => {
    res.send('Yo');
});

// Start HTTP- og WebSocket-server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
