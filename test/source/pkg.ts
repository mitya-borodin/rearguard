import { expect } from "chai";
import "mocha";
import pkg from "../../src/config/source/pkg.info";

describe("Source", () => {
  it("Pkg, nodeVersion must be Number.isFinite", () => {
    const config = pkg();

    expect(Number.isFinite(config.nodeVersion)).to.equal(true);
  });
  it("Engines must be defined.", () => {
    const config = pkg();

    expect(Object.keys(config.engines).length > 0).to.equal(true);
  });
});
