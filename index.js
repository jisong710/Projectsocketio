const express = require('express');
const http = require('http');
const https = require('https');
const socketIO = require('socket.io');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser'); 

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const httpsOptions = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(httpsOptions, app);

// Inisialisasi Socket.io untuk kedua server
const ioHttp = socketIO(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const ioHttps = socketIO(httpsServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Endpoint default
app.get('/', (req, res) => {
    res.send('Server Socket.io berjalan!');
});

// Event saat client terhubung
const setupSocketEvents = (io) => {
    io.on('connection', (socket) => {
        console.log('Pengguna terhubung:', socket.id);

        socket.on('message', (msg) => {
            console.log('Pesan dari client:', msg);
            io.emit("message", msg);
        });

        socket.on('disconnect', () => {
            console.log('Pengguna terputus:', socket.id);
        });
    });
};

setupSocketEvents(ioHttp);
setupSocketEvents(ioHttps);

// Menjalankan server pada port 80 dan 443
httpServer.listen(80, () => {
    console.log('Server Socket.io berjalan pada port 80 (HTTP)');
});

httpsServer.listen(443, () => {
    console.log('Server Socket.io berjalan pada port 443 (HTTPS)');
});
