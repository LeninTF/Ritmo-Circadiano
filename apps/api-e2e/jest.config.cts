process.env.JWT_SECRET = process.env.JWT_SECRET || 'a'.repeat(32);
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://x';

module.exports = {
  displayName: 'api-e2e',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  testMatch: ['**/src/**/*.e2e-spec.ts', '**/src/**/*.spec.ts'],
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/api-e2e',
};
