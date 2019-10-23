import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";
import * as execa from "execa";
import { Flags } from "../../cli/common/Flags";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { BIN_DIR_NAME, TESTS_DIR_NAME } from "../../const";
import chalk from "chalk";

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

  if (extensions.length > 1) {
    return `{${extensions.join(",")}}`;
  }

  return extensions[0];
};

// TODO Add logging.
export async function lint_executor({ fix }: Flags = defaultFlags): Promise<void> {
  const CWD: string = process.cwd();

  // * Create rearguard configs;
  const rearguardConfig = new RearguardConfig(CWD);

  // * Prepare data;
  const bin = path.resolve(CWD, BIN_DIR_NAME);
  const src = path.resolve(CWD, rearguardConfig.getContext());
  const tests = path.resolve(CWD, TESTS_DIR_NAME);
  const __tests__ = path.resolve(CWD, `__${TESTS_DIR_NAME}__`);

  const hasBin = fs.existsSync(bin);
  const hasSrc = fs.existsSync(src);
  const hasTests = fs.existsSync(tests);
  const has__Tests__ = fs.existsSync(__tests__);

  let binPattern = "";
  let srcPattern = "";
  let testsPattern = "";
  let __tests__Pattern = "";

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

  if (has__Tests__) {
    const hasTS = await checkGlobPattern(`__${TESTS_DIR_NAME}__/**/*.ts`);
    const hasTSX = await checkGlobPattern(`__${TESTS_DIR_NAME}__/**/*.tsx`);

    __tests__Pattern = getExtensions(hasTS, hasTSX);
  }

  const args: string[] = [];

  if (fix) {
    args.push("--fix");
  }

  if (binPattern !== "") {
    args.push(`bin/**/*.${binPattern}`);
  }

  if (srcPattern !== "") {
    args.push(`src/**/*.${srcPattern}`);
  }

  if (testsPattern !== "") {
    args.push(`tests/**/*.${testsPattern}`);
  }

  if (__tests__Pattern !== "") {
    args.push(`__${TESTS_DIR_NAME}__/**/*.${testsPattern}`);
  }

  // ! Run.
  try {
    await execa("eslint", args, { stdout: "inherit", stderr: "inherit" });
  } catch (error) {
    console.log(chalk.bold.magenta(`CWD: ${process.cwd()}`));
    console.log("");

    console.log(chalk.bold.magenta(error.message));
    console.log("");

    process.exit(1);
  }
}
