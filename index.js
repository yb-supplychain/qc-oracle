const express = require('express');
const { randomBytes } = require('bcrypto');
const { DATASTORE } = require('./constants');
const Device = require('./device');

// device manager
class Manager {
  constructor(port, keyServerURI) {
    this.port = port;
    this.keyServerURI = keyServerURI;
    this.app = express();
    this.devices = []

    // need to run all devices on different ports
    this.lastDevicePort = this.port + 1;

    this.init();
  }

  init() {
    this.registerRoutes();
    this.start();
  }

  registerRoutes() {
    this.app.post('/device', (req, res) => {
      let device = new Device(randomBytes(4).toString('hex'), this.lastDevicePort++, this.keyServerURI);
      this.devices.push(device)
      res.json({ message: 'success' })
    });

    this.app.get('/devices', (req, res) => {
      res.json({
        devices: this.devices.map(d => d.name)
      })
    })
  }

  start() {
    this.app.listen(this.port, console.log(`Listening on port ${this.port}`));
  }
  close() {
    this.devices.forEach(device => {
      device.close()
    });
  }
}

if (require.main) {
  const PORT = parseInt(process.env.PORT, 10) || 8082;
  const KEY_SERVER_URI = 'http://localhost:8080';
  const m = new Manager(PORT, KEY_SERVER_URI);
  process.on('SIGINT', () => m.close(() => process.exit(0)));
}
