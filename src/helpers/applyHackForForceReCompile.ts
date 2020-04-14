import fs from "fs";
import { promisify } from "util";

const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export const applyHackForForceReCompile = async (entryPath): Promise<void> => {
  if (await exists(entryPath)) {
    let content = await readFile(entryPath, { encoding: "utf-8" });

    const title = "// HACK for forcing invalidation of the ts-node-dev compiler, timestamp:";
    const start = content.indexOf(title);

    if (start !== -1) {
      content = content.substring(0, start);
    } else {
      content += `\r`;
    }

    content += `${title} ${Date.now()}`;

    await writeFile(entryPath, content);
  }
};
