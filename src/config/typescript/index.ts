import { envConfig } from "../env";
import { TypescriptConfig } from "./TypescriptConfig";
import { TypescriptTestConfig } from "./TypescriptTestConfig";

export const typescriptConfig = new TypescriptConfig(envConfig);
export const typescriptTestConfig = new TypescriptTestConfig(envConfig);
