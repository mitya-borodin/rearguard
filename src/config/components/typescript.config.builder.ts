import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import {
  context,
  isDebug,
  resolveTarget,
  ts,
  tsConfigPath,
  tsLintConfigPath,
} from "./target.config";

export default () => {
  const { compilerOptions, compileOnSave } = ts;
  const {
    devDependencies: { typescript: version },
  } = require(path.resolve(__dirname, "../../../../package.json"));
  const pathKeys = Object.keys(compilerOptions.paths);
  const paths: { [key: string]: string[] } = {};

  for (const pathKey of pathKeys) {
    paths[pathKey] = compilerOptions.paths[pathKey].map((P: string) =>
      resolveTarget(P),
    );
  }

  const config = {
    compileOnSave,
    /* tslint:disable */
    compilerOptions: Object.assign(
      {
        /* Basic Options */
        allowJs: false /* Allow javascript files to be compiled. */,
        checkJs: false /* Report errors in .js files. */,
        target:
          "es6" /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'. */,
        module:
          "es6" /* Specify module code generation: 'commonjs', 'amd', 'system', 'umd' or 'es2015'. */,
        pretty: true, // Stylize errors and messages using color and context.
        lib: [
          "es6",
          "es7",
          "dom",
        ] /* Specify library files to be included in the compilation:  */,
        jsx:
          "react" /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */,
        declaration: false /* Generates corresponding '.d.ts' file. */,
        importHelpers: true /* Import emit helpers from 'tslib'. */,
        downlevelIteration: false /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */,
        isolatedModules: false /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */,
        allowSyntheticDefaultImports: true /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */,
        removeComments: true /* Do not emit comments to output. */,
        preserveConstEnums: true,
        /* Emit Options */
        noEmit: false /* Do not emit outputs. */,
        rootDir:
          "./" /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */,
        // "outDir": "./",                        /* Redirect output structure to the directory. */
        // "outFile": "./",                       /* Concatenate and emit output to single file. */
        charset: "utf8" /* The character set of the input files. */,

        /* Debug Options */
        noErrorTruncation: true, // Do not truncate error messages.
        diagnostics: isDebug,
        sourceMap: isDebug /* Generates corresponding '.map' file. */,

        /* Strict Type-Checking Options */
        strict: true /* Enable all strict type-checking options. */,
        alwaysStrict: true /* Parse in strict mode and emit "use strict" for each source file. */,
        strictNullChecks: true /* Enable strict null checks. */,
        strictFunctionTypes: true /* Disable bivariant parameter checking for function types. */,
        strictPropertyInitialization: true /* Ensure non-undefined class properties are initialized in the constructor. */,

        /* Additional Checks */
        noFallthroughCasesInSwitch: true /* Report errors for fallthrough cases in switch statement. */,
        noImplicitAny: true /* Raise error on expressions and declarations with an implied 'any' type. */,
        noImplicitReturns: true /* Report error when not all code paths in function return a value. */,
        noImplicitThis: true /* Raise error on 'this' expressions with an implied 'any' type. */,
        noUnusedLocals: true /* Report errors on unused locals. */,
        noUnusedParameters: true /* Report errors on unused parameters. */,

        /* Module Resolution Options */
        moduleResolution:
          "node" /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */,
        baseUrl: context /* Base directory to resolve non-absolute module names. */,
        rootDirs: [] /* List of root folders whose combined content represents the structure of the project at runtime. */,
        paths: {} /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */,
        typeRoots: [
          "node_modules/@types",
        ] /* List of folders to include type definitions from. */,
        types: [] /* Type declaration files to be included in compilation. */,
        forceConsistentCasingInFileNames: true /* Disallow inconsistently-cased references to the same file. */,

        /* Source Map Options */
        // sourceRoot: context,                   /* Specify the location where debugger should locate TypeScript files instead of source locations. */
        // mapRoot: context,                      /* Specify the location where debugger should locate map files instead of generated locations. */
        // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
        // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

        /* Experimental Options */
        experimentalDecorators: true /* Enables experimental support for ES7 decorators. */,
        // emitDecoratorMetadata: true,  /* Enables experimental support for emitting type metadata for decorators. */
      },
      /* tslint:enable */
      compilerOptions,
      { paths },
    ),
    exclude: ["node_modules", "node_modules/.cache"],
    include: [context],
    version,
  };

  const tsLint = {
    defaultSeverity: "error",
    extends: ["tslint:recommended", "tslint-no-circular-imports"],
    jsRules: {},
    rules: {
      "max-classes-per-file": [false],
      "member-access": true,
      "no-console": false,
      "no-var-requires": false,
      "variable-name": false,
    },
    rulesDirectory: [],
  };

  fs.writeFileSync(tsConfigPath, JSON.stringify(config, null, 2));
  fs.writeFileSync(tsLintConfigPath, JSON.stringify(tsLint, null, 2));
  console.log(
    chalk.bold.cyanBright(`[Build typescript and tslint config]`.toUpperCase()),
  );
  console.log(chalk.cyan(`TSConfig: ${tsConfigPath}`));
  console.log(chalk.cyan(`TSLint: ${tsLintConfigPath}`));
  console.log(``);
};
