import fs from "fs";
import { merge } from "lodash";
import { Moment } from "moment";
import path from "path";
import prettier from "prettier";
import { PRETTIER_JSON, REARGUARD_DEV_CONFIG_FILE_NAME } from "../const";
import { mkdir } from "../helpers/mkdir";
import { RearguardDev } from "./RearguardDev";
import moment from "moment";

export class RearguardDevConfig {
  private file_path: string;

  constructor(
    CWD: string = process.cwd(),
    file_path = path.resolve(CWD, REARGUARD_DEV_CONFIG_FILE_NAME),
  ) {
    this.file_path = file_path;
  }

  public async hasLastBuildTime(): Promise<boolean> {
    const { build } = await this.getConfig();

    return build.has_last_build_time;
  }

  public async getLastBuildTime(): Promise<Moment> {
    const { build } = await this.getConfig();

    return build.last_build_time;
  }

  public async getWDSConfig(): Promise<{
    host: string;
    port: number;
    proxy: { [key: string]: any };
  }> {
    const config = await this.getConfig();

    return config.webpack_dev_server;
  }

  public async getStatus(): Promise<string> {
    const config = await this.getConfig();

    return config.build.status;
  }

  public async setBuildStatus(status: "init" | "in_progress" | "done"): Promise<void> {
    const config = await this.getConfig();

    await this.setConfig(merge(config, { build: { status } }));
  }

  public async setLastBuildTime(): Promise<void> {
    const config = await this.getConfig();

    await this.setConfig(merge(config, { build: { last_build_time: moment() } }));
  }

  public async getConfig(): Promise<Readonly<RearguardDev>> {
    if (fs.existsSync(this.file_path)) {
      const content_of_rc_file = fs.readFileSync(this.file_path, { encoding: "utf-8" });

      try {
        return new RearguardDev(JSON.parse(content_of_rc_file));
      } catch (error) {
        console.error(error);

        process.exit(1);
      }
    } else {
      return await this.setConfig(new RearguardDev());
    }

    return new RearguardDev({});
  }

  public async setConfig(config: Readonly<RearguardDev>): Promise<Readonly<RearguardDev>> {
    const newConfig: Readonly<RearguardDev> = new RearguardDev(config);

    try {
      const content = prettier.format(JSON.stringify(newConfig), PRETTIER_JSON);

      mkdir(path.dirname(this.file_path));

      fs.writeFileSync(this.file_path, content, { encoding: "utf-8" });
    } catch (error) {
      console.error(error);

      process.exit(1);
    }

    return newConfig;
  }
}
