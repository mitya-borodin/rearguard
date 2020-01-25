import { RearguardConfig } from "../../configs/RearguardConfig";
import { DependencyMap } from "../../interfaces/configs/PackageJSON";
import execa from "execa";

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

// TODO Add logging.
export const checkDependencies = async (CWD: string = process.cwd()): Promise<void> => {
  // * Create rearguard configs;
  const rearguardConfig = new RearguardConfig(CWD);
  const isBrowser = rearguardConfig.isBrowser();
  const isIsomorphic = rearguardConfig.isIsomorphic();

  if (isBrowser || isIsomorphic) {
    targetDevDepKeys.push("eslint-plugin-react");
    targetDevDepKeys.push("normalize.css");
    targetDevDepKeys.push("stylelint");
    targetDevDepKeys.push("stylelint-config-standard");
    targetDevDepKeys.push("stylelint-config-prettier");
    targetDevDepKeys.push("stylelint-config-css-modules");
  }

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

  // * Prepare execa options.
  const execaOptions: execa.Options = {
    stdout: "inherit",
    stderr: "inherit",
  };

  if (needInstallDeps) {
    // ! Install Dependencies.
    try {
      const curDepList = rearguardConfig.getDependencyList();
      const toInstall = targetDepKeys.filter((name) => !curDepList.includes(name));

      await execa("npm", ["install", "-S", ...toInstall], execaOptions);
    } catch (error) {
      console.error(error);
    }
  }

  if (needInstallDevDeps) {
    // ! Install Dev Dependencies.
    try {
      const curDevDepList = rearguardConfig.getDevDependencyList();
      const toInstall = targetDevDepKeys.filter((name) => !curDevDepList.includes(name));

      await execa("npm", ["install", "-D", ...toInstall], execaOptions);
    } catch (error) {
      console.error(error);
    }
  }

  if (needInstallDeps || needInstallDevDeps) {
    await execa("npx", ["typesync"], execaOptions);
  }

  await rearguardConfig.reformat();
};
