import { isBoolean, isNumber, isObject, isString } from "@rtcts/utils";
import moment from "moment";
import { Moment, isMoment } from "moment";

export class RearguardDev {
  public webpack_dev_server: {
    host: string;
    port: number;
    proxy: { [key: string]: any };
  };
  public webpack_bundle_analyzer: {
    analyzerMode: "server" | "static" | "disabled";
    analyzerHost: string;
    analyzerPort: number;
    reportFilename: string;
    defaultSizes: "parsed" | "stat" | "gzip";
    openAnalyzer: boolean;
    generateStatsFile: boolean;
    statsFilename: string;
    logLevel: "info" | "warn" | "error" | "silent";
  };
  public build: {
    status: "init" | "in_progress" | "done";
    hash_dev: string | void;
    hash_prod: string | void;
    has_last_build_time: boolean;
    last_build_time: Moment;
  };

  constructor(data?: any) {
    this.webpack_dev_server = {
      host: "localhost",
      port: 5000,
      proxy: {
        "/api": "http://localhost:10000",
        "/ws": {
          changeOrigin: true,
          target: "ws://localhost:10001",
          ws: true,
        },
      },
    };

    this.webpack_bundle_analyzer = {
      analyzerMode: "server",
      analyzerHost: "localhost",
      analyzerPort: 20000,
      reportFilename: "webpack_bundle_analyzer",
      defaultSizes: "stat",
      openAnalyzer: true,
      generateStatsFile: false,
      statsFilename: "webpack_bundle_analyzer_stats",
      logLevel: "warn",
    };

    this.build = {
      status: "done",
      hash_dev: "N/A",
      hash_prod: "N/A",
      has_last_build_time: false,
      last_build_time: moment(),
    };

    if (data) {
      if (isObject(data.webpack_dev_server)) {
        if (isString(data.webpack_dev_server.host)) {
          this.webpack_dev_server.host = data.webpack_dev_server.host;
        }
        if (isNumber(data.webpack_dev_server.port)) {
          this.webpack_dev_server.port = data.webpack_dev_server.port;
        }
        if (isObject(data.webpack_dev_server.proxy)) {
          this.webpack_dev_server.proxy = data.webpack_dev_server.proxy;
        }
      }

      if (isObject(data.webpack_bundle_analyzer)) {
        if (["server", "static", "disabled"].includes(data.webpack_bundle_analyzer.analyzerMode)) {
          this.webpack_bundle_analyzer.analyzerMode = data.webpack_bundle_analyzer.analyzerMode;
        }

        for (const fieldName of ["analyzerHost", "reportFilename", "statsFilename"]) {
          if (isString(data.webpack_bundle_analyzer[fieldName])) {
            this.webpack_bundle_analyzer[fieldName] = data.webpack_bundle_analyzer[fieldName];
          }
        }

        if (isNumber(data.webpack_bundle_analyzer.analyzerPort)) {
          this.webpack_bundle_analyzer.analyzerPort = data.webpack_bundle_analyzer.analyzerPort;
        }

        if (["parsed", "stat", "gzip"].includes(data.webpack_bundle_analyzer.defaultSizes)) {
          this.webpack_bundle_analyzer.defaultSizes = data.webpack_bundle_analyzer.defaultSizes;
        }

        for (const fieldName of ["openAnalyzer", "generateStatsFile"]) {
          if (isBoolean(data.webpack_bundle_analyzer[fieldName])) {
            this.webpack_bundle_analyzer[fieldName] = data.webpack_bundle_analyzer[fieldName];
          }
        }

        if (["info", "warn", "error", "silent"].includes(data.webpack_bundle_analyzer.logLevel)) {
          this.webpack_bundle_analyzer.logLevel = data.webpack_bundle_analyzer.logLevel;
        }
      }

      if (isObject(data.build)) {
        if (["init", "in_progress", "done"].includes(data.build.status)) {
          this.build.status = data.build.status;
        }

        for (const fieldName of ["hash_dev", "hash_prod"]) {
          if (isString(data.build[fieldName])) {
            this.build[fieldName] = data.build[fieldName];
          }
        }

        if (isString(data.build.last_build_time)) {
          this.build.has_last_build_time = true;
          this.build.last_build_time = moment(data.build.last_build_time).clone();
        } else if (isMoment(data.build.last_build_time)) {
          this.build.has_last_build_time = true;
          this.build.last_build_time = data.build.last_build_time.clone();
        }
      }
    }
  }
}
