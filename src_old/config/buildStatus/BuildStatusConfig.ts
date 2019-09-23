import { isDate, isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import { Moment } from "moment";
import * as moment from "moment";
import { IBuildStatusConfig } from "../../interfaces/config/IBuildStatusConfig";
import { NonVersionableConfig } from "../NonVersionableConfig";

// tslint:disable: variable-name

export class BuildStatusConfig extends NonVersionableConfig implements IBuildStatusConfig {
  // ! BUILD STATUS
  // ! Текущее состояние сборки.
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

  // ! BUILD_HASH
  // ! Результат хеш функции от результата сборки.
  public get hash_dev(): string | void {
    const { hash_dev } = this.config;

    if (isString(hash_dev)) {
      return hash_dev;
    }
  }

  public set hash_dev(hash_dev: string | void) {
    if (isString(hash_dev)) {
      this.config = { hash_dev };
    }
  }
  public get hash_prod(): string | void {
    const { hash_prod } = this.config;

    if (isString(hash_prod)) {
      return hash_prod;
    }
  }

  public set hash_prod(hash_prod: string | void) {
    if (isString(hash_prod)) {
      this.config = { hash_prod };
    }
  }

  // ! LAST_BUILD_TIME
  // ! Время последней сборки.
  public get last_build_time(): Moment {
    const { last_build_time } = this.config;

    if (isDate(last_build_time)) {
      return moment(new Date(last_build_time)).utc();
    }

    console.log(
      chalk.bold.yellow(`[ BUILD_STATUS_CONFIG ][ WARNING ][ last_build_time ][ must be a Date ]`),
    );

    const def_last_build_time = moment().utc();

    this.config = { last_build_time: def_last_build_time.toDate() };

    console.log(
      chalk.bold.green(
        `[ BUILD_STATUS_CONFIG ][ INIT ][ last_build_time ]` +
          `[ assign to ${def_last_build_time.format("YYYY-MM-DD HH:mm ZZ")} ]`,
      ),
    );
    console.log("");

    return this.last_build_time;
  }

  public set last_build_time(last_build_time: Moment) {
    this.config = { last_build_time: last_build_time.utc().toISOString() };
  }

  public get has_last_build_time(): boolean {
    const { last_build_time } = this.config;

    return !!isDate(last_build_time);
  }
}

// tslint:enable: variable-name
