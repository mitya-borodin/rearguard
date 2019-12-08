import EventEmitter from "eventemitter3";

export enum events {
  SYNCED = "SYNCED",
}

export const pubSub = new EventEmitter();
