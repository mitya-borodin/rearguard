/* eslint-disable @typescript-eslint/no-var-requires */
const os = require("os");
const path = require("path");

module.exports = {
  transform: {
    "^.+\\.ts?$": "ts-jest",
    "^.+\\.tsx?$": "ts-jest",
  },
  testEnvironment: "node",
  collectCoverageFrom: ["src/**/*.ts", "tools/**/*.ts"],
  moduleFileExtensions: ["js", "json", "ts", "tsx"],
  globals: {
    "ts-jest": {
      tsConfig: "<rootDir>/tsconfig.jest.json",
    },
  },
  reporters: [
    "default",
    "jest-junit",
    [
      "jest-html-reporters",
      {
        publicPath: "./test-reports",
        pageTitle: "Rearguard",
        filename: "jest-unit-testreport.html",
        includeFailureMsg: true,
        expand: true,
      },
    ],
  ],
  cacheDirectory: path.resolve(os.tmpdir(), "rearguard_jest"),
  notify: true,
  notifyMode: "always",
};
