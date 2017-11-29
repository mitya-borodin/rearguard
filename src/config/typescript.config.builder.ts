import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as path from "path";
import {context, isInferno, isTS, resolveTarget, tsLintConfigFilePath, typescript, typescriptConfigFilePath, typescriptTMP} from "./target.config";

export default () => {
  if (isTS) {
    const {configPath, showConfigForIDE, config: {compilerOptions, compileOnSave}} = typescript;
    const {devDependencies: {typescript: version}} = require(path.resolve(__dirname, "../../../package.json"));

    const config = {
      compileOnSave,
      compilerOptions: Object.assign(
        {
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
          noFallthroughCasesInSwitch: true,
          noImplicitAny: true,
          noImplicitReturns: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          paths: {},
          removeComments: true,
          rootDir: "./",
          rootDirs: [],
          sourceMap: true,
          strict: true,
          strictFunctionTypes: true,
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
        },
        compilerOptions,
      ),
      exclude: [
        "node_modules",
      ],
      include: [
        `${context}/**/*`,
      ],
      version,
    };

    const tsLint = {
      defaultSeverity: "error",
      extends: [
        "tslint:recommended",
      ],
      jsRules: {},
      rules: {
        "max-classes-per-file": false,
        "member-access": [true, "no-public"],
        "no-console": [
          false,
          "log",
          "error",
        ],
        "no-var-requires": false,
        "variable-name": [
          true,
          "check-format",
          "allow-leading-underscore",
          "allow-trailing-underscore",
          "allow-pascal-case",
          "allow-snake-case",
          "ban-keywords",
        ],
      },
      rulesDirectory: [],
    };

    if (showConfigForIDE) {
      fs.writeFileSync(resolveTarget(configPath), JSON.stringify(config, null, 2));
      fs.writeFileSync(resolveTarget("tslint.json"), JSON.stringify(tsLint, null, 2));
    } else {
      fs.unlinkSync(resolveTarget(configPath));
      fs.unlinkSync(resolveTarget("tslint.json"));
    }

    mkdirp.sync(typescriptTMP);

    fs.writeFileSync(typescriptConfigFilePath, JSON.stringify(config, null, 2));
    fs.writeFileSync(tsLintConfigFilePath, JSON.stringify(tsLint, null, 2));
  }
};
