const express = require('express');

const PORT = parseInt(process.env.PORT, 10) || 8080;
const KEY_SERVER_URI = 'http://localhost:8081';
const datastore = require('./datastore')(DATASTORE);

const app = express();

// device manager

app.listen(PORT, console.log(`Listening on port ${PORT}`))


