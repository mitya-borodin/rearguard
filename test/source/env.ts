import { expect } from "chai";
import "mocha";
import env from "../../src/config/source/env.config";

describe("Source", () => {
  describe("env", () => {
    before(() => {
      process.env.NODE_ENV = "development";
      process.env.REARGUARD_NODE_MODULE_PATH = "/node_module/path";
      process.env.REARGUARD_DEBUG = "true";
      process.env.REARGUARD_LAUNCH_IS_START = "true";
      process.env.REARGUARD_LAUNCH_IS_BUILD = "true";
    });

    it("isDevelopment must be true", () => {
      const { isDevelopment } = env();

      expect(isDevelopment).to.equal(true);
    });
    it("isDebug must be true", () => {
      const { isDebug } = env();

      expect(isDebug).to.equal(true);
    });
    it("isBuild must be true", () => {
      const { isBuild } = env();

      expect(isBuild).to.equal(true);
    });
    it("nodeModulePath must be true", () => {
      const { nodeModulePath } = env();

      expect(nodeModulePath).to.equal("/node_module/path");
    });
  });
});
