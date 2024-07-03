/** @type {import('jest').Config} */
const config = {
    testEnvironment: "jsdom",
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/coverage",
        "package.json",
        "package-lock.json",
        "reportWebVitals.ts",
        "setupTests.ts",
        "index.tsx"
    ],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
}

module.exports = config