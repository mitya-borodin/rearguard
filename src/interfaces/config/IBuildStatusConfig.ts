import { IConfig } from "./IConfig";

export interface IBuildStatusConfig extends IConfig {
  status: "init" | "in_progress" | "done";

  start(): void;
  end(): void;
}
