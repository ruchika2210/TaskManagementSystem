const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());
module.exports = app;


const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const TaskServer = async () => {
    try {
        console.log(`Connecting to the database: ${MONGO_URI}`);
        await mongoose.connect(MONGO_URI);
        console.log('database connected...');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('Failed to connect to Database', err);
    }
};

app.use('/api', routes);

TaskServer();

