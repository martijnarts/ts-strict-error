import { Config } from "@jest/types";

const config: Config.InitialOptions = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
};
export default config;
