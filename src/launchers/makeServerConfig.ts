import * as path from "path";
import { proxy } from "../config/target.config";
import { writeFile } from "../lib/fs";

async function makeServerConfig(output: string) {
  await writeFile(path.resolve(output, "config.json"), JSON.stringify({
    proxy: Object.keys(proxy).map((key) => ({
      route: key,
      target: proxy[key],
    })),
  }, null, 2));
}

export default makeServerConfig;
