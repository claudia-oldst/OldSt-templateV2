/* eslint-disable */
export default {
    displayName: "backend-prisma-db-lib",
    preset: "../../../jest.preset.js",
    globals: {},
    testEnvironment: "node",
    transform: {
        "^.+\\.[tj]s$": [
            "ts-jest",
            {
                tsconfig: "<rootDir>/tsconfig.spec.json",
            },
        ],
    },
    moduleFileExtensions: ["ts", "js", "html"],
    coverageDirectory: "../../../coverage/libs/backend/prisma-db-lib",
};
