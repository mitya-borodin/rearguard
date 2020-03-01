import chalk from "chalk";
import copy from "copy";
import path from "path";
import File from "vinyl";
import {
  DISTRIBUTIVE_DIR_NAME,
  DLL_BUNDLE_DIR_NAME,
  LIB_BUNDLE_DIR_NAME,
  PUBLIC_DIR_NAME,
} from "../../const";
import { getPublicDirPath } from "../../helpers/bundleNaming";

export const copyBundlesAndPublicToDist = async (
  CWD: string,
  copyToSamePath = false,
): Promise<void> => {
  const distDirPath = path.resolve(CWD, DISTRIBUTIVE_DIR_NAME);

  await new Promise((resolve, reject): void => {
    copy(
      [`${path.resolve(CWD, DLL_BUNDLE_DIR_NAME)}/**`],
      copyToSamePath ? `${distDirPath}/${DLL_BUNDLE_DIR_NAME}` : distDirPath,
      (error: Error | null, files?: File[]) => {
        if (!error) {
          if (files) {
            console.log(
              chalk.cyan(`[ COPY ][ DLL ][ BUNDLE ][ FILES ${files.length} ][ TO_DIST ]`),
            );
          }

          resolve();
        } else {
          reject(error);
        }
      },
    );
  });

  await new Promise((resolve, reject): void => {
    copy(
      [`${path.resolve(CWD, LIB_BUNDLE_DIR_NAME)}/**`],
      copyToSamePath ? `${distDirPath}/${LIB_BUNDLE_DIR_NAME}` : distDirPath,
      (error: Error | null, files?: File[]) => {
        if (!error) {
          if (files) {
            console.log(
              chalk.cyan(`[ COPY ][ LIB ][ BUNDLE ][ FILES ${files.length} ][ TO_DIST ]`),
            );
          }

          resolve();
        } else {
          reject(error);
        }
      },
    );
  });

  await new Promise((resolve, reject): void => {
    copy(
      [`${getPublicDirPath(CWD)}/**`, `!${getPublicDirPath(CWD)}/index.html`],
      copyToSamePath ? `${distDirPath}/${PUBLIC_DIR_NAME}` : distDirPath,
      (error: Error | null, files?: File[]) => {
        if (!error) {
          if (files) {
            console.log(chalk.cyan(`[ COPY ][ PUBLIC ][ FILES ${files.length} ][ TO_DIST ]`));
          }

          resolve();
        } else {
          reject(error);
        }
      },
    );
  });

  console.log("");
};
