import { isArray, isBoolean, isObject, isString } from "@borodindmitriy/utils";

export class Rearguard {
  public bin: string;
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
    runtime: "browser" | "node" | "isomorphic";
    type: "dll" | "app" | "lib" | "mono";
    will_load_on_demand: boolean;
    components: string[];
  };

  public distribution: {
    publish_to_git: boolean;
    publish_to_docker: boolean;

    docker: {
      org_namespace: string;
    };
  };

  public configs: {
    noOverwriteTSConfig: boolean;
    noOverwriteTSTestConfig: boolean;
    noOverwriteLintConfig: boolean;
    noOverwriteGitIgnore: boolean;
  };

  public css: {
    postcssPlugins: string;
    useOnlyIsomorphicStyleLoader: boolean;
  };

  constructor(data?: any) {
    this.bin = "";

    this.webpack = {
      context: "src",
      dll_entry: "vendors.ts",
      entry: "index.tsx",
      lib_entry: "export.ts",
      modules: ["src"],
      output: {
        path: "dist",
        publicPath: "/",
      },
    };

    this.project = {
      will_load_on_demand: false,
      runtime: "browser",
      type: "app",
      components: ["components"],
    };

    this.distribution = {
      publish_to_git: false,
      publish_to_docker: false,
      docker: {
        org_namespace: "org_namespace",
      },
    };

    this.configs = {
      noOverwriteTSConfig: false,
      noOverwriteTSTestConfig: false,
      noOverwriteLintConfig: false,
      noOverwriteGitIgnore: false,
    };

    this.css = {
      postcssPlugins: "postcss.config.js",
      useOnlyIsomorphicStyleLoader: false,
    };

    if (data) {
      if (isString(data.bin)) {
        this.bin = data.bin;
      }

      if (isObject(data.webpack)) {
        for (const fieldName of ["context", "entry", "dll_entry", "lib_entry"]) {
          if (isString(data.webpack[fieldName])) {
            this.webpack[fieldName] = data.webpack[fieldName];
          }
        }

        if (isArray(data.webpack.modules)) {
          this.webpack.modules = [];

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
        if (isBoolean(data.project.will_load_on_demand)) {
          this.project.will_load_on_demand = data.project.will_load_on_demand;
        }

        if (["browser", "node", "isomorphic"].includes(data.project.runtime)) {
          this.project.runtime = data.project.runtime;
        }

        if (["dll", "app", "lib", "mono"].includes(data.project.type)) {
          this.project.type = data.project.type;
        }

        if (isArray(data.project.components)) {
          this.project.components = [];

          for (const item of data.project.components) {
            this.project.components.push(item);
          }
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

      if (isObject(data.configs)) {
        for (const item of [
          "noOverwriteTSConfig",
          "noOverwriteTSTestConfig",
          "noOverwriteLintConfig",
          "noOverwriteGitIgnore",
        ]) {
          if (isBoolean(data.configs[item])) {
            this.configs[item] = data.configs[item];
          }
        }
      }

      if (isObject(data.css)) {
        if (isString(data.css.postcssPlugins)) {
          this.css.postcssPlugins = data.css.postcssPlugins;
        }
        if (isBoolean(data.css.useOnlyIsomorphicStyleLoader)) {
          this.css.useOnlyIsomorphicStyleLoader = data.css.useOnlyIsomorphicStyleLoader;
        }
      }

      if (this.project.runtime === "isomorphic") {
        this.css.useOnlyIsomorphicStyleLoader = true;
      }
    }
  }

  public toJSON(): object {
    if (this.project.type === "mono") {
      return {
        project: {
          type: this.project.type,
          components: this.project.components,
        },
      };
    }

    const project = {
      project: {
        runtime: this.project.runtime,
        type: this.project.type,
      },
    };

    const appDistribution = {
      distribution: {
        publish_to_docker: this.distribution.publish_to_docker,
        docker: this.distribution.docker,
      },
    };

    if (this.project.runtime === "node" && this.project.type === "app") {
      return {
        bin: this.bin,
        ...{
          ...project,
          components: this.project.components,
        },
        ...appDistribution,
        configs: this.configs,
      };
    }

    if (this.project.runtime === "node" && this.project.type === "lib") {
      return {
        ...project,
        distribution: {
          publish_to_git: this.distribution.publish_to_git,
        },
        configs: this.configs,
      };
    }

    if (
      (this.project.runtime === "isomorphic" || this.project.runtime === "browser") &&
      this.project.type === "lib"
    ) {
      return {
        webpack: this.webpack,
        project: {
          runtime: this.project.runtime,
          type: this.project.type,
          will_load_on_demand: this.project.will_load_on_demand,
        },
        distribution: {
          publish_to_git: this.distribution.publish_to_git,
        },
        configs: this.configs,
        css:
          this.project.runtime === "isomorphic"
            ? { postcssPlugins: this.css.postcssPlugins }
            : { ...this.css },
      };
    }

    if (this.project.runtime === "browser") {
      if (this.project.type === "app") {
        return {
          webpack: this.webpack,
          ...{
            ...project,
            components: this.project.components,
          },
          ...appDistribution,
          configs: this.configs,
          css: { ...this.css },
        };
      }

      if (this.project.type === "dll") {
        return {
          webpack: {
            context: this.webpack.context,
            dll_entry: this.webpack.dll_entry,
          },
          ...project,
          distribution: {
            publish_to_git: this.distribution.publish_to_git,
          },
        };
      }
    }

    return this;
  }
}
