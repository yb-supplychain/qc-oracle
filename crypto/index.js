const ursa = require('ursa');
const fs = require('fs');

const { HOMEDIR, PUBKEY, PRIVKEY } = require('../constants');

const createKeyPair = (persist=true, dir=HOMEDIR) => {
  const key = ursa.generatePrivateKey(1024, 65537);
  const privkeypem = key.toPrivatePem().toString('ascii');
  const pubkeypem = key.toPublicPem().toString('ascii');

  if (persist) {
    fs.writeFileSync(`${dir}/${PUBKEY}`, pubkeypem);
    fs.writeFileSync(`${dir}/${PRIVKEY}`, privkeypem);
  }
  return { privkeypem, pubkeypem };
};

const readKeyPair = (dir=HOMEDIR) => {
  try {
    return {
      privkeypem: fs.readFileSync(`${dir}/${PRIVKEY}`).toString('ascii'),
      pubkeypem: fs.readFileSync(`${dir}/${PUBKEY}`).toString('ascii'),
    }
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createKeyPair,
  readKeyPair
}
