import * as path from "path";
import { DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME, LIB_DIR_NAME } from "../../const";
import { get_context } from "../../helpers";
import { IEnvConfig } from "../../interfaces/config/IEnvConfig";
import { ITypescriptConfigFile } from "../../interfaces/config/ITypescriptConfigFile";
import { ConfigFile } from "../ConfigFile";
import { rearguardConfig } from "../rearguard";

// tslint:disable:variable-name object-literal-sort-keys

export class TypescriptConfig extends ConfigFile implements ITypescriptConfigFile {
  private envConfig: IEnvConfig;

  constructor(envConfig: IEnvConfig) {
    super("tsconfig.json");

    this.envConfig = envConfig;
  }

  protected get default_config(): { [key: string]: any } {
    const { isDebug } = this.envConfig;

    return {
      compileOnSave: false,
      compilerOptions: {
        /* Base options */
        baseUrl: get_context(),
        allowSyntheticDefaultImports: true,
        forceConsistentCasingInFileNames: true,
        target: "es6",
        jsx: "react",
        lib: ["dom", "es6", "DOM.Iterable", "ScriptHost", "es7"],
        module: this.envConfig.isSync || this.envConfig.isBNS ? "commonjs" : "es6",
        moduleResolution: "node",
        importHelpers: true,
        noErrorTruncation: true,
        ...(!rearguardConfig.has_node_lib && !rearguardConfig.is_application && rearguardConfig.has_browser_lib
          ? {
              declaration: true,
              outDir: path.resolve(process.cwd(), LIB_DIR_NAME),
            }
          : {}),

        /* Strict Type-Checking Options */
        strict: true /*
          Enable all strict type checking options.
          Enabling --strict enables
          --noImplicitAny,
          --noImplicitThis,
          --alwaysStrict,
          --strictNullChecks,
          --strictFunctionTypes
          --strictPropertyInitialization.
           */,
        noImplicitReturns: true /* Report error when not all code paths in function return a value. */,
        noImplicitAny: false /** Raise error on expressions and declarations with an implied any type. */,
        strictPropertyInitialization: false,

        /* Experimental Options */
        experimentalDecorators: true,
        emitDecoratorMetadata: true,

        /* Debug Options */
        diagnostics: isDebug, // Show diagnostic information.
        extendedDiagnostics: isDebug, // Show verbose diagnostic information.
        traceResolution: isDebug, // Enable tracing of the name resolution process.
        skipLibCheck: true,
      },
      include:[get_context()],
      exclude: [
        "node_modules",
        ...((this.envConfig.isWDS || this.envConfig.isBuild) && !(this.envConfig.isSync || this.envConfig.isBNS)
          ? [
              path.resolve(process.cwd(), DLL_BUNDLE_DIR_NAME),
              path.resolve(process.cwd(), LIB_BUNDLE_DIR_NAME),
              path.resolve(process.cwd(), LIB_DIR_NAME),
            ]
          : []),
      ],
      ...(this.envConfig.isSync || this.envConfig.isBNS
        ? { include: [path.resolve(process.cwd(), "bin"), path.resolve(process.cwd(), "src")] }
        : {}),
    };
  }
}

// tslint:enable:variable-name
