/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
 transform: {
  "^.+.tsx?$": ["ts-jest", {}],
 },
 preset: "ts-jest",
 testEnvironment: "node",
 collectCoverage: true,
 collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/**/index.ts"],
 coverageDirectory: "coverage",
 coverageReporters: ["text", "lcov"],
};
