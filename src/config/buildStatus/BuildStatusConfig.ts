import { IBuildStatusConfig } from "../../interfaces/config/IBuildStatusConfig";
import { NonVersionableConfig } from "../NonVersionableConfig";

export class BuildStatusConfig extends NonVersionableConfig implements IBuildStatusConfig {
  get status(): "init" | "in_progress" | "done" {
    const { status } = this.config;

    if (status) {
      return status;
    }

    this.config = { status: "init" };

    return this.status;
  }

  public start(): void {
    this.config = { status: "in_progress" };
  }

  public end(): void {
    this.config = { status: "done" };
  }
}
