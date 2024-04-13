module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/src/components/ui/sheet/(.*)$': '<rootDir>/src/components/ui/sheet/$1',
    '^@/lib/utils/(.*)$': '<rootDir>/src/lib/utils/$1',
    '^@/contexts$': '<rootDir>/src/contexts',
    '^@/contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/src/components/(.*)$': '<rootDir>/src/components/$1',
  },
  modulePaths: [
    '<rootDir>',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
}