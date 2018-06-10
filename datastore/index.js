const memory = require('./memory');

module.exports = (type) => {
  switch (type) {
    case 'memory':
      return memory;
    default:
      throw new Error(`Invalid datastore type: ${type}`);
  }
};
