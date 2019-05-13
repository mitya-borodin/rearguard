import * as path from "path";
import { TEST_TS_CONFIG_FILE_NAME, TESTS_DIR_NAME } from "../../const";
import { get_context } from "../../helpers";
import { IEnvConfig } from "../../interfaces/config/IEnvConfig";
import { ITypescriptConfigFile } from "../../interfaces/config/ITypescriptConfigFile";
import { TypescriptConfig } from "./TypescriptConfig";

// tslint:disable:variable-name object-literal-sort-keys

export class TypescriptTestConfig extends TypescriptConfig implements ITypescriptConfigFile {
  constructor(envConfig: IEnvConfig) {
    super(envConfig, TEST_TS_CONFIG_FILE_NAME);
  }

  protected get default_config(): { [key: string]: any } {
    return {
      compileOnSave: super.default_config.compileOnSave,
      compilerOptions: {
        ...super.default_config.compilerOptions,
        module: "commonjs",
      },
      include: [...super.default_config.include, path.resolve(get_context(), "..", TESTS_DIR_NAME)],
      exclude: [...super.default_config.exclude],
    };
  }
}

// tslint:enable:variable-name
