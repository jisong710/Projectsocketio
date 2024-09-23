const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors'); // Tambahkan CORS

// Inisialisasi Express
const app = express();
app.use(cors()); // Gunakan CORS pada seluruh route

const server = http.createServer(app);

// Inisialisasi Socket.io dengan konfigurasi CORS
const io = socketIO(server, {
    cors: {
        origin: '*', // Mengizinkan semua origin
        methods: ['GET', 'POST'] // Mengizinkan metode GET dan POST
    }
});

// Endpoint default untuk mengecek server
app.get('/', (req, res) => {
    res.send('Server Socket.io berjalan!');
});

// Event saat client terhubung
io.on('connection', (socket) => {
    console.log('Pengguna terhubung:', socket.id);

    // Event saat menerima pesan dari client
    socket.on('message', (msg) => {
        console.log('Pesan dari client:', msg);
        
        io.emit("message", msg);
        
    });

    // Event saat client terputus
    socket.on('disconnect', () => {
        console.log('Pengguna terputus:', socket.id);
    });
});

// Menjalankan server pada port 3000
server.listen(3000, () => {
    console.log('Server Socket.io berjalan pada port 3000');
});
