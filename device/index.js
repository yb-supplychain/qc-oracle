const fs = require('fs');
const express = require('express');
const { randomRange, randomBytes } = require('bcrypto');
const constants = require('../constants');
const { createKeyPair, readKeyPair } = require('../crypto');
const assert = require('assert')
const bcurl = require('bcurl');
const { log } = require('../utils');

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
    log(`using key server uri: ${keyServerURI}`);
    this.client = bcurl.client(keyServerURI);

    this.init();
  }

  init() {
    this.registerRoutes();
    this.getKeys();
    this.tryRegisterKeyServer();
    this.mock()
    this.start();
  }

  start() {
    this.server = this.app.listen(this.port, () => console.log(`listening on ${this.port}`));
  }

  mock() {
    let data;
    setTimeout(() => {
      data = this.mockData({
        'temperature': '',
        'location': '',
        'air': '',
        'humidity': '',
        'light': ''
      });
      log(`datapoint: ${JSON.stringify(data)}`)
      // post data to chain
      // get order, update it sign it
    }, 100)
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
    log(`type: ${type}, name: ${name}, pem: ${pem}`);
    try {
      await this.client.post(`pubkey/${type}/${name}`, { key: pem })
      log(`added pubkey: ${name}`);
    } catch (e) {
      console.log(e);
    }
  }

  // this doesn't work -_-
  close() {
    this.server.close();
  }

  registerRoutes() {
    log('register routes');
    this.app.get('/', (req, res) => {
      res.json({ message: 'status OK' });
    });

    this.app.get('/data', (req, res) => {
      const { query } = req;
      const response = this.mockData(query);
      log(`data: ${JSON.stringify(response)}`)
      res.json(response);
    });
  }
  // TODO: rename input
  mockData(query) {
    const response = {};
    for (let [key,val] of Object.entries(query)) {
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
    return response;
  }
}

module.exports = Device;
