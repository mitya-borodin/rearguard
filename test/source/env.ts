import { expect } from "chai";
import "mocha";
import env from "../../src/config/source/env.config";

describe("Source", () => {
  describe("env", () => {
    before(() => {
      process.env.NODE_ENV = "development";
      process.env.REARGUARD_NODE_MODULE_PATH = "/node_module/path";
      process.env.REARGUARD_ISOMORPHIC = "true";
      process.env.REARGUARD_TYPE_SCRIPT = "true";
      process.env.REARGUARD_ONLY_SERVER = "true";
      process.env.REARGUARD_VERBOSE = "true";
      process.env.REARGUARD_ANALYZE = "true";
      process.env.REARGUARD_DEBUG = "true";
      process.env.REARGUARD_INFERNO_JS = "true";
      process.env.REARGUARD_REACT = "true";
    });

    it("isDevelopment must be true", () => {
      const { isDevelopment } = env();

      expect(isDevelopment).to.equal(true);
    });
    it("isDebug must be true", () => {
      const { isDebug } = env();

      expect(isDebug).to.equal(true);
    });
    it("isVerbose must be true", () => {
      const { isVerbose } = env();

      expect(isVerbose).to.equal(true);
    });
    it("isAnalyze must be true", () => {
      const { isAnalyze } = env();

      expect(isAnalyze).to.equal(true);
    });
    it("isIsomorphic must be true", () => {
      const { isIsomorphic } = env();

      expect(isIsomorphic).to.equal(true);
    });
    it("isInferno must be true", () => {
      const { isInferno } = env();

      expect(isInferno).to.equal(true);
    });
    it("isReact must be true", () => {
      const { isReact } = env();

      expect(isReact).to.equal(true);
    });
    it("isTS must be true", () => {
      const { isTS } = env();

      expect(isTS).to.equal(true);
    });
    it("onlyServer must be true", () => {
      const { onlyServer } = env();

      expect(onlyServer).to.equal(true);
    });
    it("nodeModulePath must be true", () => {
      const { nodeModulePath } = env();

      expect(nodeModulePath).to.equal("/node_module/path");
    });
  });
});
