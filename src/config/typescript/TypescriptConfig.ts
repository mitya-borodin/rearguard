import * as path from "path";
import { IEnvConfig } from "../../interfaces/IEnvConfig";
import { IRearguardConfig } from "../../interfaces/IRearguardConfig";
import { ITypescriptConfigFile } from "../../interfaces/ITypescriptConfigFile";
import { ConfigFile } from "../ConfigFile";

// tslint:disable:variable-name object-literal-sort-keys

export class TypescriptConfig extends ConfigFile implements ITypescriptConfigFile {
  private envConfig: IEnvConfig;
  private rearguardConfig: IRearguardConfig;

  constructor(envConfig: IEnvConfig, rearguardConfig: IRearguardConfig) {
    super("tsconfig.json");

    this.envConfig = envConfig;
    this.rearguardConfig = rearguardConfig;
  }

  protected get default_config(): { [key: string]: any } {
    const { isDebug } = this.envConfig;
    const { context } = this.rearguardConfig;

    return {
      compileOnSave: false,
      compilerOptions: {
        /* Base options */
        baseUrl: path.resolve(process.cwd(), context),
        forceConsistentCasingInFileNames: true,
        target: "es6",
        jsx: "react",
        lib: ["dom", "es6", "DOM.Iterable", "ScriptHost", "es7"],
        module: "es6",
        moduleResolution: "node",
        importHelpers: true,
        noErrorTruncation: true,

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
        strictPropertyInitialization: false,

        /* Experimental Options */
        experimentalDecorators: true,
        emitDecoratorMetadata: true,

        /* Debug Options */
        diagnostics: isDebug, // Show diagnostic information.
        extendedDiagnostics: isDebug, // Show verbose diagnostic information.
        traceResolution: isDebug, // Enable tracing of the name resolution process.
      },
    };
  }
}

// tslint:enable:variable-name
