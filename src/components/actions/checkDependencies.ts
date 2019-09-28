import { RearguardConfig } from "../../configs/RearguardConfig";
import { DependencyMap } from "../../interfaces/configs/PackageJSON";
import * as execa from "execa";

const targetDepKeys: string[] = ["tslib"];
const targetDevDepKeys: string[] = [
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
  const depMap = rearguardConfig.getDependencies();
  const depKeys = Object.keys(depMap);

  const devDepMap = rearguardConfig.getDevDependencies();
  const devDepKeys = Object.keys(devDepMap);

  const targetDepMap: DependencyMap = {};
  const targetDevDepMap: DependencyMap = {};

  for (const depKey of depKeys) {
    if (!targetDevDepKeys.includes(depKey)) {
      targetDepMap[depKey] = depMap[depKey];
    }
  }

  for (const devDepKey of devDepKeys) {
    if (!targetDepKeys.includes(devDepKey)) {
      targetDevDepMap[devDepKey] = devDepMap[devDepKey];
    }
  }

  // ! Set Dependencies.
  rearguardConfig.setDependencies(targetDepMap);
  rearguardConfig.setDevDependencies(targetDevDepMap);

  // ? Verify Installation Needs
  const needInstallDeps = targetDepKeys.some((name) => !depKeys.includes(name));
  const needInstallDevDeps = targetDevDepKeys.some((name) => !devDepKeys.includes(name));

  if (needInstallDeps) {
    // ! Install Dependencies.
    try {
      await execa("npm", ["install", "-S", ...targetDepKeys]);
    } catch (error) {
      console.error(error);
    }
  }

  if (needInstallDevDeps) {
    // ! Install Dev Dependencies.
    try {
      await execa("npm", ["install", "-D", ...targetDevDepKeys]);
    } catch (error) {
      console.error(error);
    }
  }
};
