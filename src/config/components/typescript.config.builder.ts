import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import {context, isDebug, ts, tsConfigPath, tsLintConfigPath} from "./target.config";

export default () => {
  const {compilerOptions, compileOnSave} = ts;
  const {devDependencies: {typescript: version}} = require(path.resolve(__dirname, "../../../../package.json"));

  const config = {
    compileOnSave,
    /* tslint:disable */
    compilerOptions: Object.assign(
      {
        /* Basic Options */
        preserveConstEnums: true,

        target: "es6", /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'. */
        module: "es6", /* Specify module code generation: 'commonjs', 'amd', 'system', 'umd' or 'es2015'. */
        lib: ["es6", "es7", "dom"], /* Specify library files to be included in the compilation:  */
        allowJs: false, /* Allow javascript files to be compiled. */
        checkJs: false, /* Report errors in .js files. */
        jsx: "react", /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
        declaration: false, /* Generates corresponding '.d.ts' file. */
        sourceMap: isDebug, /* Generates corresponding '.map' file. */
        // "outFile": "./",                       /* Concatenate and emit output to single file. */
        // "outDir": "./",                        /* Redirect output structure to the directory. */
        rootDir: "./", /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
        removeComments: true, /* Do not emit comments to output. */
        noEmit: false, /* Do not emit outputs. */
        importHelpers: true, /* Import emit helpers from 'tslib'. */
        downlevelIteration: false, /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
        isolatedModules: false, /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */

        /* Strict Type-Checking Options */
        strict: true, /* Enable all strict type-checking options. */
        noImplicitAny: true, /* Raise error on expressions and declarations with an implied 'any' type. */
        strictNullChecks: true, /* Enable strict null checks. */
        noImplicitThis: true, /* Raise error on 'this' expressions with an implied 'any' type. */
        alwaysStrict: true, /* Parse in strict mode and emit "use strict" for each source file. */
        strictFunctionTypes: true,

        /* Additional Checks */
        noUnusedLocals: true, /* Report errors on unused locals. */
        noUnusedParameters: true, /* Report errors on unused parameters. */
        noImplicitReturns: true, /* Report error when not all code paths in function return a value. */
        noFallthroughCasesInSwitch: true, /* Report errors for fallthrough cases in switch statement. */

        /* Module Resolution Options */
        moduleResolution: "node", /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
        baseUrl: context, /* Base directory to resolve non-absolute module names. */
        paths: {}, /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
        rootDirs: [], /* List of root folders whose combined content represents the structure of the project at runtime. */
        typeRoots: ["node_modules/@types"], /* List of folders to include type definitions from. */
        types: [], /* Type declaration files to be included in compilation. */
        allowSyntheticDefaultImports: true, /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */

        /* Source Map Options */
        // sourceRoot: context,                   /* Specify the location where debugger should locate TypeScript files instead of source locations. */
        // mapRoot: context,                      /* Specify the location where debugger should locate map files instead of generated locations. */
        // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
        // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

        /* Experimental Options */
        experimentalDecorators: true, /* Enables experimental support for ES7 decorators. */
        // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */
      },
      /* tslint:enable */
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

  fs.writeFileSync(tsConfigPath, JSON.stringify(config, null, 2));
  fs.writeFileSync(tsLintConfigPath, JSON.stringify(tsLint, null, 2));
  console.log(chalk.bold.cyanBright(`[Build typescript and tslint config]`.toUpperCase()));
  console.log(chalk.cyan(`TSConfig: ${tsConfigPath}`));
  console.log(chalk.cyan(`TSLint: ${tsLintConfigPath}`));
  console.log(``);
};
