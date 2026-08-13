const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/backend', '<rootDir>/frontend'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^react$': path.resolve(__dirname, 'node_modules/react'),
    '^react-dom$': path.resolve(__dirname, 'node_modules/react-dom'),
    '^react-dom/(.*)$': path.resolve(__dirname, 'node_modules/react-dom/$1'),
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        module: 'commonjs',
        target: 'es2020',
        esModuleInterop: true,
        allowJs: true,
        skipLibCheck: true
      }
    }]
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts']
};
