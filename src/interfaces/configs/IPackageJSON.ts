/**
 * An author or contributor
 */
export interface IAuthor {
  name: string;
  email: string;
  homepage: string;
}

/**
 * A map of exposed bin commands
 */
export interface IBinMap {
  [commandName: string]: string;
}

/**
 * A bugs link
 */
export interface IBugs {
  email: string;
  url: string;
}

export interface IConfig {
  name?: string;
  config?: object;
}

/**
 * A map of dependencies
 */
export interface IDependencyMap {
  [dependencyName: string]: string;
}

/**
 * CommonJS package structure
 */
export interface IDirectories {
  lib?: string;
  bin?: string;
  man?: string;
  doc?: string;
  example?: string;
}

export interface IEngines {
  node: string;
  npm: string;
}

export interface IPublishConfig {
  registry: string;
  access: string;
}

/**
 * A project repository
 */
export interface IRepository {
  type: string;
  url: string;
}

export interface IScriptsMap {
  [commandName: string]: string;
}
