"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const target_config_1 = require("./target.config");
exports.default = () => {
    const { configPath, showConfigForIDE, config: { compilerOptions, compileOnSave } } = target_config_1.ts.props;
    const { devDependencies: { typescript: version } } = require(path.resolve(__dirname, "../../../package.json"));
    const config = {
        compileOnSave,
        compilerOptions: Object.assign({
            allowJs: false,
            allowSyntheticDefaultImports: true,
            alwaysStrict: true,
            baseUrl: target_config_1.context,
            downlevelIteration: false,
            importHelpers: true,
            isolatedModules: false,
            jsx: "react",
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
            preserveConstEnums: true,
            removeComments: true,
            rootDir: "./",
            rootDirs: [],
            sourceMap: true,
            strict: true,
            strictFunctionTypes: true,
            strictNullChecks: true,
            target: "es6",
            typeRoots: ["node_modules/@types"],
        }, compilerOptions),
        exclude: [
            "node_modules",
        ],
        include: [
            `${target_config_1.context}/**/*`,
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
        fs.writeFileSync(target_config_1.resolveTarget(configPath), JSON.stringify(config, null, 2));
        fs.writeFileSync(target_config_1.resolveTarget("tslint.json"), JSON.stringify(tsLint, null, 2));
    }
    else {
        fs.unlinkSync(target_config_1.resolveTarget(configPath));
        fs.unlinkSync(target_config_1.resolveTarget("tslint.json"));
    }
    mkdirp.sync(target_config_1.ts.tmp);
    fs.writeFileSync(target_config_1.ts.path, JSON.stringify(config, null, 2));
    fs.writeFileSync(target_config_1.ts.lint, JSON.stringify(tsLint, null, 2));
};
//# sourceMappingURL=typescript.config.builder.js.map