const express = require('express');

const { DATASTORE } = require('./constants');

const PORT = parseInt(process.env.PORT, 10) || 8080;
const KEY_SERVER_URI = 'http://localhost:8080';
//const datastore = require('./datastore')(DATASTORE);

// const app = express();
// app.listen(PORT, console.log(`Listening on port ${PORT}`))

// device manager

const Device = require('./device');
const d = new Device('one', 8081, KEY_SERVER_URI);


