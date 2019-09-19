import { isArray, isBoolean, isString } from "@borodindmitriy/utils";

export class Typescript {
  public readonly compileOnSave: boolean;

  public readonly compilerOptions: {
    /* Basic Options */
    target: string;
    module: string;
    lib: string[];

    allowJs: boolean;
    checkJs: boolean;

    jsx: string;

    removeComments: boolean;

    skipLibCheck: boolean;
    forceConsistentCasingInFileNames: boolean;

    /* Strict Type-Checking Options */
    strict: boolean;
    /*
      Enable all strict type checking options.
      Enabling --strict enables
      --noImplicitAny,
      --strictNullChecks,
      --noImplicitThis,
      --alwaysStrict,
      --strictFunctionTypes
      --strictPropertyInitialization.
    */
    noImplicitAny: boolean;
    strictNullChecks: boolean;
    noImplicitThis: boolean;
    alwaysStrict: boolean;
    strictFunctionTypes: boolean;
    strictPropertyInitialization: boolean;
    suppressImplicitAnyIndexErrors: boolean;
    suppressExcessPropertyErrors: boolean;

    /* Additional Checks */
    noUnusedLocals: boolean;
    noUnusedParameters: boolean;
    noImplicitReturns: boolean;
    noFallthroughCasesInSwitch: boolean;

    /* Module Resolution Options */
    moduleResolution: string;
    baseUrl: string;
    paths?: { [key: string]: any };
    rootDirs?: string[];
    typeRoots?: string[];
    types?: string[];
    allowSyntheticDefaultImports: boolean;
    importHelpers: boolean;

    /* Source Map Options */
    sourceMap: boolean;
    sourceRoot?: string;
    mapRoot?: string;
    inlineSourceMap: boolean;
    inlineSources: boolean;

    /* Debug Options */
    diagnostics: boolean;
    extendedDiagnostics: boolean;
    traceResolution: boolean;
    noErrorTruncation: boolean;
    pretty: boolean;

    /* Experimental Options */
    experimentalDecorators: boolean;
    emitDecoratorMetadata: boolean;
  };

  public readonly include: string[];
  public readonly exclude: string[];

  constructor(data?: any) {
    this.compileOnSave = false;

    this.compilerOptions = {
      /* Basic Options */
      target: "es6",
      module: "commonjs",
      lib: ["es6", "es7", "dom", "DOM.Iterable", "ScriptHost"],
      allowJs: false,
      checkJs: false,
      jsx: "react",
      removeComments: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,

      /* Strict Type-Checking Options */
      strict: true,
      noImplicitAny: true,
      strictNullChecks: true,
      noImplicitThis: true,
      alwaysStrict: true,
      strictFunctionTypes: true,
      strictPropertyInitialization: true,
      suppressImplicitAnyIndexErrors: true,
      suppressExcessPropertyErrors: true,

      /* Additional Checks */
      noUnusedLocals: true,
      noUnusedParameters: false,
      noImplicitReturns: false,
      noFallthroughCasesInSwitch: true,

      /* Module Resolution Options */
      moduleResolution: "node",
      baseUrl: "src",
      allowSyntheticDefaultImports: true,
      importHelpers: true,

      /* Source Map Options */
      sourceMap: false,
      inlineSourceMap: false,
      inlineSources: false,

      /* Debug Options */
      diagnostics: false,
      extendedDiagnostics: false,
      traceResolution: false,
      noErrorTruncation: true,
      pretty: true,

      /* Experimental Options */
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
    };

    this.include = [];
    this.exclude = [];

    if (data) {
      if (isBoolean(data.compileOnSave)) {
        this.compileOnSave = data.compileOnSave;
      }

      if (isArray(data.include)) {
        this.include = data.include.filter(isString);
      }

      if (isArray(data.exclude)) {
        this.exclude = data.exclude.filter(isString);
      }

      if (data.compilerOptions) {
        for (const item of ["lib", "rootDirs", "typeRoots", "types"]) {
          if (isArray(data.compilerOptions[item])) {
            this.compilerOptions[item] = data.compilerOptions[item].filter(isString);
          }
        }

        for (const item of ["target", "module", "jsx", "moduleResolution", "baseUrl", "sourceRoot", "mapRoot"]) {
          if (isString(data.compilerOptions[item])) {
            this.compilerOptions[item] = data.compilerOptions[item];
          }
        }

        for (const item of [
          "allowJs",
          "checkJs",
          "removeComments",
          "skipLibCheck",
          "forceConsistentCasingInFileNames",
          "strict",
          "noImplicitAny",
          "strictNullChecks",
          "noImplicitThis",
          "alwaysStrict",
          "strictFunctionTypes",
          "strictPropertyInitialization",
          "suppressImplicitAnyIndexErrors",
          "suppressExcessPropertyErrors",
          "noUnusedLocals",
          "noUnusedParameters",
          "noImplicitReturns",
          "noFallthroughCasesInSwitch",
          "allowSyntheticDefaultImports",
          "importHelpers",
          "sourceMap",
          "inlineSourceMap",
          "inlineSources",
          "diagnostics",
          "extendedDiagnostics",
          "traceResolution",
          "noErrorTruncation",
          "pretty",
          "experimentalDecorators",
          "emitDecoratorMetadata",
        ]) {
          if (isBoolean(data.compilerOptions[item])) {
            this.compilerOptions[item] = data.compilerOptions[item];
          }
        }
      }
    }
  }
}