import { RearguardConfig } from "../../configs/RearguardConfig";

const listOfDeps: string[] = ["tslib"];
const listOfDevDeps: string[] = [
  "typescript",
  "prettier",
  "pretty-quick",
  "husky",
  "eslint",
  "eslint-config-prettier",
  "@typescript-eslint/parser",
  "@typescript-eslint/eslint-plugin",
];

export const checkDependencies = async (CWD: string = process.cwd()): Promise<void> => {
  // * Create rearguard configs;
  const rearguardConfig = new RearguardConfig(CWD);

  // * Prepare data;
  const deps = rearguardConfig.getDependencies();
  const devDeps = rearguardConfig.getDevDependencies();
};
