// jest.config.js
const { defaults } = require("jest-config");

module.exports = {
  ...defaults,
  rootDir: "tests",
  verbose: true
  // moduleFileExtensions: [...defaults.moduleFileExtensions]
};
