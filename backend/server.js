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


app.listen(PORT, () => {
    console.log(`😘💋 Server 🏨 ~ Nz Hotel ~ 🏨 started on http://localhost:${PORT} 💋😘`)
});