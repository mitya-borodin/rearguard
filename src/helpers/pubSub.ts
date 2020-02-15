import EventEmitter from "eventemitter3";

export enum events {
  SYNCED = "SYNCED",
  RELOAD_BROWSER = "RELOAD_BROWSER",
}

export const pubSub = new EventEmitter();
