import fs from "fs";
import path from "path";
import { promisify } from "util";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { VS_CODE_SETTINGS } from "../../const";
import { getSortedListOfMonoComponents } from "./getSortedListOfDependencies";

const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export const updateVSCodeSettingsForMonoRepo = async (CWD: string): Promise<void> => {
  const rearguardConfig = new RearguardConfig(CWD);
  const components = rearguardConfig.getComponents();
  const sortedListOfMonoComponents = await getSortedListOfMonoComponents(CWD, components);
  const workDirectories: string[] = [];

  for (const pathToComponent of sortedListOfMonoComponents) {
    workDirectories.push(`./${path.relative(CWD, pathToComponent)}`);
  }

  const vsCodeSettingsPath = path.resolve(CWD, VS_CODE_SETTINGS);

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
};
