module.exports = {
    roots: [
        "<rootDir>/src",
    ],
    testMatch: ["**/__tests__/**/?(*.)+(spec|test).+(ts|js)"],
    modulePathIgnorePatterns: ["node_modules"],
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
        "vscode": "<rootDir>/src/__mocks__/vscode.js"
    }
}
