import {expect} from "chai";
import "mocha";
import env from "../../src/config/source/env.config";

describe("Source", () => {
  describe("env", () => {
    before(() => {
      process.env.NODE_ENV = "development";
      process.env.REARGUARD_NODE_MODULE_PATH = "/node_module/path";
      process.env.REARGUARD_ISOMORPHIC = "true";
      process.env.REARGUARD_ONLY_SERVER = "true";
      process.env.REARGUARD_VERBOSE = "true";
      process.env.REARGUARD_ANALYZE = "true";
      process.env.REARGUARD_DEBUG = "true";
      process.env.REARGUARD_SOURCE_MAP = "true";
      process.env.REARGUARD_LAUNCH_IS_START = "true";
      process.env.REARGUARD_LAUNCH_IS_BUILD = "true";
      process.env.REARGUARD_STATIC_SERVER = "true";
    });

    it("isDevelopment must be true", () => {
      const {isDevelopment} = env();

      expect(isDevelopment).to.equal(true);
    });
    it("isDebug must be true", () => {
      const {isDebug} = env();

      expect(isDebug).to.equal(true);
    });
    it("isVerbose must be true", () => {
      const {isVerbose} = env();

      expect(isVerbose).to.equal(true);
    });
    it("isAnalyze must be true", () => {
      const {isAnalyze} = env();

      expect(isAnalyze).to.equal(true);
    });
    it("isIsomorphic must be true", () => {
      const {isIsomorphic} = env();

      expect(isIsomorphic).to.equal(true);
    });
    it("isStart must be true", () => {
      const {isStart} = env();

      expect(isStart).to.equal(true);
    });
    it("isBuild must be true", () => {
      const {isBuild} = env();

      expect(isBuild).to.equal(true);
    });
    it("onlyServer must be true", () => {
      const {onlyServer} = env();

      expect(onlyServer).to.equal(true);
    });
    it("nodeModulePath must be true", () => {
      const {nodeModulePath} = env();

      expect(nodeModulePath).to.equal("/node_module/path");
    });
    it("staticServer must be true", () => {
      const {staticServer} = env();

      expect(staticServer).to.equal(true);
    });
    it("isSourceMap must be true", () => {
      const {isSourceMap} = env();

      expect(isSourceMap).to.equal(true);
    });
  });
});
