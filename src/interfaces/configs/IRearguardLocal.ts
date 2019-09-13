import { Moment } from "moment";

export interface IRearguardLocal {
  webpack_dev_server: {
    host: string;
    port: number;
    proxy: { [key: string]: any };
  };
  webpack_bundle_analyzer: {
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
  build: {
    status: "init" | "in_progress" | "done";
    hash_dev: string | void;
    hash_prod: string | void;
    has_last_build_time: boolean;
    last_build_time: Moment;
  };
}
