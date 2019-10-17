module.exports = {
    roots: [
        '<rootDir>/src'
    ],
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.ts'
    ],
    coverageDirectory: 'coverage'
};