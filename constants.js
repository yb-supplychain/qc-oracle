const fs = require('fs');

module.exports = {
  LOCATIONS: [
    'New York',
    'Denver',
    'Austin'
  ],
  LIGHT: [
    'on',
    'off'
  ],
  AIR: [
    'high',
    'medium',
    'low'
  ],
  HOMEDIR: __dirname,
  PUBKEY: 'pub.pem',
  PRIVKEY: 'priv.pem',
  NAMEFILE: 'name',
  DATASTORE: 'memory',
  FACTOM_OPTIONS: {
    url: 'https://apiplus-api-sandbox-testnet.factom.com/v1/',
    headers: {
      "Content-Type": "application/json",
      "factom-provider-token": fs.readFileSync(`${__dirname}/secrets.env`).toString()
    }
  },
  ORDER_TAG: 'ybsc_devices'
};
