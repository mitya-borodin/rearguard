import { isArray, isBoolean, isObject, isString } from "@borodindmitriy/utils";
import {
  IAuthor,
  IBinMap,
  IBugs,
  IConfig,
  IDependencyMap,
  IDirectories,
  IEngines,
  IPackageJSON,
  IPublishConfig,
  IRepository,
  IScriptsMap,
} from "../interfaces/configs/IPackageJSON";
import { IRearguard } from "../interfaces/configs/IRearguard";
import { Rearguard } from "./Rearguard";

export class PackageJSON implements IPackageJSON {
  public readonly name: string;
  public readonly version: string;
  public readonly description?: string;
  public readonly keywords?: string[];
  public readonly homepage: string;
  public readonly bugs: string | IBugs;
  public readonly license: string;
  public readonly author: string | IAuthor;
  public readonly contributors?: string[] | IAuthor[];
  public readonly files: string[];
  public readonly main: string;
  public readonly bin: string | IBinMap;
  public readonly man?: string | string[];
  public readonly directories?: IDirectories;
  public readonly repository: string | IRepository;
  public readonly scripts: IScriptsMap;
  public readonly config?: IConfig;
  public readonly dependencies?: IDependencyMap;
  public readonly devDependencies?: IDependencyMap;
  public readonly peerDependencies?: IDependencyMap;
  public readonly optionalDependencies?: IDependencyMap;
  public readonly bundledDependencies?: string[];
  public readonly engines: IEngines;
  public readonly os?: string[];
  public readonly cpu?: string[];
  public readonly preferGlobal?: boolean;
  public readonly private?: boolean;
  public readonly publishConfig?: IPublishConfig;
  public readonly rearguard: IRearguard;

  constructor(data: Partial<IPackageJSON>) {
    this.name = "";
    this.version = "1.0.0";
    this.homepage = "";
    this.bugs = {
      email: "",
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
    this.rearguard = new Rearguard(data.rearguard || {});

    for (const fieldName of ["name", "version", "homepage", "license", "main", "bin"]) {
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

    for (const fieldName of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
      const result = {};

      if (isObject(data[fieldName])) {
        for (const key in data[fieldName]) {
          if (data[fieldName].hasOwnProperty(key)) {
            if (isString(key) && isString(data[fieldName][key])) {
              result[key] = data[fieldName][key];
            }
          }
        }
      }

      this[fieldName] = result;
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
