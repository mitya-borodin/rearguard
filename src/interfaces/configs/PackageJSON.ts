/**
 * An author or contributor
 */
export interface Author {
  name: string;
  email: string;
  homepage: string;
}

/**
 * A map of exposed bin commands
 */
export interface BinMap {
  [commandName: string]: string;
}

/**
 * A bugs link
 */
export interface Bugs {
  email: string;
  url: string;
}

export interface Config {
  name?: string;
  config?: object;
}

/**
 * A map of dependencies
 */
export interface DependencyMap {
  [dependencyName: string]: string;
}

/**
 * CommonJS package structure
 */
export interface Directories {
  lib?: string;
  bin?: string;
  man?: string;
  doc?: string;
  example?: string;
}

export interface Engines {
  node: string;
  npm: string;
}

export interface PublishConfig {
  registry: string;
  access: string;
}

/**
 * A project repository
 */
export interface Repository {
  type: string;
  url: string;
}

export interface ScriptsMap {
  [commandName: string]: string;
}
