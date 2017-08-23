import {expect} from "chai";
import * as fs from "fs";
import "mocha";
import * as path from "path";
import build from "../../src/config/source/build.config";

const CWD = process.cwd();
const configPath = path.resolve(CWD, "build.config.json");
const essentialConfig = {
  browserslist: [
    ">0.1%",
    "last 2 versions",
    "not ie <= 11",
  ],
  context: "src",
  css: {
    isolation: true,
    postCssPlugins: "postCssPlugins.js",
    reset: {
      "all": "initial",
      "boxSizing": "border-box",
      "display": "block",
      "font-family": "Avenir Next, -apple-system, BlinkMacSystemFonts, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
      "font-size": "inherit",
    },
  },
  entry: "main.js",
  isomorphic: {
    entry: "server.js",
    publicDirName: "public",
  },
  modules: [
    "src",
  ],
  output: {
    path: "dist",
    publicPath: "/",
  },
  proxy: {
    "/api": "http://localhost:5000",
  },
  typescript: {
    config: {
      compileOnSave: false,
      compilerOptions: {},
    },
    configPath: "tsconfig.json",
    showConfigForIDE: true,
  },
};

describe("Source", () => {
  before(() => {
    process.env.REARGUARD_ERROR_LOG = "false";
  });

  after(() => {
    process.env.REARGUARD_ERROR_LOG = "true";
  });

  afterEach(() => {
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
  });

  describe("Build, file build.config.json is not exist.", () => {

    it("Config must be equal to essential config.", () => {
      expect(JSON.stringify(build(), null, 2)).to.equal(JSON.stringify(essentialConfig, null, 2));
    });
    it("Config file build.config.json must be exist.", () => {
      build();

      expect(fs.existsSync(configPath)).to.equal(true);
    });
  });
  describe("Build, success case file build.config.json exist.", () => {
    beforeEach(() => {
      fs.writeFileSync(configPath, JSON.stringify(essentialConfig, null, 2));
    });

    it("Config must be equal to essential config.", () => {
      expect(JSON.stringify(build())).to.equal(JSON.stringify(essentialConfig));
    });
  });
  describe("Build, failure case, file build.config.json exist.", () => {
    beforeEach(() => {
      const config = {
        browserslist: [
          1,
          1,
          "not ie <= 11",
        ],
        context: [
          33333,
        ],
        css: {
          postCssPlugins: false,
          reset: {
            "all": "initial",
            "boxSizing": "border-box",
            "display": "block",
            "font-family": 34,
            "font-size": 234234,
          },
        },
        entry: false,
        isomorphic: {
          entry: null,
          publicDirName: NaN,
        },
        output: {
          path: 100,
          publicPath: [],
        },
        proxy: {
          "/api": 44444,
        },
        typescript: {

          config: {
            compilerOptions: {},
            showConfigForIDE: 345345,

          },
        },
      };

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    });

    it('Context must be "src"', () => {
      const {context} = build();

      expect(context).to.equal("src");
    });
    it('Entry must be "main.js"', () => {
      const {entry} = build();

      expect(entry).to.equal("main.js");
    });
    it('Output, path must be "dist", publicPath must be "/"', () => {
      const {output: {path: PATH, publicPath}} = build();

      expect(PATH).to.equal("dist");
      expect(publicPath).to.equal("/");
    });
    it('Modules must be ["src"]', () => {
      const {modules} = build();

      expect(JSON.stringify(modules)).to.equal(JSON.stringify(["src"]));
    });
    it("CSS must be correct", () => {
      const config = build();

      expect(config.css.isolation).to.equal(true);
      expect(config.css.postCssPlugins).to.equal("postCssPlugins.js");
      expect(config.css.reset["font-family"]).to.equal(
        "Avenir Next, -apple-system, BlinkMacSystemFonts, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif");
      expect(config.css.reset["font-size"]).to.equal("inherit");
    });
    it("Isomorphic must be correct", () => {
      const config = build();

      expect(config.isomorphic.entry).to.equal("server.js");
      expect(config.isomorphic.publicDirName).to.equal("public");
    });
    it("Proxy must be correct", () => {
      const config = build();

      expect(config.proxy["/api"]).to.equal("http://localhost:5000");
    });
    it("Typescript must be correct", () => {
      const config = build();

      expect(JSON.stringify(config.typescript)).to.equal(JSON.stringify({
        config: {
          compileOnSave: false,
          compilerOptions: {},
        },
        configPath: "tsconfig.json",
        showConfigForIDE: true,
      }));
    });
    it("BrowserList must be correct", () => {
      const config = build();

      expect(JSON.stringify(config.browserslist)).to.equal(JSON.stringify([
        ">0.1%",
        "last 2 versions",
        "not ie <= 11",
      ]));
    });
  });
});
