import { isString } from "@rtcts/utils";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { VS_CODE_SETTINGS } from "../../const";
import { getSortedListOfMonoComponents } from "./getSortedListOfDependencies";
import { vsCodeSettingsTemplate, vsCodeExtensionsTemplate } from "../../templates/vsCode";

const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export const getMonorepoWorkDirectory = async (CWD: string): Promise<string | void> => {
  if (CWD === "/") {
    return;
  }

  if (!(await exists(path.resolve(CWD, "package.json")))) {
    return getMonorepoWorkDirectory(path.resolve(CWD, ".."));
  }

  const rearguardConfig = new RearguardConfig(CWD);

  if (rearguardConfig.isMono()) {
    return CWD;
  } else {
    return getMonorepoWorkDirectory(path.resolve(CWD, ".."));
  }
};

export const updateVSCodeSettingsForMonoRepo = async (CWD: string): Promise<void> => {
  const MWD: string | void = await getMonorepoWorkDirectory(CWD);

  if (isString(MWD)) {
    const rearguardConfig = new RearguardConfig(MWD);
    const components = rearguardConfig.getComponents();
    const sortedListOfMonoComponents = await getSortedListOfMonoComponents(MWD, components);
    const workDirectories: string[] = [];

    for (const pathToComponent of sortedListOfMonoComponents) {
      workDirectories.push(`./${path.relative(MWD, pathToComponent)}`);
    }

    const vsCodeSettingsPath = path.resolve(MWD, VS_CODE_SETTINGS);

    if (await exists(vsCodeSettingsPath)) {
      const vsCodeSettings = JSON.parse(await readFile(vsCodeSettingsPath, { encoding: "utf-8" }));

      vsCodeSettings["eslint.workingDirectories"] = workDirectories.map((workDirectory) => ({
        directory: workDirectory,
        changeProcessCWD: true,
      }));

      await writeFile(vsCodeSettingsPath, JSON.stringify(vsCodeSettings, null, 2), {
        encoding: "utf-8",
      });
    }
  } else if (await exists(path.resolve(CWD, "package.json"))) {
    const vsCodeSettingsPath = path.resolve(CWD, VS_CODE_SETTINGS);

    if (!(await exists(vsCodeSettingsPath))) {
      await vsCodeSettingsTemplate.render();
      await vsCodeExtensionsTemplate.render();
    }

    const vsCodeSettings = JSON.parse(await readFile(vsCodeSettingsPath, { encoding: "utf-8" }));

    vsCodeSettings["eslint.alwaysShowStatus"] = true;
    vsCodeSettings["eslint.enable"] = true;
    vsCodeSettings["eslint.packageManager"] = "npm";
    vsCodeSettings["eslint.workingDirectories"] = ["."];

    await writeFile(vsCodeSettingsPath, JSON.stringify(vsCodeSettings, null, 2), {
      encoding: "utf-8",
    });
  }
};
