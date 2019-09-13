import { isArray, isBoolean, isObject, isString } from "@borodindmitriy/utils";
import { IRearguard } from "../interfaces/configs/IRearguard";

export class Rearguard implements IRearguard {
  public webpack: {
    context: string;
    entry: string;
    dll_entry: string;
    lib_entry: string;
    modules: string[];
    output: {
      path: string;
      publicPath: string;
    };
  };

  public project: {
    deps: string[];
    will_load_on_demand: boolean;
    runtime: "browser" | "node" | "isomorphic";
    type: "app" | "lib";
  };

  public distribution: {
    publish_to_git: boolean;
    publish_to_docker: boolean;

    docker: {
      org_namespace: string;
    };
  };

  public postcss_plugins: string;

  constructor(data: Partial<IRearguard>) {
    this.webpack = {
      context: "src",
      entry: "index.tsx",
      dll_entry: "vendors.ts",
      lib_entry: "export.ts",
      modules: ["src"],
      output: {
        path: "dist",
        publicPath: "/",
      },
    };

    this.project = {
      deps: [],
      will_load_on_demand: false,
      runtime: "browser",
      type: "app",
    };

    this.distribution = {
      publish_to_git: false,
      publish_to_docker: false,
      docker: {
        org_namespace: "org_namespace",
      },
    };

    this.postcss_plugins = "";

    if (isObject(data.webpack)) {
      for (const fieldName of ["context", "entry", "dll_entry", "lib_entry"]) {
        if (isString(data.webpack[fieldName])) {
          this.webpack[fieldName] = data.webpack[fieldName];
        }
      }

      if (isArray(data.webpack.modules)) {
        for (const module of data.webpack.modules) {
          this.webpack.modules.push(module);
        }
      }

      if (isObject(data.webpack.output)) {
        for (const fieldName of ["path", "publicPath"]) {
          if (isString(data.webpack.output[fieldName])) {
            this.webpack.output[fieldName] = data.webpack.output[fieldName];
          }
        }
      }
    }

    if (isObject(data.project)) {
      if (isArray(data.project.deps)) {
        for (const dep of data.project.deps) {
          this.project.deps.push(dep);
        }
      }

      if (isBoolean(data.project.will_load_on_demand)) {
        this.project.will_load_on_demand = data.project.will_load_on_demand;
      }

      if (["browser", "node", "isomorphic"].includes(data.project.runtime)) {
        this.project.runtime = data.project.runtime;
      }

      if (["app", "lib"].includes(data.project.type)) {
        this.project.type = data.project.type;
      }
    }

    if (isObject(data.distribution)) {
      for (const fieldName of ["publish_to_git", "publish_to_docker"]) {
        if (isBoolean(data.distribution[fieldName])) {
          this.distribution[fieldName] = data.distribution[fieldName];
        }
      }

      if (isObject(data.distribution.docker)) {
        for (const fieldName of ["org_namespace"]) {
          if (isString(data.distribution.docker[fieldName])) {
            this.distribution.docker[fieldName] = data.distribution.docker[fieldName];
          }
        }
      }
    }

    if (isString(data.postcss_plugins)) {
      this.postcss_plugins = data.postcss_plugins;
    }
  }
}
