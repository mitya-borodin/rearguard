import { envConfig } from "../env";
import { rearguardConfig } from "../rearguard";
import { TypescriptConfig } from "./TypescriptConfig";

export const typescriptConfig = new TypescriptConfig(envConfig, rearguardConfig);
