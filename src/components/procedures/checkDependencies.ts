import execa from "execa";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { DependencyMap } from "../../interfaces/configs/PackageJSON";

const targetDepKeys: Set<string> = new Set(["tslib"]);
const targetDevDepKeys: Set<string> = new Set([
  "typescript",
  "prettier",
  "pretty-quick",
  "husky",
  "eslint",
  "eslint-config-prettier",
  "@typescript-eslint/parser",
  "@typescript-eslint/eslint-plugin",
  "eslint-plugin-jest",
  "eslint-plugin-import",
]);

// TODO Add logging.
export const checkDependencies = async (
  CWD: string = process.cwd(),
  force = false,
): Promise<void> => {
  // * Create rearguard configs;
  const rearguardConfig = new RearguardConfig(CWD);
  const isBrowser = rearguardConfig.isBrowser();
  const isDll = rearguardConfig.isDll();
  const isIsomorphic = rearguardConfig.isIsomorphic();
  const isNode = rearguardConfig.isNode();

  if (isBrowser && isDll) {
    targetDepKeys.delete("tslib");
    targetDevDepKeys.delete("eslint");
    targetDevDepKeys.delete("eslint-config-prettier");
    targetDevDepKeys.delete("@typescript-eslint/parser");
    targetDevDepKeys.delete("@typescript-eslint/eslint-plugin");
    targetDevDepKeys.delete("eslint-plugin-jest");
    targetDevDepKeys.delete("eslint-plugin-import");
    targetDevDepKeys.delete("husky");
    targetDevDepKeys.delete("pretty-quick");
    targetDevDepKeys.delete("prettier");
  }

  if ((isBrowser || isIsomorphic) && !isDll) {
    targetDevDepKeys.add("eslint-plugin-react");
    targetDevDepKeys.add("eslint-plugin-react-hooks");
    targetDevDepKeys.add("normalize.css");
    targetDevDepKeys.add("stylelint");
    targetDevDepKeys.add("stylelint-config-standard");
    targetDevDepKeys.add("stylelint-config-prettier");
    targetDevDepKeys.add("stylelint-config-css-modules");
  }

  if (isNode) {
    targetDepKeys.add("eslint-plugin-node");
  }

  // * Prepare data;
  const depMap = rearguardConfig.getDependencies();
  let depKeys = Object.keys(depMap);

  const devDepMap = rearguardConfig.getDevDependencies();
  let devDepKeys = Object.keys(devDepMap);

  if (force) {
    depKeys = depKeys.filter((key) => !targetDepKeys.has(key));
    devDepKeys = devDepKeys.filter((key) => !targetDevDepKeys.has(key));
  }

  const targetDepMap: DependencyMap = {};
  const targetDevDepMap: DependencyMap = {};

  for (const depKey of depKeys) {
    if (!targetDevDepKeys.has(depKey)) {
      targetDepMap[depKey] = depMap[depKey];
    }
  }

  for (const devDepKey of devDepKeys) {
    if (!targetDepKeys.has(devDepKey)) {
      targetDevDepMap[devDepKey] = devDepMap[devDepKey];
    }
  }

  // ! Set Dependencies.
  rearguardConfig.setDependencies(targetDepMap);
  rearguardConfig.setDevDependencies(targetDevDepMap);

  // ? Verify Installation Needs
  const needInstallDeps = Array.from(targetDepKeys).some((name) => !depKeys.includes(name));
  const needInstallDevDeps = Array.from(targetDevDepKeys).some(
    (name) => !devDepKeys.includes(name),
  );

  // * Prepare execa options.
  const execaOptions: execa.Options = {
    stdout: "inherit",
    stderr: "inherit",
  };

  if (needInstallDeps) {
    // ! Install Dependencies.
    try {
      const curDepList = rearguardConfig.getDependencyList();
      const toInstall = Array.from(targetDepKeys).filter((name) => !curDepList.includes(name));

      await execa("npm", ["install", "-S", "-E", ...toInstall], execaOptions);
    } catch (error) {
      console.error(error);
    }
  }

  if (needInstallDevDeps) {
    // ! Install Dev Dependencies.
    try {
      const curDevDepList = rearguardConfig.getDevDependencyList();
      const toInstall = Array.from(targetDevDepKeys).filter(
        (name) => !curDevDepList.includes(name),
      );

      await execa("npm", ["install", "-D", "-E", ...toInstall], execaOptions);
    } catch (error) {
      console.error(error);
    }
  }

  if (needInstallDeps || needInstallDevDeps) {
    await execa("npx", ["typesync"], execaOptions);
  }

  await rearguardConfig.reformat();
};
