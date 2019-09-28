import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";
import * as execa from "execa";
import { Flags } from "../../cli/common/Flags";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { BIN_DIR_NAME, TESTS_DIR_NAME } from "../../const";

const defaultFlags: Flags = { fix: false };

const checkGlobPattern = async (pattern: string): Promise<boolean> => {
  return new Promise((resolve, reject): void => {
    glob(pattern, (error, files) => {
      if (error) {
        reject(error);
      } else {
        resolve(files.length > 0);
      }
    });
  });
};

const getExtensions = (hasTS: boolean, hasTSX: boolean): string => {
  const extensions: string[] = [];

  if (hasTS) {
    extensions.push("ts");
  }

  if (hasTSX) {
    extensions.push("tsx");
  }

  return extensions.join(",");
};

export async function lint_executor({ fix }: Flags = defaultFlags): Promise<void> {
  const CWD: string = process.cwd();

  // * Create rearguard configs;
  const rearguardConfig = new RearguardConfig(CWD);

  // * Prepare data;
  const bin = path.resolve(CWD, BIN_DIR_NAME);
  const src = path.resolve(CWD, rearguardConfig.getContext());
  const tests = path.resolve(CWD, TESTS_DIR_NAME);

  const hasBin = fs.existsSync(bin);
  const hasSrc = fs.existsSync(src);
  const hasTests = fs.existsSync(tests);

  let binPattern = "";
  let srcPattern = "";
  let testsPattern = "";

  if (hasBin) {
    const hasTS = await checkGlobPattern(`bin/**/*.ts`);
    const hasTSX = await checkGlobPattern(`bin/**/*.tsx`);

    binPattern = getExtensions(hasTS, hasTSX);
  }

  if (hasSrc) {
    const hasTS = await checkGlobPattern(`src/**/*.ts`);
    const hasTSX = await checkGlobPattern(`src/**/*.tsx`);

    srcPattern = getExtensions(hasTS, hasTSX);
  }

  if (hasTests) {
    const hasTS = await checkGlobPattern(`tests/**/*.ts`);
    const hasTSX = await checkGlobPattern(`tests/**/*.tsx`);

    testsPattern = getExtensions(hasTS, hasTSX);
  }

  const args: string[] = [];

  if (fix) {
    args.push("--fix");
  }

  if (binPattern !== "") {
    args.push(`bin/**/*.{${binPattern}}`);
  }

  if (srcPattern !== "") {
    args.push(`src/**/*.{${srcPattern}}`);
  }

  if (testsPattern !== "") {
    args.push(`tests/**/*.{${testsPattern}}`);
  }

  // ! Run.
  try {
    await execa("eslint", args);
  } catch (error) {
    console.error(error);
  }
}
