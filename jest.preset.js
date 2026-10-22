const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },
};

