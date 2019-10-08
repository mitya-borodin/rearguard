import { isArray, isBoolean, isObject, isString } from "@borodindmitriy/utils";
import {
  Author,
  BinMap,
  Bugs,
  Config,
  DependencyMap,
  Directories,
  Engines,
  PublishConfig,
  Repository,
  ScriptsMap,
} from "../interfaces/configs/PackageJSON";
import { Rearguard } from "./Rearguard";

export class PackageJSON {
  public readonly name: string;
  public readonly version: string;
  public readonly description?: string;
  public readonly keywords?: string[];
  public readonly homepage: string;
  public readonly bugs: string | Readonly<Bugs>;
  public readonly license: string;
  public readonly author: string | Readonly<Author>;
  public readonly contributors?: string[] | Readonly<Author>[];
  public readonly files: string[];
  public readonly main: string;
  public readonly types: string;
  public readonly bin: string | Readonly<BinMap>;
  public readonly man?: string | string[];
  public readonly directories?: Readonly<Directories>;
  public readonly repository: string | Readonly<Repository>;
  public readonly scripts: Readonly<ScriptsMap>;
  public readonly config?: Readonly<Config>;
  public readonly dependencies?: Readonly<DependencyMap>;
  public readonly devDependencies?: Readonly<DependencyMap>;
  public readonly peerDependencies?: Readonly<DependencyMap>;
  public readonly optionalDependencies?: Readonly<DependencyMap>;
  public readonly bundledDependencies?: string[];
  public readonly engines: Engines;
  public readonly os?: string[];
  public readonly cpu?: string[];
  public readonly preferGlobal?: boolean;
  public readonly private?: boolean;
  public readonly publishConfig?: Readonly<PublishConfig>;
  public readonly rearguard: Readonly<Rearguard>;
  public readonly husky: {
    hooks: {
      ["pre-commit"]: string;
      ["pre-push"]: string;
    };
  };

  constructor(data: any) {
    this.name = "";
    this.version = "1.0.0";
    this.homepage = "";
    this.bugs = {
      email: "dmitriy@borodin.site",
      url: "",
    };
    this.license = "MIT";
    this.author = {
      name: "Dmitriy Borodin",
      email: "dmitriy@borodin.site",
      homepage: "https://borodin.site",
    };
    this.files = [];
    this.main = "";
    this.types = "";
    this.bin = "";
    this.repository = {
      type: "",
      url: "",
    };
    this.scripts = {};
    this.engines = {
      node: ">=10 <11",
      npm: ">=6 <7",
    };
    this.husky = {
      hooks: {
        ["pre-commit"]: "pretty-quick --staged",
        ["pre-push"]: "npm run validate",
      },
    };
    this.rearguard = new Rearguard(data.rearguard || {});

    for (const fieldName of ["name", "version", "homepage", "license", "main", "types", "bin"]) {
      if (isString(data[fieldName])) {
        this[fieldName] = data[fieldName];
      }
    }

    if (isString(data.bugs)) {
      this.bugs = data.bugs;
    } else if (isObject(data.bugs)) {
      for (const fieldName of ["email", "url"]) {
        if (isString(data.bugs[fieldName])) {
          this.bugs[fieldName] = data.bugs[fieldName];
        }
      }
    }

    if (isString(data.author)) {
      this.author = data.author;
    } else if (isObject(data.author)) {
      for (const fieldName of ["name", "email", "homepage"]) {
        if (isString(data.author[fieldName])) {
          this.author[fieldName] = data.author[fieldName];
        }
      }
    }

    if (isArray(data.files)) {
      for (const file of data.files) {
        if (isString(file)) {
          this.files.push(file);
        }
      }
    }

    if (isString(data.repository)) {
      this.repository = data.repository;
    } else if (isObject(data.repository)) {
      for (const fieldName of ["type", "url"]) {
        if (isString(data.repository[fieldName])) {
          this.repository[fieldName] = data.repository[fieldName];
        }
      }
    }

    if (isObject(data.scripts)) {
      this.scripts = data.scripts;
    }

    if (isString(data.engines)) {
      this.engines = data.engines;
    } else if (isObject(data.engines)) {
      for (const fieldName of ["node", "npm"]) {
        if (isString(data.engines[fieldName])) {
          this.engines[fieldName] = data.engines[fieldName];
        }
      }
    }

    if (isObject(data.husky) && isObject(data.husky.hooks)) {
      for (const fieldName of Object.keys(data.husky.hooks)) {
        if (isString(data.husky.hooks[fieldName])) {
          this.husky.hooks[fieldName] = data.husky.hooks[fieldName];
        }
      }
    }

    if (isString(data.description)) {
      this.description = data.description;
    }

    if (Array.isArray(data.keywords)) {
      this.keywords = [];

      for (const keyword of data.keywords) {
        if (isString(keyword)) {
          this.keywords.push(keyword);
        }
      }
    }

    if (isString(data.contributors)) {
      this.contributors = [];

      for (const contributor of data.contributors) {
        if (isString(contributor)) {
          this.contributors.push(contributor as any);
        } else if (isObject(data.contributors)) {
          const result = {};

          for (const fieldName of ["name", "email", "homepage"]) {
            if (isString(data.contributors[fieldName])) {
              contributor[fieldName] = data.contributors[fieldName];
            }
          }

          this.contributors.push(result as any);
        }
      }
    }

    if (isArray(data.man)) {
      this.man = [];

      for (const item of data.man) {
        if (isString(item)) {
          this.man.push(item);
        }
      }
    } else if (isString(data.man)) {
      this.man = data.man;
    }

    if (isObject(data.directories)) {
      this.directories = {};

      for (const fieldName of ["lib", "bin", "man", "doc", "example"]) {
        if (isString(data.directories[fieldName])) {
          this.directories[fieldName] = data.directories[fieldName];
        }
      }
    }

    for (const fieldName of [
      "dependencies",
      "devDependencies",
      "peerDependencies",
      "optionalDependencies",
    ]) {
      if (isObject(data[fieldName])) {
        const result = {};

        for (const key in data[fieldName]) {
          if (data[fieldName].hasOwnProperty(key)) {
            if (isString(key) && isString(data[fieldName][key])) {
              result[key] = data[fieldName][key];
            }
          }
        }
        this[fieldName] = result;
      }
    }

    for (const fieldName of ["bundledDependencies", "os", "cpu"]) {
      if (isArray(data[fieldName])) {
        this[fieldName] = [];

        for (const item of data[fieldName]) {
          if (isString(item)) {
            this[fieldName].push(item);
          }
        }
      }
    }

    for (const fieldName of ["preferGlobal", "private"]) {
      if (isBoolean(data[fieldName])) {
        this[fieldName] = data[fieldName];
      }
    }

    if (isObject(data.publishConfig)) {
      this.publishConfig = {
        registry: "",
        access: "",
      };

      for (const fieldName of ["registry", "access"]) {
        if (isString(data.publishConfig[fieldName])) {
          this.publishConfig[fieldName] = data.publishConfig[fieldName];
        }
      }
    }
  }
}
