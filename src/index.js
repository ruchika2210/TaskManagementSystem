

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');
const dotenv = require('dotenv');
const helmet = require('helmet');  

dotenv.config();

const app = express();

//it helps to improve the security in the web application by setting HTTP headers

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"], 
            styleSrc: ["'self'"],      
          }
    },
    referrerPolicy: { policy: 'no-referrer' },
    xssFilter: true,
    noSniff: true
}));

app.use(bodyParser.json());
app.use('/api', routes);

module.exports = app;

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const TaskServer = async () => {
    try {
        console.log(`Connecting to the database: ${MONGO_URI}`);
        await mongoose.connect(MONGO_URI);
        console.log('Database connected...');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('Failed to connect to Database', err);
    }
};

TaskServer();
