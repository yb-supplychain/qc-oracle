class MemoryStore {
  constructor(types=[]) {
    this.store = {}
    for (let i = 0; i < types.length; i++) {
      this.store[type] = {};
    }
  }

  put(type, key, val) {
    this.store[type][key] = val;
  }

  get(type, key) {
    return this.store[type][key];
  }

  print() {
    console.log(JSON.stringify(this.store, null, 2));
  }
}

module.exports = {
  MemoryStore
}
