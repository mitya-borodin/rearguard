import { Moment } from "moment";
import { IConfig } from "./IConfig";

export interface IBuildStatusConfig extends IConfig {
  hash_dev: string | void;
  hash_prod: string | void;
  last_build_time: Moment;
  has_last_build_time: boolean;
  status: "init" | "in_progress" | "done";

  start(): void;
  end(): void;
}
