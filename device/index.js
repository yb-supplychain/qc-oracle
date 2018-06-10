const fs = require('fs');
const express = require('express');
const { randomRange, randomBytes } = require('bcrypto');
const constants = require('../constants');
const { createKeyPair, readKeyPair } = require('../crypto');
const assert = require('assert')
const bcurl = require('bcurl');

class Device {
  constructor(name, port, keyServerURI, datastore='memory') {
    this.app = express();
    this.name = name;
    this.privkeypem = null;
    this.pubkeypem = null;

    this.port = port;
    this.keyServerURI = keyServerURI;
    this.datastore = datastore;

    // for keyserver endpoint
    this.type = 'device';
    this.client = bcurl.client(keyServerURI);

    this.init();
  }

  init() {
    this.registerRoutes();
    this.getKeys();
    this.tryRegisterKeyServer();
    this.start();
  }

  start() {
    this.app.listen(PORT, () => console.log(`listening on ${PORT}`));
  }

  // try to read keys, otherwise create them
  getKeys() {
    let keys;
    try {
      keys = readKeyPair();
    } catch (e) {
      keys = createKeyPair();
    }
    const { privkeypem, pubkeypem } = keys;
    this.privkeypem = privkeypem;
    this.pubkeypem = pubkeypem;
  }

  // register with keyserver
  tryRegisterKeyServer() {
    try {
      assert(this.name !== null);
      this.addPubKey(this.type, this.name, this.pubkeypem);
    } catch (e) {
      console.log(e);
      // TODO: differentiate between
      // key already exists
      // cannot connect to server
    }
  }

  async addPubKey(type, name, pem) {
    try {
      const response = await this.client.post(`/pubkey/${type}/${name}`, { pubkey: pem })
      console.log(response)
    } catch (e) {
      console.log(e);
    }
  }

  registerRoutes() {
    this.app.get('/', (req, res) => {
      res.json({ message: 'status OK' });
    });

    this.app.get('/data', (req, res) => {
      const { query } = req;
      const response = {};
      for ([key,val] of Object.entries(query)) {
        switch (key) {
          case 'weight':
            response.weight = randomRange(1, 1000);
            break;
          case 'location':
            response.location = constants.LOCATIONS[randomRange(0, constants.LOCATIONS.length-1)]
            break;
          case 'temperature':
            response.temperature = randomRange(50, 100)
            break;
          case 'light':
            response.light = constants.LIGHT[randomRange(0, constants.LIGHT.length)]
            break;
          case 'air':
            response.air = constants.AIR[randomRange(0, constants.AIR.length-1)]
            break;
          case 'humidity':
            response.humidity = randomRange(50, 100)
            break;
        }
      }
      res.json(response);
    });
  }
}

