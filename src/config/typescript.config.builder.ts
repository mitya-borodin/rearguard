import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as path from "path";
import {
  context,
  isInferno,
  isTS,
  resolveTarget,
  typescript,
  typescriptConfigFilePath,
  typescriptTMP,
} from "./target.config";

export default () => {
  if (isTS) {
    const { configPath, showConfigForIDE, config: { compilerOptions, compileOnSave } } = typescript;
    const { dependencies: { typescript: version } } = require(path.resolve(__dirname, "../../package.json"));
    const config = {
      compileOnSave,
      compilerOptions: Object.assign({
        allowJs: false,
        alwaysStrict: true,
        baseUrl: context,
        downlevelIteration: false,
        importHelpers: true,
        isolatedModules: false,
        lib: [
          "es6",
          "es7",
          "dom",
        ],
        module: "es6",
        moduleResolution: "node",
        noImplicitAny: true,

        noImplicitReturns: true,
        noUnusedLocals: true,
        paths: {},
        removeComments: true,
        rootDir: "./",
        rootDirs: [],

        sourceMap: true,
        strict: true,
        strictNullChecks: true,
        target: "es6",
        typeRoots: ["node_modules/@types"],

        ...isInferno ? {
          jsx: "preserve",
          types: [
            "node",
            "inferno",
          ],
        } : {
          jsx: "react",
        },
        allowSyntheticDefaultImports: true,
        preserveConstEnums: true,

      }, compilerOptions),
      exclude: [
        "node_modules",
      ],
      include: [
        `${context}/**/*`,
      ],
      version,
    };

    if (showConfigForIDE) {
      fs.writeFileSync(resolveTarget(configPath), JSON.stringify(config, null, 2));
    } else {
      fs.unlinkSync(resolveTarget(configPath));
    }

    mkdirp.sync(typescriptTMP);

    fs.writeFileSync(typescriptConfigFilePath, JSON.stringify(config, null, 2));
  }
};
