import { isString } from "@rtcts/utils";
import fs from "fs";
import path from "path";
import prettier from "prettier";
import { promisify } from "util";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { PRETTIER_JSON, VS_CODE_SETTINGS } from "../../const";
import { mkdir } from "../../helpers/mkdir";
import { vsCodeExtensionsTemplate, vsCodeSettingsTemplate } from "../../templates/vsCode";
import { getSortedListOfMonoComponents } from "./getSortedListOfDependencies";

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

  if (isString(MWD) && (await exists(path.resolve(MWD, "package.json")))) {
    const rearguardConfig = new RearguardConfig(MWD);
    const components = rearguardConfig.getComponents();
    const sortedListOfMonoComponents = await getSortedListOfMonoComponents(MWD, components);
    const workDirectories: string[] = [];

    for (const pathToComponent of sortedListOfMonoComponents) {
      workDirectories.push(`./${path.relative(MWD, pathToComponent)}`);
    }

    mkdir(path.resolve(MWD, ".vscode"));

    const vsCodeSettingsPath = path.resolve(MWD, VS_CODE_SETTINGS);

    if (await exists(vsCodeSettingsPath)) {
      const vsCodeSettings = JSON.parse(await readFile(vsCodeSettingsPath, { encoding: "utf-8" }));

      vsCodeSettings["eslint.workingDirectories"] = workDirectories.map((workDirectory) => ({
        directory: workDirectory,
        changeProcessCWD: true,
      }));

      await writeFile(
        vsCodeSettingsPath,
        prettier.format(JSON.stringify(vsCodeSettings), PRETTIER_JSON),
        {
          encoding: "utf-8",
        },
      );
    }
  }

  if (MWD !== CWD && (await exists(path.resolve(CWD, "package.json")))) {
    const vsCodeSettingsPath = path.resolve(CWD, VS_CODE_SETTINGS);

    mkdir(path.resolve(CWD, ".vscode"));

    if (!(await exists(vsCodeSettingsPath))) {
      await vsCodeSettingsTemplate.render({ forceRender: true });
      await vsCodeExtensionsTemplate.render({ forceRender: true });
    }

    const vsCodeSettings = JSON.parse(await readFile(vsCodeSettingsPath, { encoding: "utf-8" }));

    vsCodeSettings["eslint.alwaysShowStatus"] = true;
    vsCodeSettings["eslint.enable"] = true;
    vsCodeSettings["eslint.packageManager"] = "npm";
    vsCodeSettings["eslint.workingDirectories"] = ["."];

    await writeFile(
      vsCodeSettingsPath,
      prettier.format(JSON.stringify(vsCodeSettings), PRETTIER_JSON),
      {
        encoding: "utf-8",
      },
    );
  }
};
