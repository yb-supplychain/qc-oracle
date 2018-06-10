const log = (string) => {
  if (process.env.LOGGER) {
    console.log(string);
  }
};

module.exports = {
  log
}
