import { expect } from "chai";
import * as fs from "fs";
import "mocha";
import * as path from "path";
import build from "../../src/config/source/build.config";

const CWD = process.cwd();
const configPath = path.resolve(CWD, "build.config.json");
const essentialConfig = {
  context: "src",
  entry: "index.tsx",
  modules: ["src"],
  output: {
    path: "dist",
    publicPath: "/",
  },
  // tslint:disable-next-line:object-literal-sort-keys
  npmHardSync: [],
  postCSS: {
    plugins: "postCssPlugins.js",
  },
  proxy: {
    "/api": "http://localhost:5000",
    "/ws": {
      changeOrigin: true,
      target: "http://localhost:5000",
      ws: true,
    },
  },
  typescript: {
    config: {
      compileOnSave: false,
      compilerOptions: {},
    },
    configPath: "tsconfig.json",
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
      expect(JSON.stringify(build(), null, 2)).to.equal(
        JSON.stringify(essentialConfig, null, 2),
      );
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
        browserslist: [1, 1, "not ie <= 11"],
        context: [33333],
        css: {
          postCssPlugins: false,
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
          },
        },
      };

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    });

    it('Context must be "src"', () => {
      const { context } = build();

      expect(context).to.equal("src");
    });
    it('Entry must be "index.tsx"', () => {
      const { entry } = build();

      expect(entry).to.equal("index.tsx");
    });
    it('Output, path must be "dist", publicPath must be "/"', () => {
      const {
        output: { path: PATH, publicPath },
      } = build();

      expect(PATH).to.equal("dist");
      expect(publicPath).to.equal("/");
    });
    it('Modules must be ["src"]', () => {
      const { modules } = build();

      expect(JSON.stringify(modules)).to.equal(JSON.stringify(["src"]));
    });
    it("CSS must be correct", () => {
      const config = build();

      expect(config.postCSS.plugins).to.equal("postCssPlugins.js");
    });
    it("Proxy must be correct", () => {
      const config = build();

      expect(config.proxy["/api"]).to.equal("http://localhost:5000");
    });
    it("Typescript must be correct", () => {
      const config = build();

      expect(JSON.stringify(config.typescript)).to.equal(
        JSON.stringify({
          config: {
            compileOnSave: false,
            compilerOptions: {},
          },
          configPath: "tsconfig.json",
        }),
      );
    });
  });
});
