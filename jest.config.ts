import type { Config } from 'jest';

const config: Config = {
  roots: ['<rootDir>/app/javascript/tests'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/app/javascript/$1',
  },
  setupFiles: ['<rootDir>/app/javascript/tests/mocks/mockLocalStorage.ts'],
  testEnvironment: 'jsdom',
};

export default config;
