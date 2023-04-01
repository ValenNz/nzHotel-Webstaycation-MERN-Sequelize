const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const path = require('path');
const app = express();
const PORT = process.env.SERVER_PORT || 8000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const userRoute = require('./routes/userRoutes');
app.use('/api/v1/hotel/user', userRoute);

const pelangganRoute = require('./routes/pelangganRoutes');
app.use('/api/v1/hotel/pelanggan', pelangganRoute);

const tipeKamarRoute = require('./routes/tipeKamarRoutes');
app.use('/api/v1/hotel/tipekamar', tipeKamarRoute);

const kamarRoute = require('./routes/kamarRoutes');
app.use('/api/v1/hotel/kamar', kamarRoute);

const pemesananRoute = require('./routes/pemesananRoutes');
app.use('/api/v1/hotel/pemesanan', pemesananRoute);

const detailPemesananRoute = require('./routes/detailPemesananRoutes');
app.use('/api/v1/hotel/detailpemesanan',detailPemesananRoute);

app.listen(PORT, () => {
    console.log(`😘💋 Server 🏨 ~ Nz Hotel ~ 🏨 started on http://localhost:${PORT} 💋😘`)
});