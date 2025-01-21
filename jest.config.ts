/* eslint-disable n/no-extraneous-import */
import type { Config } from "@jest/types";
// Sync object
const config: Config.InitialOptions = {
  clearMocks: true,
  verbose: true,
  testMatch: ["**/test/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
export default config;
